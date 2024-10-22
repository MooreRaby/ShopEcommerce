'use strict';

const randomstring = require('randomstring');

//model otp
const OTP = require('../models/otp.model')

const generatorTokenRandom = () => {
    return randomstring.generate({
        length: 6,
        charset: 'numeric'
    });
}

const newOtp = async ({ email }) => {
    const otp = generatorTokenRandom();

    // Kiểm tra xem OTP đã tồn tại cho email này hay chưa
    const existingOTP = await OTP.findOne({ otp_email: email });

    if (existingOTP) {
        // Nếu OTP đã tồn tại, cập nhật với mã OTP mới
        existingOTP.otp_token = otp;
        await existingOTP.save();
        return existingOTP;
    } else {
        // Nếu OTP chưa tồn tại, tạo mới
        const newOTP = await OTP.create({
            otp_token: otp,
            otp_email: email
        });
        return newOTP;
    }
}

const checkEmailToken = async ({
    otp
}) => {

    // clgtest
    console.log(otp + "token9999");
    // check token in model otp
    const foundToken = await OTP.findOne({
        otp_token: otp
    })

    if (foundToken) {
        console.log('token found', foundToken);
    } else {
        throw new Error('token not found')
    }

    // delete token from model
    OTP.deleteOne({ otp_token: otp }).then()

    return foundToken
}

module.exports = {
    newOtp,
    checkEmailToken
}