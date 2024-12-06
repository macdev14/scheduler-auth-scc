const bcryptjs = require('bcryptjs');
const Role = require('../framework/db/mongoDB/models/roleModel');

exports.UserEntity = class UserEntity {
    constructor(user) {
        this.username = user.username;
        this.password = user.password;
        this.email = this.email || `${this.username}@gmail.com`;
        this.first_name = user.first_name || null;
        this.last_name = user.last_name || null;
        this.register_date = user.register_date || new Date();
        this.last_sign_in = user.last_sign_in || new Date();
        this.birthdate = user.birthdate || null;
        this.document_name = user.document_name || null;
        this.active = user.active !== undefined ? user.active : true;
        this.token = user.token || null;
        this.role = user.role
}

async validator() {
    if (!this.username || !this.password) {
        return({status: 400, message: "username and password are required"});
    }

    if(this.password.length < 8) {
        return({status: 400, message: "password must be at least 8 characters"});
    }

    // const passwordHash = await bcryptjs.hash(this.password, 10); // 10 salt rounds
    // this.password = passwordHash;


    return({status: 200, message: "user registered"});

}
}