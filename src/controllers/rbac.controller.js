'use strict';

const { SuccessResponse } = require("../core/success.response");
const { createRole, roleList, resourceList, createResource } = require("../services/rbac.service");

const newRole = async (req, res) => {
    new SuccessResponse({
        message: 'Create role',
        metadata: await createRole(req.body)
    }).send(res)
}

const newResource = async (req, res) => {
    new SuccessResponse({
        message: 'Create resource',
        metadata: await createResource(req.body)
    }).send(res)
}

const listRoles = async (req, res) => {
    new SuccessResponse({
        message: 'Get list of roles',
        metadata: await roleList(req.query)
    }).send(res)
}

const listResources = async (req, res) => {
    new SuccessResponse({
        message: 'Get list of resources',
        metadata: await resourceList(req.query)
    }).send(res)
}

module.exports = {
    newRole,
    newResource,
    listRoles,
    listResources
}
