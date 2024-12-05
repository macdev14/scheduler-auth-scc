'use strict';
//database schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String },
    first_name: { type: String },
    last_name: { type: String },
    register_date: { type: Date, required: true, default: Date.now }, 
    last_sign_in: { type: Date, required: true, default: Date.now }, 
    birthdate: { type: Date },
    document_name: { type: String },
    active: { type: Boolean, required: true, default: true }
},{collection:'users'});
const User = mongoose.model("User", UserSchema);
module.exports = User;