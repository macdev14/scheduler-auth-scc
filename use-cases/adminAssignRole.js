'use strict'
const mongoose = require("mongoose");
require("../framework/db/mongoDB/models/roleModel");
const Role = mongoose.model("Role");
const jwt = require("jsonwebtoken");
require('dotenv').config();


exports.adminAssignRole = async (requestedRole) => {
    console.log('requestedRole', requestedRole);
    const {token, username} = requestedRole;
    const desiredRole = requestedRole.role;
    try {
        if (!token || !username || !desiredRole) {
            return ({status: 400, message: "username, role and token are required"});
        }


        const decoded = jwt.verify(token, process.env.SECRET_KEY);

        console.log("decoded", decoded);
        if (decoded.role !== process.env.ROLE_ADMIN) {
            return ({status: 403, message: "Access denied. Admins only."}); 
        }

        const _id = desiredRole;
        const role = await Role.findOne({_id});

        if (!role) {
            return ({status: 404, message: "Role not found"});
        }
    

        const user = await mongoose.model("User").findOne({username});
        if (!user) {
            return ({status: 404, message: "User not found"});
        }

        user.role = role._id;

        try {
            await user.save();
        } catch (error) {
            console.log(error);
            return ({status:500, message:"Role could not be assigned"});
        }
        
        return ({status: 200, message: "Role assigned successfully", user});

    }
    catch (error) {
        console.log(error);
        return  ({status:500, message:"Something went wrong"});
    }
}