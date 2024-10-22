'use strict'

const { Schema, model } = require('mongoose')
const DOCUMENT_NAME = 'AttributeVariant'
const COLLECTION_NAME = 'AttributeVariants'

const attributeVariantSchema = new Schema({
    attribute_name: { type: String, required: true },  // Tên thuộc tính (ví dụ: color, size, material)
    group_list: {type: Array}
}, {
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, attributeVariantSchema);