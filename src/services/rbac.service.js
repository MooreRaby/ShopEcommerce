'use strict';

const RESOURCE = require('../models/resource.model')
const ROLE = require('../models/role.model')

const createResource = async ({ name, slug, description }) => {
    try {
        const existingResource = await RESOURCE.findOne({ src_slug: slug })
        if (existingResource) throw new Error('Resource slug already exists')

        const resource = await RESOURCE.create({ src_name: name, src_slug: slug, src_description: description })
        return resource
    } catch (error) {
        throw new Error(error.message)
    }
}

const resourceList = async ({ limit = 30, offset = 0, search = '' }) => {
    try {
        const resources = await RESOURCE.aggregate([
            { $match: { src_name: new RegExp(search, 'i') } },
            {
                $project: {
                    _id: 0,
                    name: "$src_name",
                    slug: "$src_slug",
                    description: "$src_description",
                    resourceId: "$_id",
                    createdAt: 1
                }
            },
            { $skip: offset },
            { $limit: limit }
        ])
        return resources
    } catch (error) {
        throw new Error(error.message)
    }
}

const createRole = async ({ name, slug, description, grants }) => {
    try {
        const existingRole = await ROLE.findOne({ rol_slug: slug })
        if (existingRole) throw new Error('Role slug already exists')

        const role = await ROLE.create({ rol_name: name, rol_slug: slug, rol_description: description, rol_grants: grants })
        return role
    } catch (error) {
        throw new Error(error.message)
    }
}

const roleList = async ({ limit = 30, offset = 0, search = '' }) => {
    try {
        const roles = await ROLE.aggregate([
            { $match: { rol_name: new RegExp(search, 'i') } },
            { $unwind: '$rol_grants' },
            {
                $lookup: {
                    from: 'Resources',
                    localField: 'rol_grants.resource',
                    foreignField: '_id',
                    as: 'resource'
                }
            },
            { $unwind: '$resource' },
            {
                $project: {
                    role: '$rol_name',
                    resource: '$resource.src_name',
                    action: '$rol_grants.actions',
                    attributes: '$rol_grants.attributes'
                }
            },
            { $unwind: '$action' },
            {
                $project: {
                    _id: 0,
                    role: 1,
                    resource: 1,
                    action: 1,
                    attributes: 1
                }
            },
            { $skip: offset },
            { $limit: limit }
        ])
        return roles
    } catch (error) {
        throw new Error(error.message)
    }
}

module.exports = {
    createResource,
    resourceList,
    createRole,
    roleList
}
