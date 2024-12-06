'use strict'
const mongoose = require("mongoose");
require("../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require('dotenv').config();


exports.userGetAll = async (token) => {

    
    try {
        
        if (!token) {
            return ({status: 400, message: "token is required"});
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return ({status: 403, message: "Access denied"});
        }

        const users = await User.find();

        if(!users) {
            return ({status: 404, message: "Users not found"});
        }
        return ({status: 200, users});

    }
    catch (error) {
        console.log(error);
        return  ({status:500, message:"Something went wrong"});
    }
}