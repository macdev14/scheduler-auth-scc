'use strict';
//database schema

const validPermissions = [
    "login", "register", "change_password",
    "create_user", "delete_user", "block_user", "unblock_user",
    "edit_user", "create_document", "delete_document",
    "edit_document", "create_role", "delete_role", "edit_role", "assign_role"
];

const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const RoleSchema = new Schema({
    _id: { type: String, required: true },
    description: { type: String, required: true },
    permissions: {
        type: [String],
        validate: {
            validator: function (permissions) {
                return permissions.every(p => validPermissions.includes(p));
            },
            message: props => `${props.value} contains invalid permissions!`
        }
    }
},{collection:'roles', timestamps: true});

//admin
RoleSchema.statics.seedAdminRole = async function () {
    const adminRole = {
        _id: "admin",
        description: "Administrador",
        permissions: [
            "create_user", "delete_user", "block_user", "unblock_user",
            "edit_user", "change_password", "create_document", "delete_document",
            "edit_document", "create_role", "delete_role", "edit_role", "assign_role"
        ]
    };

    await this.updateOne({ _id: adminRole._id }, { $set: adminRole }, { upsert: true });
};

//manager
RoleSchema.statics.seedManagerRole = async function () {
    const managerRole = {
        _id: "manager",
        description: "Gestor",
        permissions: [
            "login", "register", "change_password",
            "edit_user", "create_document", "edit_document",
        ]
    };

    await this.updateOne({ _id: managerRole._id }, { $set: managerRole }, { upsert: true });
};

//user
RoleSchema.statics.seedUserRole = async function () {
    const userRole = {
        _id: "user",
        description: "Utilizador",
        permissions: [
            "login", "register", "change_password",
            "edit_user", "create_document", "edit_document",
        ]
    };

    await this.updateOne({ _id: userRole._id }, { $set: userRole }, { upsert: true });
};

//external
RoleSchema.statics.seedExternalRole = async function () {
    const externalRole = {
        _id: "external",
        description: "Utilizador externo",
        permissions: [
            "login", "register", "change_password",
            "edit_user", "create_document", "edit_document",
        ]
    };

    await this.updateOne({ _id: externalRole._id }, { $set: externalRole }, { upsert: true });
};
const Role = mongoose.model("Role", RoleSchema);
module.exports = Role;