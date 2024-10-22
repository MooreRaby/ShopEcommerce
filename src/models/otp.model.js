'use strict';

const { model, Schema } = require('mongoose'); // Erase if already required

// Declare the Schema of the Mongo model
const DOCUMENT_NAME = 'otp_log'
const COLLECTION_NAME = 'otp_logs'
// Declare the Schema of the Mongo model
const shopSchema = new Schema({
    otp_token: { type: String, require: true },
    otp_email: { type: String, require: true },
    otp_status: {
        type: String,
        default: 'pending',
        enum: [ 'pending', 'active', 'block' ]
    },
    expireAt: {
        type: Date,
        default: Date.now(),
        expires: 300
    },

}, {
    timestamps: true,
    collection: COLLECTION_NAME
});

//Export the model
module.exports = model(DOCUMENT_NAME, shopSchema);