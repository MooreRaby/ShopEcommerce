'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Health'
const COLLECTION_NAME = 'Healths'


const beautySchema = new Schema({
    brand: { type: String, require: true },
    origin: {
        type: String
    },
    material: {
        type: String,
    },
    ingredients: { type: String },
    address: { type: String },
    active_ingredients: { type: String },
    shelf_life: { type: Date },
    packaging_type: { type: String },
    volume: {
        value: Number,
        unit: String,
    },
    expiry_date: { type: Date },
    organization_name: { type: String },
    weight: {
        value: Number,
        unit: String
    },
    weight_control: { type: String },
    age_of_use: { type: Number }

}, {
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, beautySchema)