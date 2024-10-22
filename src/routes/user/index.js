'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const { userValidation , authValidation} = require('../../validations/index')
const { celebrate, errors } = require('celebrate');
const { verifyEmail, checkOtp, signup,
    login, logout, authGG,
    authFb, authGoogleCallback,
    authFacebookCallback, handlerRefreshToken,
    clearAllCache } = require('../../controllers/user.controller')
const router = express.Router()


router.post('/clearAllCache', asyncHandler(clearAllCache))// dangerous
router.post('/verify-email', celebrate(userValidation.verifyEmailUser),asyncHandler(verifyEmail))
router.post('/check-otp', celebrate(authValidation.verifyOtp), asyncHandler(checkOtp))
router.post('/signup', celebrate(userValidation.signup) ,asyncHandler(signup))
router.post('/login', celebrate(userValidation.login), asyncHandler(login))


// oauth
router.get('/auth/google', authGG)
router.get('/auth/facebook', authFb)

//callback
router.get('/auth/facebook/callback', asyncHandler(authGoogleCallback))
router.get('/auth/google/callback', asyncHandler(authFacebookCallback))

// authentication
router.use(authenticationV2)
router.post('/logout', celebrate(userValidation.logout), asyncHandler(logout))
router.post('/handlerRefreshToken', celebrate(authValidation.refreshTokens), asyncHandler(handlerRefreshToken))

// Xử lý lỗi validation của Celebrate
router.use(errors());

module.exports = router