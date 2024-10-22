'use strict';

const { SuccessResponse , CREATED, OK} = require('../core/success.response');
const CategoryService = require('../services/category.service');

class CategoryController  {


    createCategory = async (req, res, next) => {
        new CREATED({
            message: 'Create new category successfully',
            metadata: await CategoryService.createCategory(req.body)
        }).send(res)
    }


    getCategories = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get categories successfully',
            metadata: await CategoryService.getCategories(req.query)
        }).send(res)
    }

    updateCategory = async (req, res, next) => {
        new SuccessResponse({
            message: 'Update category successfully',
            metadata: await CategoryService.updateCategory(req.body)
        }).send(res)
    }

    getAllCategories = async (req, res, next) => {
        new SuccessResponse({
            message: 'Get all categories successfully',
            metadata: await CategoryService.getAllCategories()
        }).send(res)
    }
}


module.exports = new CategoryController()