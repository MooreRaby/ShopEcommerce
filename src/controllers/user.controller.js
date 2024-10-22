"use strict";

const { SuccessResponse } = require("../core/success.response");
const passport = require("passport");
const {
    verifyEmail,
    verifyOTPService,
    completeRegistrationService,
} = require("../services/user.service");
const UserService = require('../services/user.service');
const { BadRequestError, ErrorResponse } = require("../core/error.response");

class UserController {
    //new user
    verifyEmail = async (req, res, next) => {
       
            const respond = await verifyEmail({
                usr_email: req.body.usr_email,
            });

            new SuccessResponse(respond).send(res);
        
    };

    // check user token via email
    checkOtp = async (req, res, next) => {
            const { otp = null } = req.body;

            console.log(req.body);

            if (!otp) {
                throw new BadRequestError({
                    message: "OTP inCorrect",
                    status: 400,
                });
            }

            const respond = await verifyOTPService({ otp });

            new SuccessResponse({
                message: respond.message,
                metadata: respond.metadata,
            }).send(res);
       
    };

    // complete
    signup = async (req, res, next) => {
     
            const respond = await completeRegistrationService({
                usr_email: req.body.usr_email,
                usr_password: req.body.usr_password,
                usr_name: req.body.usr_name,
            });

            new SuccessResponse({
                status: respond.status,
                message: respond.message,
                metadata: respond.metadata,
            }).send(res);
       
    };


    // Handle Google OAuth authentication
    authGG = passport.authenticate('google', {
        scope: [ 'profile', 'email' ],
    });

    // Handle Facebook OAuth authentication
    authFb = passport.authenticate('facebook');

    // Handle Google OAuth callback
    authGoogleCallback = async (req, res, next) => {
        passport.authenticate('google', (err, user) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                new SuccessResponse({
                    message: "Logged in successfully",
                    metadata: { user },
                }).send(res);
            });
        })(req, res, next);
    };

    // Handle Facebook OAuth callback
    authFacebookCallback = async (req, res, next) => {
        passport.authenticate('facebook', (err, user) => {
            if (err) {
                return res.status(400).json({ error: err.message });
            }
            if (!user) {
                return res.status(400).json({ error: 'User not found' });
            }
            req.logIn(user, (err) => {
                if (err) {
                    return res.status(400).json({ error: err.message });
                }
                new SuccessResponse({
                    message: "Logged in successfully",
                    metadata: { user },
                }).send(res);
            });
        })(req, res, next);
    };


    login = async (req, res) => {
        const { usr_email } = req.body
        if (!usr_email) {
            throw new BadRequestError('email missing.....')
        }
        const sendData = Object.assign(
            { requestId: req.requestId },
            req.body
        )
        console.log(JSON.stringify(sendData) + "send data");
        const { status, ...result } = await UserService.login(sendData)
        if (status === 200) {
            new SuccessResponse(result).send(res)
        } else {
            console.log(result + "result...");
            new ErrorResponse({
                message: result.message,
                metadata: result.metadata
            }).send(res)
        }
    }

    logout = async (req, res) => {
        new SuccessResponse({
            message: 'Logged out successfully',
            metadata: await UserService.logout(req.keyStore)
        }).send(res)
    }

    // handlerRefreshToken = async (req, res, next) => {

    // }

    clearAllCache = async (req, res, next) => {
        
            const response = await UserService.clearAllCache()
            new SuccessResponse({
                message: 'All cache cleared successfully',
                metadata: response
            }).send(res)
        
    }
}

module.exports = new UserController();
