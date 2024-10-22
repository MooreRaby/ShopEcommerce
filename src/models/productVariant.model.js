"use strict";

const { model, Schema } = require('mongoose');
const DOCUMENT_NAME = 'ProductVariant';
const COLLECTION_NAME = 'ProductVariants'

const variantSchema = new Schema({
    variant_type: {
        type: String,
        required: true,
        index: true // Index this field for faster filtering by variant type (e.g., color, size)
    },
    variant_name: {
        type: String,
        required: true,
        index: true // Index for faster searches by variant name
    },
    variant_image: { type: String },
    variant_price: {
        type: Number,
        required: true
    },
    variant_sku: {
        type: String,
        index: { unique: true } // Ensure uniqueness and index for faster lookups by SKU
    },
    variant_quantity: {
        type: Number,
        required: true
    }
}, {
    collection: COLLECTION_NAME,
    timestamps: true
});





module.exports = model(DOCUMENT_NAME, variantSchema);
