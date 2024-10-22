'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')
const { authenticationV2 } = require('../../auth/authUtils')
const uploadController= require('../../controllers/upload.controller')
const { uploadDisk } = require('../../configs/multer.config')
const router = express.Router()

// router.use(authenticationV2)
router.post('/product/upload', asyncHandler(uploadController.uploadFileThumb))
// router.post('/product/thumb',uploadDisk.single('file'), asyncHandler(uploadController.uploadFileThumb))
router.post('/product/thumb', uploadDisk.array('file', 9), asyncHandler(uploadController.uploadMultipleFileThumb))


module.exports = router