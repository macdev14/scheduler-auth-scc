'use strict'
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
require('dotenv').config();


exports.userLoginPersistence = async (user) => {
    console.log('user', user);
    const { username, password } = user;
    try {
        const userfind = await User.findOne({username}); //return a simple document json
        if (!userfind) {
            //user not found
            return ({status: user.status, message: user.message});
        }
        const salt = process.env.SALT;

        const isMatch = await bcryptjs.compare(salt + password, userfind.password);
        if (!isMatch) {
            return ({status:400, message:"Password is incorrect"});
        }
        
        const token = jwt.sign({id: userfind._id, username: userfind.username, role: userfind.role}, process.env.SECRET_KEY, {expiresIn: "1d"});
        console.log("token:", token);
        return ({status:200, message:"user logged in successfully", token});
    }
    catch (error) {
        console.log(error);
        return  ({status:500, message:"Something went wrong"});
    }
}