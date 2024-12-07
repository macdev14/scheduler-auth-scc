'use strict';

const {UserEntity} = require("../entities/UserEntity");
const {UserStateEntity} = require("../entities/UserStateEntity");
const {JwtUserEntity} = require("../entities/JwtUserEntity");
const {UserJwtEntity} = require("../entities/UserJwtEntity");

exports.login = async ({userLoginPersistence}, {username, password}) => {
    try {
        //persiste
        const user = new UserEntity({username, password});
        const loginuser = await userLoginPersistence(user);
        return loginuser;
    } catch (error) {
        console.log(error);
        return ({ status: 500, message: "Something went wrong: "  + error});
    }
}

exports.register = async ({userCreatePersistence}, {username, password}) => {
    try {
        //persiste
        const user = new UserEntity({username, password, register_date: new Date(), last_sign_in: new Date()});
        console.log("user", user);
        if(!await user.validator()) {
            return user;
        }
        const registeruser = await userCreatePersistence(user);
        return registeruser;
    } catch (error) {
        console.log("error", error);
        if (error.code === 11000) {
            return ({ status: 400, message: "user already exists" });
        }
        return ({ status: 500, message: "Something went wrong" });
    }
}
exports.userCreateAdmin = async ({userCreateAdminPersistence}, {}) => {
    try {
        const registeruser = await userCreateAdminPersistence();
        return registeruser;
    } catch (error) {
        console.log("error", error);
        if (error.code === 11000) {
            return ({ status: 400, message: "user already exists" });
        }
        return ({ status: 500, message: "Something went wrong" });
    }
}

exports.changepwd = async ({userChangepwdPersistence}, {token, oldPassword, newPassword}) => {
    try {
        //persiste

        const userChangePwd = new JwtUserEntity(
            {
               token,
               oldPassword,
               newPassword
            }
        );
        const changepwdUser = await userChangepwdPersistence(userChangePwd)
        return changepwdUser;
    } catch (error) {
        console.log("error", error);
        if (error.code === 11000) {
            return ({ status: 400, message: "user already exists" });
        }
        return ({ status: 500, message: "Something went wrong" });
    }
}

exports.userDelete = async ({userDeletePersistence}, {token, password}) => {
    try {
        //persiste

        const user = new UserStateEntity({token, password, active: false});
        const deleteruser = await userDeletePersistence(user);
        return deleteruser;
    } catch (error) {
        console.log("error", error);
        return ({ status: 500, message: "Something went wrong" });
    }
}

exports.userUnblock = async ({userUnblockPersistence}, {token, password}) => {
    try {
        //persiste

        const user = new UserStateEntity({token, password, active: true});
        const deleteruser = await userUnblockPersistence(user);
        return deleteruser;
    } catch (error) {
        console.log("error", error);
        return ({ status: 500, message: "Something went wrong" });
    }
}

exports.userEdit = async ({userEditPersistence}, {token, email, first_name, last_name, birthdate, profilePicture}) => {
    try {

        const user = new UserEntity({token, email, first_name, last_name, birthdate, profilePicture});
        const edituser = await userEditPersistence(user);
        return edituser;
    } catch (error) {
        console.log("error", error);
        return ({ status: 500, message: "Something went wrong" });
    }
}   
exports.getByUsername = async ({userGetUserByUsername}, {token, username}) => {
    try {
        const userjwt = new UserJwtEntity({token, username});
        const user = await userGetUserByUsername(userjwt);
        return user;
    } catch (error) {
        console.log("error", error);
        return ({ status: 500, message: "Something went wrong" });
    }
}   

exports.getAll = async ({userGetAll}, {token}) => {
    try {
        const user = await userGetAll(token);
        return user;
    } catch (error) {
        console.log("error", error);
        return ({ status: 500, message: "Something went wrong" });
    }
}   
