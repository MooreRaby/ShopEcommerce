'use strict';

const USER = require('../models/user.model');
const { createUser, updateUser } = require('../models/repositories/user.repo');
const { BadRequestError, ErrorResponse, AuthFailureError } = require('../core/error.response');
const { sendEmailToken } = require('./email.service');
const { checkEmailToken } = require('./otp.service');
const { createTokenPair, generateKeyPair } = require("../auth/authUtils");
const bcrypt = require('bcrypt');
const { getInfoData } = require('../utils');
const { findRoleByName } = require('../models/repositories/role.repo');
const { getRedis } = require('../dbs/init.redis'); // Import getRedis
const userModel = require('../models/user.model');
const keyTokenService = require('./keyToken.service');


const { instanceConnect: redisClient } = getRedis();

// const CACHE_EXPIRY = 600; // 10 minutes

// const getCachedUser = async (usr_email) => {
//     const cachedUser = await redisClient.get(`user:${usr_email}`);
//     return cachedUser ? JSON.parse(cachedUser) : null;
// };

// const setCachedUser = async (usr_email, user) => {
//     await redisClient.set(`user:${usr_email}`, JSON.stringify(user), 'EX', CACHE_EXPIRY);
// };


// signup: send email 
const verifyEmail = async ({ usr_email = null, captcha = null }) => {
    const existingUser = await USER.findOne({ usr_email: usr_email }).lean();

    if (existingUser) {
        if (existingUser.usr_status === 'active') {
            throw new BadRequestError('Email already registered ', 409);
        } else if (existingUser.usr_status === 'pending') {
            const result = await sendEmailToken({ email: usr_email });
            return {
                message: 'Verification email resent',
                metadata: { token: result },
            };
        }
    } else {
        const result = await sendEmailToken({ email: usr_email });
        return {
            message: 'Verification email sent',
            metadata: { token: result }
        };
    }
};



// signup: verify otp(email) and create user
const verifyOTPService = async ({ otp }) => {
    const verifiedEmail = await checkEmailToken({ otp });

    if (!verifiedEmail) {
        throw new ErrorResponse('Invalid OTP');
    }

    const existingUser = await USER.findOne({ usr_email: verifiedEmail.otp_email }).lean();
    if (existingUser) {
        throw new ErrorResponse('User already exists');
    }

    const user = await createUser({
        usr_email: verifiedEmail.otp_email,
        usr_status: 'pending' // Đánh dấu email đã xác minh nhưng chưa hoàn tất đăng ký
    });

    return {
        status: 200,
        message: 'Email verified',
        metadata: getInfoData({
            fields: [ "_id", "usr_email", "usr_status" ],
            object: user
        })
    };
};

// complete signup - set username, password, avatar, etc.

const completeRegistrationService = async ({ usr_email, usr_password, usr_name }) => {
    const user = await USER.findOne({ usr_email: usr_email }).lean();

    if (!user) {
        throw new ErrorResponse('Email not found');
    }

    if (user.usr_status !== 'pending') {
        throw new ErrorResponse('Email not verified or already registered');
    }

    const passwordHash = await bcrypt.hash(usr_password, 8);

    const role = await findRoleByName('user');
    if (!role) {
        throw new ErrorResponse('Role not found');
    }

    const updatedUser = await updateUser(
        { usr_email: usr_email },
        {
            usr_slug: usr_name,
            usr_name: usr_name,
            usr_password: passwordHash,
            usr_role: role._id,
            usr_status: 'active' // Cập nhật trạng thái thành active khi đăng ký hoàn tất
        }
    );

    const { publicKey, privateKey } = await generateKeyPair();

    const keyStore = await keyTokenService.createUserToken({
        id: updatedUser._id,
        publicKey,
        privateKey
    });

    if (!keyStore) {
        throw new ErrorResponse("Error: keyString is required");
    }

    const tokens = await createTokenPair(
        { userId: updatedUser._id, usr_email },
        publicKey,
        privateKey
    );

    return {
        status: 201,
        message: 'Signup complete',
        metadata: {
            user: getInfoData({
                fields: [ "_id", "usr_name", "usr_email" ],
                object: updatedUser
            }),
            tokens
        }
    };
};



const login = async ({ usr_email, usr_password, refreshToken = null }) => {

    const foundUser = await findByEmail({ usr_email });
    //1
    if (!foundUser) {
        throw new BadRequestError("Error: User not registered");
    }
    //2
    const match = await bcrypt.compare(usr_password, foundUser.usr_password);
    if (!match) throw new AuthFailureError("password incorrect");

    //3
    const { publicKey, privateKey } = await generateKeyPair()

    //4
    const { _id: userId } = foundUser._id;
    const tokens = await createTokenPair(
        { userId, usr_email },
        publicKey,
        privateKey
    );

    console.log(tokens, "Tokenssss");

    await keyTokenService.createUserToken({
        id: userId,
        refreshToken: tokens.refreshToken,
        privateKey,
        publicKey
    });

    return {
        message: "Login successful",
        metadata: {
            user: getInfoData({
                fields: [ "_id", "usr_name", "usr_email" ],
                object: foundUser
            }),
            tokens
        },
        status: 200
    }
}

const logout = async (keyStore) => {
    console.log("abc  " + keyStore._id)
    const delKey = await keyTokenService.deleteUserKeyById(keyStore._id)
    console.log({ delKey })
    return delKey
}


// Clear all cache in Redis (dangerously)
const clearAllCache = async () => {
    try {
        await redisClient.flushAll()
        return {
            message: 'All cache cleared successfully',
        };
    } catch (error) {
        console.error("Error in clearAllCache:", error);
        throw new ErrorResponse(error.message || 'An unknown error occurred while clearing cache', {
            originalError: error,
            status: error.status || 500
        });
    }
};

const handleRefreshToken = async () => {

}

const findByEmail = async ({ usr_email, select = {
    usr_email: 1, usr_password: 2, usr_name: 1, usr_status: 1, usr_roles: 1
} }) => {
    try {
        const user = await userModel.findOne({ usr_email: usr_email }).select(select).lean()
        return user;
    } catch (error) {
        throw new Error(error)
    }

}


module.exports = {
    verifyEmail,
    verifyOTPService,
    completeRegistrationService,
    login,
    clearAllCache,
    handleRefreshToken,
    logout
};
