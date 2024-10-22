
'use strict';

const { model, Schema } = require('mongoose');
const DOCUMENT_NAME = 'Category';
const COLLECTION_NAME = 'Categories';


const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,  // Tên danh mục không được trùng lặp
    },
    description: {
        type: String,
        default: ""
    },
    slug: {
        type: String,
        required: true,
        unique: true  // Đảm bảo tính duy nhất để dễ dàng tạo URL thân thiện
    },
    parentCategory: {
        type: Schema.Types.ObjectId,
        ref: 'Category',  // Liên kết đến chính Category để tạo mối quan hệ phân cấp
        default: null  // Nếu là danh mục cao nhất, không có parent
    },
    isActive: {
        type: Boolean,
        default: true  // Điều khiển danh mục có hiển thị hay không
    },
    image: {
        type: String,  // Đường dẫn hình ảnh đại diện cho danh mục
        default: ""
    }
}, {
    COLLECTION_NAME: COLLECTION_NAME,
    timestamps: true  // Tự động thêm createdAt và updatedAt
});

// Middleware để tự động tạo slug từ tên danh mục trước khi lưu
categorySchema.pre('save', function (next) {
    if (this.name) {
        this.slug = this.name.toLowerCase().replace(/ /g, '-');
    }
    next();
});

// Index để tối ưu truy vấn text search
categorySchema.index({ name: 'text', description: 'text' });

// Tạo model cho Category
const Category = model(DOCUMENT_NAME, categorySchema);

module.exports = Category;
