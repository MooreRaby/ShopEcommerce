
const ROLE = require('../role.model')


const findRoleByName = async (rol_name) => {
    return await ROLE.findOne({ rol_name: rol_name})
}

module.exports = {
    findRoleByName
}