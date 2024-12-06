exports.UserStateEntity = class UserStateEntity {
    constructor({token, password, active}) {
        this.token = token;
        this.password = password;
        this.active = active;
    }
};