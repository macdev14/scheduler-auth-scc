//required app modules
const express = require("express");
const path = require("path");
require('dotenv').config();
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./public/apidocjs/swagger.json');
const { userCreateAdminPersistence } = require("./use-cases/userCreateAdminPersistence");
const { adminCreateRolesPersistence } = require("./use-cases/adminCreateRolesPersistence");
const userInteractorMongoDB = require("./use-cases/userInteractorMongoDB");
const adminInteractorMongoDB = require("./use-cases/adminInteractorMongoDB");
//-----------------

const app = express();
let port=process.env.PORT || 3000;
let uri=process.env.MONGO_CONNECTION_STRING;

//database connection
mongoose.connect(uri).then(() => {
    console.log("Connected to the database");
    (async () => {
        try {
            const user = await userInteractorMongoDB.userCreateAdmin({ userCreateAdminPersistence }, {});
            console.log(user);
            const role = await adminInteractorMongoDB.createRoles({adminCreateRolesPersistence},{});
            console.log(role);
        } catch (err) {
            console.log(err);
        }
    })();
    
}).catch((err) => {
    console.log(err);
})

//middleware
app.use(bodyParser.json()); //parse application/json and application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true })); //allowing for extended syntax (i.e. arrays, objects, nested objects, etc.)

//routes
app.use('/', express.static(path.join(__dirname, 'public'))); 
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument)); //serve api documentation
app.use('/api-docjs', express.static('./public/apidocjs')); 
app.use("/api", require("./controllers/routes/userRoute")); //user route
app.use("/api", require("./controllers/routes/adminRoute")); //admin route


app.get("/", (req, res) => {
    res.send("Hello, World!");
});
  
app.listen(port, () => {
    console.log("Server running on port: " + port);
})