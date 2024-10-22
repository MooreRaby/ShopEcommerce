'use strict';

const { model, Schema } = require('mongoose')

const DOCUMENT_NAME = 'User'
const COLLECTION_NAME = 'Users'


const userSchema = new Schema({
    usr_slug: { type: String },
    usr_name: { type: String, default: '' },
    usr_password: { type: String, default: '' },
    usr_salf: { type: String, default: '' },
    usr_email: { type: String, required: true , unique: true},
    usr_phone: { type: String },
    usr_sex: { type: String, default: '' },
    usr_avatar: { type: String, default: '' },
    usr_date_of_birth: { type: Date, default: null },
    usr_role: { type: Schema.Types.ObjectId, ref: 'Role' },
    usr_status: { type: String, default: 'pending', enum: [ 'pending', 'active', 'block' ] },
    address: { type: String, default: "" },
    googleId: { type: String, default: null }, // ID người dùng từ Google
    facebookId: { type: String, default: null }, // ID người dùng từ Facebook
}, {
    timestamps: true,
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, userSchema)