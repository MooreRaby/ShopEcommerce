'use strict';

const AccessService = require("../services/access.service");
const { OK, CREATED, SuccessResponse } = require('../core/success.response');
const { BadRequestError, ErrorResponse } = require("../core/error.response");

class AccessController {

    handlerRefreshToken = async (req, res, next) => {
        // new SuccessResponse({
        //     message: 'Get token successfully',
        //     metadata: await AccessService.handlerRefreshToken(req.body.refreshToken)
        // }).send(res)

        new SuccessResponse({
            message: 'Get token success!',
            metadata: await AccessService.handlerRefreshTokenV2({
                refreshToken: req.refreshToken,
                user: req.user,
                keyStore: req.keyStore
            })
        }).send(res)
    }


    logout = async (req, res, next) => {
        new SuccessResponse({
            message: 'Logged out successfully',
            metadata: await AccessService.logout(req.keyStore)
        }).send(res)
    }


    login = async (req, res, next) => {
        const { email } = req.body
        if (!email) {
            throw new BadRequestError('email missing.....')
        }
        const sendData = Object.assign(
            { requestId: req.requestId },
            req.body
        )
        const { status, ...result } = await AccessService.login(sendData)
        if (status === 200) {
            new SuccessResponse({
                metadata: result
            }).send(res)
        } else {
            new ErrorResponse({
                metadata: result
            }).send(res)
        }

    }

    signUp = async (req, res, next) => {

        new CREATED({
            message: 'Registered successfully',
            metadata: await AccessService.signUp(req.body),
            options: {
                limit: 10
            }
        }).send(res)

    }

    forgotPassword = async (req, res, next) => {
        new SuccessResponse({
            message: 'Reset password successfully',
            metadata: await AccessService.forgotPassword(req.body)
        }).send(res)
    }

    resetPassword = async (req, res, next) => {

    }

    sendVerificationEmail = async (req, res, next) => {

    }

    verifyEmail = async (req, res, next) => {

    }
}

module.exports = new AccessController()