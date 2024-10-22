'use strict'

const { Schema, model } = require('mongoose')

const COLLECTION_NAME = 'WomenClothings'
const DOCUMENT_NAME = 'WomenClothing'

const womenClothingSchema = new Schema({
    brand: { type: String, require: true },
    origin: {
        type: String
    },
    material: {
        type: String,
    },
    shape: {
        type: String,
    },
    length: { type: String },
    petite: { type: Boolean },// big,small
    Cropped_Top: { type: Boolean }, // true, false
    collar: { type: String },// asymmetrical boat neck shirt neck strap off- the - shoulder round neck turtle neck v - neck
    model: {
        type: String
    },
    season: { type: String, enum: [ 'Spring', 'Summer', 'Fall', 'Winter' ] },
    style: {
        type: String,
    }
}, {
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, womenClothingSchema)