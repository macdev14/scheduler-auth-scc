'use strict';

const {JwtRoleEntity} = require("../entities/JwtRoleEntity");
const Role = require("../entities/JwtRoleEntity");

exports.createRoles = async ({adminCreateRolesPersistence}, {}) => {
    try {
        const create_roles = await adminCreateRolesPersistence();
        return create_roles;
    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong: "  + error});
    }
}

exports.createRole = async ({adminCreateRolePersistence}, {id, description, token, permissions}) => {
    try {
        const role = new JwtRoleEntity({id, description, token, permissions});
        const create_role = await adminCreateRolePersistence(role);
        return create_role;
    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong: "  + error});
    }
}

exports.getRoles = async ({adminGetRoles}, {token}) => {
    try {
        const roles = await adminGetRoles(token);
        return roles;
    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong: "  + error});
    }
}

