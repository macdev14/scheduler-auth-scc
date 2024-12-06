const { adminCreateRolePersistence } = require("../../use-cases/adminCreateRolePersistence");
const { adminGetRoles } = require("../../use-cases/adminGetRoles");
const adminInteractorMongoDB = require("../../use-cases/adminInteractorMongoDB");
const router = require("express").Router();

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


module.exports = router;