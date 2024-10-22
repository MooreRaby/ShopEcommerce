'use strict';

const { Schema, model } = require('mongoose'); // Erase if already required
const KEY_TOKEN_NAME = 'Key'
const KEY_TOKEN_COLLECTION_NAME = 'Keys'

// Declare the Schema of the Mongo model
var keyTokenSchema = new Schema({

    privateKey: {
        type: String,
        required: true,
    },

    publicKey: {
        type: String,
        required: true,
    },

    refreshTokensUsed: {
        type: Array,
        default: [],
    },
    refreshToken: {
        type: String,
        trim: true,
        required: true,
        default: ''
    }
}, {
    timestamps: true,
    discriminatorKey: 'userType', // Phân biệt loại người dùng
    collection: KEY_TOKEN_COLLECTION_NAME
});
const keyToken = model(KEY_TOKEN_NAME, keyTokenSchema);


// UserTokenSchema kế thừa từ BaseTokenSchema
const userTokenSchema = new Schema({
    user: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});
const UserToken = keyToken.discriminator('UserToken', userTokenSchema);


// ShopTokenSchema kế thừa từ BaseTokenSchema
const shopTokenSchema = new Schema({
    shop: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'Shop'
    }
});
const ShopToken = keyToken.discriminator('ShopToken', shopTokenSchema);


//Export the model
module.exports = {
    UserToken,
    ShopToken
};