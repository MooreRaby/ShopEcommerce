'use strict';

const express = require('express');
const { asyncHandler } = require('../../helpers/asyncHandler');
const { authenticationV2 } = require('../../auth/authUtils');
const categoryController = require('../../controllers/category.controller');
const router = express.Router();


router.post('', asyncHandler(categoryController.createCategory));
router.get('', asyncHandler(categoryController.getCategories));
router.patch('/:categoryId', asyncHandler(categoryController.updateCategory));
router.get('/all', asyncHandler(categoryController.getAllCategories));

module.exports = router