'use strict'
const mongoose = require("mongoose");
require("../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
const jwt = require("jsonwebtoken");
require('dotenv').config();


exports.userGetUserByUsername = async (user) => {

    const {token, username} = user;
    try {
        
        if (!token || !username) {
            return ({status: 400, message: "token and username are required"});
        }

        try {
            const decoded = jwt.verify(token, process.env.SECRET_KEY);
        } catch (err) {
            return ({status: 403, message: "Access denied"});
        }

        const user = await User.findOne({username});

        if(!user) {
            return ({status: 404, message: "User not found"});
        }
        return ({status: 200, user});

    }
    catch (error) {
        console.log(error);
        return  ({status:500, message:"Something went wrong"});
    }
}