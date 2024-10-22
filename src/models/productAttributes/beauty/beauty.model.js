'use strict'

const { Schema, model } = require('mongoose')

const DOCUMENT_NAME = 'Beauty'
const COLLECTION_NAME = 'Beautys'


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
    active_ingredients: {type: String},
    shelf_life : { type: String},
    batch_number : { type: String},
    storage_conditions : { type: String},
    formulation : { type: String},
    packaging_type : { type : String},
    volume : { type: String},
    expiry_date : { type: String},
    organization_name : { type: String},
    skin_type : {type: String},
    weight: { type: String },
    scent: {type: String}
    
    
}, {
    collection: COLLECTION_NAME
})

module.exports = model(DOCUMENT_NAME, beautySchema)