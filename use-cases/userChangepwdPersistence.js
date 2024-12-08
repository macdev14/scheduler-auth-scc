'use strict'
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
require('dotenv').config();

exports.userChangepwdPersistence = async (user) => {
    console.log("user=>", user);
    const {token, oldPassword, newPassword} = user;
    try {
        if(!oldPassword || !newPassword || !token) {
            return ({status:400, message:"token, oldPassword and newPassword are required"})
        }
        if(newPassword < process.env.MINIMUM_PASSWORD_REQUIREMENT) {
            return ({status:400, message:"Password must be at least " + process.env.MINIMUM_PASSWORD_REQUIREMENT + " characters"});
        }
        const salt = process.env.SALT;
        const user = jwt.verify(token, process.env.SECRET_KEY);
        const _id = user.id;
        const passwordHash = await bcryptjs.hash(salt + newPassword, 10);
        await User.updateOne({_id}, {password: passwordHash});
        return ({status:200, message:"password changed"});
    }
    catch (err) {
        console.log(err);
        return ({status:500, message:"Something went wrong"});
    }
}