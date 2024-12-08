'use strict'
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const multer = require('multer');
const path = require("path");
const fs = require('fs');
require("../framework/db/mongoDB/models/userModel");
const User = mongoose.model("User");
require("../framework/db/mongoDB/models/documentModel");
const Document = mongoose.model("Document");
require('dotenv').config();

exports.userEditPersistence = async (user) => {
    const { token, email, first_name, last_name, birthdate, profilePicture } = user;
    try {
        if (!token) {
            return ({ status: 400, message: "token is required" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const userData = await User.findOne({ username: decoded.username });
        
        if (!userData) {
            return ({ status: 400, message: "user not found" });
        }

        const isValidEmail = (email) => {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        };

        if (email && !isValidEmail(email)) {
            return ({ status: 400, message: "invalid email format" });
        }

        let birthDate = null;

        if (birthdate) {
            const birthDateRegex = /^(19|20)\d{2}[-/](0[1-9]|1[0-2])[-/](0[1-9]|[12][0-9]|3[01])$/;
            const isValidFormat = birthDateRegex.test(birthdate);

            if (!isValidFormat) {
                return ({ status: 400, message: "invalid birth date format, should be yyyy-mm-dd or yyyy/mm/dd" });
            }

            const [year, month, day] = birthdate.split(/[-/]/).map(Number);
            const parsedDate = new Date(year, month - 1, day);

            birthDate = parsedDate;
        }

        let documentName = null;

        if (profilePicture) {
            const allowedExtensions = [".jpeg", ".png"];
            if (!allowedExtensions.includes(path.extname(profilePicture.originalname).toLowerCase())) {
                return ({ status: 400, message: "only jpeg and png extensions are allowed" });
            }

            const newDocument = new Document({
                hidden_name: profilePicture.filename,
                real_name: profilePicture.originalname,
                insert_date: new Date().toISOString(),
                extension: path.extname(profilePicture.originalname),
                active: "true",
            });

            const savedDocument = await newDocument.save();
            documentName = savedDocument.hidden_name;
        }

        await User.updateOne({ username: userData.username }, {
            email,
            first_name,
            last_name,
            document_name: documentName,
            last_sign_in: new Date(),
            birthdate: birthDate,
        });

        if (profilePicture) {
            const image = await Document.findOne({ hidden_name: documentName });
            if (image) {
                try {
                    const imageBuffer = await fs.promises.readFile(
                        path.join(__dirname, `../uploads/${image.hidden_name}`)
                    );
                    const safeFileName = encodeURIComponent(image.real_name).replace(/['"]/g, '');
                    const base64Image = imageBuffer.toString('base64');
                    const imageMimeType = `image/${image.extension}`;
                    const htmlResponse = `
                        <!DOCTYPE html>
                        <html lang="en">
                        <head>
                            <meta charset="UTF-8">
                            <meta name="viewport" content="width=device-width, initial-scale=1.0">
                            <title>Image Preview</title>
                            <style>
                                body {
                                    font-family: Arial, sans-serif;
                                    margin: 20px;
                                    padding: 0;
                                    background-color: #f4f4f9;
                                    color: #333;
                                }
                                .container {
                                    max-width: 600px;
                                    margin: 0 auto;
                                    text-align: center;
                                    background: #fff;
                                    padding: 20px;
                                    border-radius: 8px;
                                    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                                }
                                img {
                                    max-width: 100%;
                                    height: auto;
                                    border-radius: 8px;
                                    margin-top: 10px;
                                }
                                h1 {
                                    color: #555;
                                }
                            </style>
                        </head>
                        <body>
                            <div class="container">
                                <h1>Your uploaded profile picture</h1>
                                <br>
                                <img src="data:${imageMimeType};base64,${base64Image}" alt="${safeFileName}" />
                            </div>
                        </body>
                        </html>
                    `;
                    return ({ status: 200, message: htmlResponse });
                } catch (error) {
                    console.error("Error reading image file:", error);
                    return ({ status: 500, message: "Error reading image file." });
                }
            } else {
                return ({ status: 404, message: "image not found" });
            }
        } else {
            return ({ status: 200, message: "user edited" });
        }

    } catch (error) {
        console.log("Error in userEditPersistence:", error);
        return ({ status: 400, message: "invalid token" });
    }
}
