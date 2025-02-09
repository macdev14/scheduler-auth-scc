'use strict'
const mongoose = require("mongoose");
require("../framework/db/mongoDB/models/roleModel");
const Role = mongoose.model("Role");
const jwt = require("jsonwebtoken");
require('dotenv').config();


exports.adminGetRoleById = async (role) => {

    const {token, id} = role;
    try {
        
        if (!token || !id) {
            return ({status: 400, message: "token and id are required"});
        }
        const _id = id;

        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        if (decoded.role !== "admin") {
            return ({status: 403, message: "Access denied. Admins only."}); 
        }

        const role = await Role.findById(_id);

        if(!role) {
            return ({status: 404, message: "Role not found"});
        }
        return ({status: 200, role});

    }
    catch (error) {
        console.log(error);
        return  ({status:500, message:"Something went wrong"});
    }
}