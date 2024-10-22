'use strict'


const { model, Schema } = require('mongoose');
const { default: slugify } = require('slugify');
const DOCUMENT_NAME = 'Product'
const COLLECTION_NAME = 'Products'

const productSchema = new Schema({
    // basic info
    product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' },
    product_name: { type: String, required: true },
    product_images: [ {
        url: { type: String, required: true },
        isPrimary: { type: Boolean, default: false } // Đánh dấu ảnh chính
    } ],
    product_video: String,
    product_description: String,
    product_category: {
        type: Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },

    // detail info 
    product_price: { type: Number, required: true },
    product_quantity: { type: Number, required: true },
    product_variants: [ {  // xác định variant tung danh mục
        type: Schema.Types.ObjectId,
        ref: 'ProductVariant',
        validate: {
            validator: async function (variantId) {
                const variant = await this.model('ProductVariant').findById(variantId);
                return variant && variant.category.equals(this.product_category);
            },
            message: 'Variant does not belong to the selected category.'
        }
    } ],

    // review
    product_reviews: [ {
        comment: { type: Schema.Types.ObjectId, ref: 'Comment' },
        rating: Number
    } ],
    product_ratingsQuantity: { type: Number, default: 0 },
    product_ratingsAverage: {
        type: Number,
        default: 4.5,
        min: [ 1, 'Rating must be above 1.0' ],
        max: [ 5, 'Rating must be above 5.0' ],
        //4.345666=>4.3
        set: (val) => Math.round(val * 10) / 10
    },
    product_reviewsQuantity: { type: Number, default: 0 },
    product_reviewsAverage: { type: Number, default: 0 },

    // status
    product_slug: String,
    totalSales: { type: Number, default: 0 }, // tổng bán
    product_sku: { type: String },
    isDraft: { type: Boolean, default: true, index: true, select: false }, // bản nháp của product
    isPublished: { type: Boolean, default: false, index: true, select: false }, // publish product
}, {
    collection: COLLECTION_NAME,
    timestamps: true
})



// create index
productSchema.index({ product_name: 'text', product_description: 'text' })
// Index for newest products
productSchema.index({ createdAt: -1 });
// Index for price sorting
productSchema.index({ product_price: 1 });
// Index for best-selling products
productSchema.index({ totalSales: -1 });

//middleware before save 
productSchema.pre('save', async function (next) {
    this.product_slug = slugify(this.product_name, { lower: true })
    next()
})


// // define the product type= clothing
// const clothingSchema = new Schema({
//     brand: { type: String, require: true },
//     size: String,
//     material: String,
//     product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }
// }, {
//     collection: 'clothes',
//     timestamps: true
// })


// const electronicSchema = new Schema({
//     manufacturer: { type: String, require: true },
//     model: String,
//     color: String,
//     product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }

// }, {
//     collection: 'electronics',
//     timestamps: true
// })

// const furnitureSchema = new Schema({
//     manufacturer: { type: String, require: true },
//     model: String,
//     color: String,
//     product_shop: { type: Schema.Types.ObjectId, ref: 'Shop' }

// }, {
//     collection: 'furnitures',
//     timestamps: true
// })

module.exports = {
    product: model(DOCUMENT_NAME, productSchema),
    // electronic: model('Electronic', electronicSchema),
    // clothing: model('Clothing', clothingSchema),
    // furniture: model('Furniture', furnitureSchema)
}