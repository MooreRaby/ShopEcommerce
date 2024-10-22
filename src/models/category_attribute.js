'use strict'

const { Schema, model } = require("mongoose")

const DOCUMENT_NAME = 'CategoryAttribute'
const COLLECTION_NAME = 'CategoryAttributes'


const categoryAttributeSchema = new Schema({
    
}, {
    collection: COLLECTION_NAME
}
)


module.exports = model(DOCUMENT_NAME, categoryAttributeSchema)