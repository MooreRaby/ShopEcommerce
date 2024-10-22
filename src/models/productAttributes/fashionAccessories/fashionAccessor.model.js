'use strict'

const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = 'FashionAccessiory'
const COLLECTION_NAME = 'FashionAccessiories'

const fashionAccessiorySchema = new Schema({
    brand: String,
    gender: {
        type: String,
        enum: [ 'male', 'female' ]
    },
    origin: String,
    material: String,
    occasion: String, // married,engagement ,birthday ,wedding ,anniversary
    style: String, // classic,casua,elegan,ethnic
    accessories: Boolean,
    pair_accessories: Boolean,
    organization_name: String,
    address_orgainization: String,
    season: {
        type: String,
        enum: [ 'Spring', 'Summer', 'Fall', 'Winter' ]
    },
    type: String
}, {
    collection: COLLECTION_NAME
}
)

module.exports = model(DOCUMENT_NAME, fashionAccessiorySchema)