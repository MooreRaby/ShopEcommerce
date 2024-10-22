const Joi = require('joi');
const { password, objectId } = require('./custom.validation');
const { HEADER } = require('../utils/constant');
const {  Segments } = require('celebrate');


const verifyEmailUser = {

    body: Joi.object().keys({
        usr_email: Joi.string().required().email()
    })
}


const signup = {
    body: Joi.object().keys({
        usr_email: Joi.string().required().email(),
        usr_password: Joi.string().required().custom(password),
        usr_name: Joi.string().required(),
    }),
};

const login = {
    body: Joi.object().keys({
        usr_email: Joi.string().required(),
        usr_password: Joi.string().required(),
    }),
};

const logout = {
    [ Segments.HEADERS ]: Joi.object({
        [HEADER.AUTHORIZATION]: Joi.string().required().description('Authorization token is required'),
        [HEADER.CLIENT_ID]: Joi.string().optional().description('Optional Client id')
    }).unknown()
};

const refreshTokens = {
    body: Joi.object({
        refreshToken: Joi.string().required(),
    }),
};

const forgotPassword = {
    body: Joi.object().keys({
        usr_email: Joi.string().email().required(),
    }),
};

const resetPassword = {
    query: Joi.object().keys({
        token: Joi.string().required(),
    }),
    body: Joi.object().keys({
        password: Joi.string().required().custom(password),
    }),
};



const getUsers = {
    query: Joi.object().keys({
        name: Joi.string(),
        role: Joi.string(),
        sortBy: Joi.string(),
        limit: Joi.number().integer(),
        page: Joi.number().integer()
    }),
};

const getUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

const updateUser = {
    params: Joi.object().keys({
        userId: Joi.required().custom(objectId),
    }),
    body: Joi.object()
        .keys({
            email: Joi.string().email(),
            password: Joi.string().custom(password),
            name: Joi.string(),
        })
        .min(1),
};

const deleteUser = {
    params: Joi.object().keys({
        userId: Joi.string().custom(objectId),
    }),
};

module.exports = {
    signup,
    login,
    logout,
    refreshTokens,
    forgotPassword,
    resetPassword,
    verifyEmailUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser,
};