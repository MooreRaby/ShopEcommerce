'use strict';

const { cloudinary } = require('../configs/cloudinary.config');

//`  upload from url iamge

const uploadImageFromUrl = async () => {
    try {
        const urlImage = 'https://down-vn.img.susercontent.com/file/vn-11134207-7qukw-lfgpj5oyv5o5e1'
        const folderName = 'product/shopId', newFileName = 'testdemo'

        const result = await cloudinary.uploader.upload(urlImage, {
            // public_id: newFileName
            folder: folderName,

        })

        console.log(result);
    } catch (error) {
        console.log('Error uploading image:: ', error);
    }
}

// 2. upload image from local storage

const uploadImageFromLocal = async ({
    path,
    folderName = 'product/8409',
    allowedFormats = [ 'jpg', 'png', 'jpeg', 'webp' ],
}) => {
    try {
        // Check allowed formats before upload
        const extension = path.split('.').pop().toLowerCase();
        if (!allowedFormats.includes(extension)) {
            throw new Error('Unsupported image format. Allowed formats: ' + allowedFormats.join(', '));
        }

        const result = await cloudinary.uploader.upload(path, {
            public_id: 'thumb',
            folder: folderName,
        });

        console.log(result);

        const baseUrl = result.secure_url; // Store base URL for easier manipulation

        return {
            image_url: baseUrl, // Use baseUrl for consistency
            shopId: 8409,
            thumb_url: cloudinary.url(result.public_id, {
                height: 100,
                width: 100,
                // Allow specifying a format from allowedFormats if needed:
                format: format || 'jpg' // Use default or preferred format
            })
        };
    } catch (error) {
        console.error('Error uploading image:', error); // Use console.error for more visibility
    }
};



module.exports = {
    uploadImageFromUrl, uploadImageFromLocal
}