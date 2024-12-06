const bcryptjs = require("bcryptjs");
const mongoose = require("mongoose");

//database schema access
require("../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");

exports.userCreatePersistence = async (user) => {
    console.log("user", user);
    const { username, password } = user;
    if (!username || !password) {
        return ({ status: 400, message: "username and password are required" });
    }
    if (password.length < process.env.MINIMUM_PASSWORD_REQUIREMENT) {
        return ({ status: 400, message: `password must be at least ${process.env.MINIMUM_PASSWORD_REQUIREMENT} characters` });
    }

    try {
        const salt = process.env.SALT;
        const passwordHash = await bcryptjs.hash(salt + password, 10); 
        console.log("password hash", passwordHash);
        const response = await User.create({username, password: passwordHash, email: `${username}@alunos.ipca.pt`, role: "external"});
        console.log("response", response);
        return ({ status: 200, message: "User created successfully" });
    } catch (error) {
        console.log("error", error);
        if (error.code === 11000) {
            return ({ status: 400, message: "user already exists" });
        }
        return ({ status: 500, message: "Something went wrong" });
    }
}
