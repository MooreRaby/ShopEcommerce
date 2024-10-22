'use strict';

const Joi = require('joi');



const refreshTokens = {
    body: Joi.object().keys({
        refreshToken: Joi.string().required(),
    }),
};


const verifyOtp = {
    body: Joi.object().keys({
        otp: Joi.string().required(),
    }),
};

module.exports = {
    refreshTokens,
    verifyOtp
};