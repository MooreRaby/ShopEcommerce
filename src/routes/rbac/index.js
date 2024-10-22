'use strict'

const express = require('express')
const { asyncHandler } = require('../../helpers/asyncHandler')

const {
    newResource,
    newRole,
    listResources,
    listRoles
} = require('../../controllers/rbac.controller')
const router = express.Router()

router.post('/role', asyncHandler(newRole))
router.get('/roles', asyncHandler(listRoles))

router.post('/resource', asyncHandler(newResource))
router.get('/resources', asyncHandler(listResources))


module.exports = router