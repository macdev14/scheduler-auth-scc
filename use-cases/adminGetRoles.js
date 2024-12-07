'use strict'
const mongoose = require("mongoose");
require("../framework/db/mongoDB/models/roleModel");
const Role = mongoose.model("Role");
const jwt = require("jsonwebtoken");
require('dotenv').config();


exports.adminGetRoles = async (token) => {
    //console.log('role', role);
    try {

        if (!token) {
            return ({status: 400, message: "token is required"});
        }


        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        console.log("decoded", decoded);
        if (decoded.role !== "admin") {
            return ({status: 403, message: "Access denied. Admins only."}); 
        }

        const roles = await Role.find({});
        return ({status: 200, roles});

    }
    catch (error) {
        console.log(error);
        return  ({status:500, message:"Something went wrong"});
    }
}