'use strict';

// const ProductService = require("../services/product.service");//v1
const ProductServiceV2 = require("../services/product.service.xxx");

const { OK, CREATED, SuccessResponse } = require('../core/success.response')

class ProductController {

    // //v1
    // createProduct = async (req, res, next) => {
    //     new SuccessResponse({
    //         message: 'Create new product successfully',
    //         metadata: await ProductService.createProduct(req.body.product_type, {
    //             ...req.body,
    //             product_shop: req.user.userId
    //         })
    //     }).send(res)
    // }


    createProduct = async (req, res) => {
        new CREATED({
            message: 'Create new product successfully',
            metadata: await ProductServiceV2.createProduct(req.body.product_type, {
                ...req.body,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    updateProduct = async (req, res) => {

        new SuccessResponse({
            message: 'update product successfully',
            metadata: await ProductServiceV2.updateProduct(req.body.product_type, req.params.productId , {
                ...req.body,
                product_shop : req.user.userId
            })
        }).send(res)
    }

    publishProductByShop = async (req, res) => {
        new SuccessResponse({
            message: 'publish Product By Shop successfully',
            metadata: await ProductServiceV2.publishProductByShop( {
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }

    unPublishProductByShop = async (req, res) => {
        new SuccessResponse({
            message: 'Un publish Product By Shop successfully',
            metadata: await ProductServiceV2.unPublishProductByShop({
                product_id: req.params.id,
                product_shop: req.user.userId
            })
        }).send(res)
    }
    /**
     * @description get all drafts products for shop
     * @param {number} limit 
     * @param {number} skip
     */
    getAllDraftsForShop = async (req, res) => {
        new SuccessResponse({
            message: 'Get all drafts for shop successfully',
            metadata: await ProductServiceV2.findAllDraftsForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }


    getAllPublishForShop = async (req, res) => {
        new SuccessResponse({
            message: 'Get all publish for shop successfully',
            metadata: await ProductServiceV2.findAllPublishForShop({
                product_shop: req.user.userId
            })
        }).send(res)
    }

    getListSearchProduct = async (req, res) => {
        new SuccessResponse({
            message: 'Get list search product for  successfully',
            metadata: await ProductServiceV2.getListSearchProduct(req.params)
        }).send(res)
    }

    findAllProducts = async (req, res) => {
        new SuccessResponse({
            message: 'Get list find all Product successfully',
            metadata: await ProductServiceV2.findAllProducts(req.query)
        }).send(res)
    }


    findProduct = async (req, res) => {
        new OK({
            message: 'Get list find Product successfully',
            metadata: await ProductServiceV2.findProduct({
                product_id: req.params.product_id
            })
        }).send(res)
    }
  
}

module.exports = new ProductController()