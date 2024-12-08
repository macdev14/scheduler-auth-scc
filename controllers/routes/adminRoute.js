const { adminCreateRolePersistence } = require("../../use-cases/adminCreateRolePersistence");
const { adminGetRoleById } = require("../../use-cases/adminGetRoleById");
const { adminGetRoles } = require("../../use-cases/adminGetRoles");
const { adminAssignRole } = require("../../use-cases/adminAssignRole");
const adminInteractorMongoDB = require("../../use-cases/adminInteractorMongoDB");
const router = require("express").Router();

/**
 * @api {post} /admin/role/create Create Role
 * @apiName CreateRole
 * @apiGroup Admin
 * @apiParam {String} id Role ID
 * @apiParam {String} description Role description
 * @apiParam {Array} permissions Role permissions
 * @apiParam {String} token JSON Web Token that can be used to authenticate
 * @apiSuccess {Object} role Created role details
 * @apiError {String} message Error message
 */
router.route('/admin/role/create').post(
    async (req, res) => {
        const {id, description, permissions} = req.body;
        const token = req.headers['token'];
        try {
           
            const role = await adminInteractorMongoDB.createRole({adminCreateRolePersistence},{id, description, token, permissions});
            //console.log(role)
            res.status(role.status).send(role)
        } catch (error) {
            throw error;
        }
       
    }
)

/**
 * @api {get} /admin/role/getAll Get All Roles
 * @apiName GetAllRoles
 * @apiGroup Admin
 * @apiParam {String} token JSON Web Token that can be used to authenticate
 * @apiSuccess {Array} roles List of roles
 * @apiError {String} message Error message
 */
router.route('/admin/role/getAll').get(
    async (req, res) => {
        const token = req.headers['token'];
        try {
            const roles = await adminInteractorMongoDB.getRoles({adminGetRoles},{token});
            res.status(roles.status).send(roles);
        } catch (error) {
            console.error("Error in get all roles route:", error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
);

/**
 * @api {post} /admin/role/assign Assign Role
 * @apiName AssignRole
 * @apiGroup Admin
 * @apiParam {String} username Username
 * @apiParam {String} role Role ID
 * @apiParam {String} token JSON Web Token that can be used to authenticate
 * @apiSuccess {Object} message Role assignment message
 * @apiError {String} message Error message
 */
router.route('/admin/role/assign').post(
    async (req, res) => {
        const {username, role} = req.body;
        const token = req.headers['token'];
        try {
            const assignrole = await adminInteractorMongoDB.assignRole({adminAssignRole},{username, role, token});
            res.status(assignrole.status).send(assignrole);
        } catch (error) {
            console.error("Error in assign role route:", error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
);

/**
 * @api {get} /admin/role/get Get Role by ID
 * @apiName GetRoleById
 * @apiGroup Admin
 * @apiParam {String} id Role ID
 * @apiParam {String} token JSON Web Token that can be used to authenticate
 * @apiSuccess {Object} role Role details
 * @apiError {String} message Error message
 */
router.route('/admin/role/get').get(
    async (req, res) => {
        const token = req.headers['token'];
        const id = req.body.id;
        try {
            const roles = await adminInteractorMongoDB.getRole({adminGetRoleById},{token, id});
            res.status(roles.status).send(roles);
        } catch (error) {
            console.error("Error in get all roles route:", error);
            res.status(500).send({ message: "Internal server error" });
        }
    }
);


module.exports = router;