const { userLoginPersistence } = require("../../use-cases/userLoginPersistence");
const { userCreatePersistence } = require("../../use-cases/userCreatePersistence");
const { userChangepwdPersistence } = require("../../use-cases/userChangepwdPersistence");
const { userDeletePersistence } = require("../../use-cases/userDeletePersistence");
const { userUnblockPersistence } = require("../../use-cases/userUnblockPersistence");
const { userEditPersistence } = require("../../use-cases/userEditPersistence");
const { userGetUserByUsername } = require("../../use-cases/userGetUserByUsername");
const userInteractorMongoDB = require("../../use-cases/userInteractorMongoDB");
const multer = require('multer');
const path = require("path");
const fs = require('fs');
const router = require("express").Router();

const storage = multer.diskStorage({

    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Directory to save files
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, uniqueSuffix + path.extname(file.originalname)); // Ensure unique filenames
    }
});
const upload = multer({ storage });

/**
 * @api {post} /session/login Login
 * @apiName Login
 * @apiGroup User
 * @apiParam {String} username username
 * @apiParam {String} password password
 * @apiSuccess {String} token JSON Web Token that can be used to authenticate
 * @apiError {String} user/password not match
 * @apiError {String} user not found
 */
router.route('/session/login').post(
    async (req, res) => {
        const { username, password } = req.body;
        try {
           
            const user = await userInteractorMongoDB.login({userLoginPersistence},{username,password});
             //console.log(user)
            res.status(user.status).send(user)
        } catch (error) {
            throw error;
        }
       
    }
)

/**
 * @api {post} /session/register Register
 * @apiName Register
 * @apiGroup User
 * @apiParam {String} username username
 * @apiParam {String} password password
 * @apiSuccess {String} token JSON Web Token that can be used to authenticate
 * @apiError {String} user/password not match
 * @apiError {String} user not found
 */
router.route('/session/register').post(
    async (req, res) => {
        const { username, password } = req.body;
        try {
           
            const user = await userInteractorMongoDB.register({userCreatePersistence},{username,password});
            //console.log(user)
            res.status(user.status).send(user)
        } catch (error) {
            throw error;
        }
       
    }
)


/**
 * @api {put} /user/change-password Change Password
 * @apiName ChangePassword
 * @apiGroup User
 * @apiParam {String} oldPassword old password
 * @apiParam {String} newPassword new password
 * @apiParam {String} token JSON Web Token that can be used to authenticate
 * @apiSuccess {String} token JSON Web Token that can be used to authenticate
 * @apiError {String} user not found
 * @apiError {String} password not match
 */
router.route('/user/change-password').put(
    async (req, res) => {
        const { oldPassword, newPassword } = req.body;
        const token = req.headers['token']
        try {
           
            const user = await userInteractorMongoDB.changepwd({userChangepwdPersistence},{token,oldPassword,newPassword});
             //console.log(user)
            res.status(user.status).send(user)
        } catch (error) {
            throw error;
        }
       
    }
)

/**
 * @api {put} /user/delete Delete User
 * @apiName DeleteUser
 * @apiGroup User
 * @apiParam {String} password password
 * @apiParam {String} token JSON Web Token that can be used to authenticate
 * @apiSuccess {String} message User deleted successfully
 * @apiError {String} user not found
 * @apiError {String} password not match
 */
router.route('/user/delete').put(async (req, res) => {
    const { password } = req.body;
    const token = req.headers['token']
    try {
        const user = await userInteractorMongoDB.userDelete({ userDeletePersistence }, {token, password});
        res.status(user.status).send(user);
    } catch (error) {
        console.error("Error in delete user route:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

/**
 * @api {put} /user/unblock Unblock User
 * @apiName UnblockUser
 * @apiGroup User
 * @apiParam {String} password password
 * @apiParam {String} token JSON Web Token that can be used to authenticate
 * @apiSuccess {String} message User unblocked successfully
 * @apiError {String} user not found
 * @apiError {String} password not match
 */
router.route('/user/unblock').put(async (req, res) => {
    const { password } = req.body;
    const token = req.headers['token']
    try {
        const user = await userInteractorMongoDB.userUnblock({ userUnblockPersistence }, {token, password});
        res.status(user.status).send(user);
    } catch (error) {
        console.error("Error in unblock user route:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

/**
 * @api {put} /user/edit Edit User
 * @apiName EditUser
 * @apiGroup User
 * @apiParam {String} email email
 * @apiParam {String} first_name first name
 * @apiParam {String} last_name last name
 * @apiParam {String} birthdate birthdate
 * @apiParam {String} profilePicture profile picture
 * @apiParam {String} token JSON Web Token that can be used to authenticate
 * @apiSuccess {String} message User edited successfully
 * @apiError {String} user not found
 * @apiError {String} password not match
 */
router.route('/user/edit').put(upload.single('profilePicture'), async (req, res) => {
    const { email, first_name, last_name, birthdate } = req.body;
    const token = req.headers['token']
    const profilePicture = req.file;
    try {
        const user = await userInteractorMongoDB.userEdit({ userEditPersistence }, {token, email, first_name, last_name, birthdate, profilePicture});
        res.status(user.status).send(user);
    } catch (error) {
        console.error("Error in edit user route:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});


router.route('/user/getByUsername').get(async (req, res) => {
    const {username} = req.body;
    const token = req.headers['token']
    try {
        const user = await userInteractorMongoDB.getByUsername({userGetUserByUsername}, {token, username});
        res.status(user.status).send(user);
    } catch (error) {
        console.error("Error in get user by username route:", error);
        res.status(500).send({ message: "Internal server error" });
    }
});

module.exports = router;