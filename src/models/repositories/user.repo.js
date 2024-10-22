// src/models/repositories/user.repo.js
'use strict';

const USER = require('../user.model');
const { convertToObjectIdMongodb } = require('../../utils');

// Hàm tạo người dùng
const createUser = async ({ usr_email, usr_name, usr_password, usr_role, usr_status }) => {
    const user = await USER.create({
        usr_email,
        usr_name,
        usr_password,
        usr_role: convertToObjectIdMongodb(usr_role),
        usr_status,
    });

    return user;
};

// Hàm cập nhật người dùng
const updateUser = async (filter, updateData) => {
    const updatedUser = await USER.findOneAndUpdate(filter, updateData, { new: true }).lean();
    return updatedUser;
};

module.exports = {
    createUser,
    updateUser,
};