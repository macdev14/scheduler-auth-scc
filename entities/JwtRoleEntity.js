exports.JwtRoleEntity = class JwtRoleEntity {
    constructor({id, description, token, permissions}) {
        this.id = id;
        this.permissions = permissions;
        this.description = description;
        this.token = token;
    }
};