'use strict'
const mongoose = require("mongoose");
require("../framework/db/mongoDB/models/roleModel");
const Role = mongoose.model("Role");


exports.adminCreateRolesPersistence = async () => {

    try {
        await Role.seedAdminRole();
        await Role.seedManagerRole();
        await Role.seedUserRole();
        await Role.seedExternalRole();

        return ({ status: 201, message: "Roles created successfully" });

    }
    catch (error) {
        console.log(error);
        return  ({status:500, message:"Something went wrong"});
    }
}