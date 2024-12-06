'use strict';
const bcrypt = require('bcryptjs');
//database schema
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UserSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    email: { type: String},
    register_date: { type: Date, required: true, default: Date.now }, 
    last_sign_in: { type: Date, required: true, default: Date.now }, 
    document_name: { type: String },
    roles: [{ type: String, ref: 'Role' }],
    active: { type: Boolean, required: true, default: true }
},{collection:'users'});

UserSchema.statics.seedAdminUser = async function () {
    try {
        const adminUser = {
            username: 'admin',
            password: await bcrypt.hash('admin_password', 10),
            email: 'admin@alunos.ipca.pt',
            register_date: new Date(),
            last_sign_in: new Date(),
            roles: ['admin'],
            active: true
        };

        // Uppdates the user if it exists
        await this.updateOne(
            { username: adminUser.username }, // Query by username
            { $set: adminUser },              // Update or set data
            { upsert: true }                  // Insert if not exists
        );

    } catch (error) {
        throw error;
    }
};

const User = mongoose.model("User", UserSchema);
module.exports = User;