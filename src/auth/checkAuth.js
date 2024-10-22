'use strict';

const { findById } = require("../services/apikey.service");


const HEADER = {
    API_KEY: 'x-api-key',
    AUTHORIZATION: 'authorization',
}


const apiKey = async (req,res,next) => {
    try {
        const key = req.headers[ HEADER.API_KEY ]?.toString() 
        if (!key) {
            return res.status(401).json({
                message: 'API Key is missing'
            })
        }
        //check objectKey
        const objKey = await findById(key)
        if (!objKey) {
            return res.status(401).json({
                message: 'API Key is invalid'
            })
        }
        req.objKey = objKey
        return next()
    } catch (error) {
        throw new Error(error)
    }
}


const permission = (permission) => {
    return (req, res, next) => {
        if (!req.objKey.permissions) {
            return res.status(403).json({
                message: 'permission denied'
            })
        }
        console.log('permissions:: ' + req.objKey.permissions)
        const validPermissions = req.objKey.permissions.includes(permission)
        if (!validPermissions) {
            return res.status(403).json({
                message: 'permission denied'
            })
        }
        return next()
    }
}

const asyncHandler = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next)
    }
}


module.exports = {
    apiKey,
    permission,
    asyncHandler
}