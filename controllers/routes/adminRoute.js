const { adminCreateRolePersistence } = require("../../use-cases/adminCreateRolePersistence");
const { adminCreateRolesPersistence } = require("../../use-cases/adminCreateRolesPersistence");
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

router.route('/admin/roles/create').post(
    async (req, res) => {
        try {
            const role = await adminInteractorMongoDB.createRoles({adminCreateRolesPersistence},{});
            // Respond with success
            res.status(201).send({ message: 'Roles seeded successfully.' });
        } catch (error) {
            console.error('Error seeding roles:', error);
            res.status(500).send({ message: 'Error seeding roles.', error: error.message });
        }
    }
)

module.exports = router;