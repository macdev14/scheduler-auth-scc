'use strict'
const mongoose = require("mongoose");
require("../framework/db/mongoDB/models/roleModel");
const Role = mongoose.model("Role");
const jwt = require("jsonwebtoken");
require('dotenv').config();


exports.adminCreateRolePersistence = async (role) => {
    //console.log('role', role);
    const {id, description, token, permissions } = role;
    try {

        if (!id || !description || !token || !permissions) {
            return ({status: 400, message: "id, description, token and permissions are required"});
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        if (decoded.role !== "admin") {
            return ({status: 403, message: "Access denied. Admins only."});   
        }
        
        const _id = id
        const find_role = await Role.findOne({_id}); //return a simple document json


        if (find_role) {
            return ({status: 500, message: "Role already exists"});
        }

        const response = await Role.create({description});
        //console.log("response", response);
        return ({ status: 200, message: "Role created successfully" });

    }
    catch (error) {
        console.log(error);
        return  ({status:500, message:"Something went wrong"});
    }
}