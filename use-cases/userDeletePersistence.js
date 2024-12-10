'use strict'
const bcryptjs = require("bcryptjs");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
require("../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
require('dotenv').config();

exports.userDeletePersistence = async (user) => {
    const {token, password} = user;
    try {
        if(!password || !token) {
            return ({status:400, message:"token and password are required"})
        }
        const user = jwt.verify(token, process.env.SECRET_KEY);
        const _id = user.id;
        const userDelete = await User.updateOne({_id}, {active: false});

        return ({status:200, message:"User deleted"});

    }
    catch (err) {
        console.log(err);
        return ({status:500, message:"Something went wrong"});
    }
}