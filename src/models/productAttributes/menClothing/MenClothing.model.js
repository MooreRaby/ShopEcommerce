'use strict'

const { Schema, model } = require('mongoose')

const COLLECTION_NAME = 'MenClothings'
const DOCUMENT_NAME = 'MenClothing'

const menClothingSchema = new Schema({
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
    collar: { type: String },// asymmetrical boat neck shirt neck strap off- the - shoulder round neck turtle neck v - neck
    lock_type: { type: String },
    button_type: { type: String },
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

module.exports = model(DOCUMENT_NAME, menClothingSchema)