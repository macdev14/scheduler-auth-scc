import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { register, login, changePassword, deleteUser, blockUser, unblockUser, editUser } from "../controllers/userController";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";


// test/userController.test.js
const request = require('supertest');
const jwt = require('jsonwebtoken');
const bcryptjs = require('bcryptjs');
const app = require('../index'); // Assuming Express app is exported from app.js
const userPayload = { username: 'test', password: 'password' };
const Document = require('../models/documentModel');

vi.mock('../models/userModel', () => ({
    findOne: vi.fn(), // Mocking findOne method
    create: vi.fn()    // Mocking create method if needed
  }));
vi.mock("../models/documentModel");
vi.mock("bcryptjs");
vi.mock("jsonwebtoken");
vi.mock("fs/promises");

describe("userController", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("register", () => {
    it("should return 400 if username or password is missing", async () => {
      const req = { body: {} };
      const res = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    //   expect(res.send).toHaveBeenCalledWith("username and password are required");
    });

    it("should return 400 if password is too short", async () => {
      const req = { body: { username: "test", password: "123" } };
      const res = {
        status: vi.fn().mockReturnThis(),
        send: vi.fn(),
      };

      await register(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
    //   expect(res.send).toHaveBeenCalledWith("password must be at least 6 characters");
    });

    // it("should create a new user if valid data is provided", async () => {
    //   const req = { body: userPayload };
    //   const res = {
    //     status: vi.fn().mockReturnThis(),
    //     send: vi.fn(),
    //   };

    //   await register(req, res);
  
    //   expect(res.status).toHaveBeenCalledWith(200);

    // });

    // it("should return 400 if the user already exists", async () => {
    //   const req = { body: userPayload };
    //   const res = {
    //     status: vi.fn().mockReturnThis(),
    //     send: vi.fn(),
    //   };

    //   bcryptjs.hash.mockResolvedValue("hashed_password");
    // //   User.collection.createIndex.mockRejectedValue({ code: 11000 });

    //   await register(req, res);

    //   expect(res.status).toHaveBeenCalledWith(400);
    // //   expect(res.send).toHaveBeenCalledWith("user already exists");
    // });
  });

//   describe("login", () => {
    // it("should return 400 if user is not found", async () => {
    //   const req = { body: { username: "test", password: "password123" } };
    //   const res = {
    //     status: vi.fn().mockReturnThis(),
    //     send: vi.fn(),
    //   };

    //   await login(req, res);

    //   expect(res.status).toHaveBeenCalledWith(400);
    
    // });

    // it("should return 400 for invalid credentials", async () => {
    //   const req = { body: { username: "test", password: "wrong_password" } };
    //   const res = {
    //     status: vi.fn().mockReturnThis(),
    //     send: vi.fn(),
    //   };

      //User.findOne.mockResolvedValue({ username: "test", password: "hashed_password" });
    //   bcryptjs.compare.mockResolvedValue(false);

    //   await login(req, res);

    //   expect(res.status).toHaveBeenCalledWith(400);
    // //   expect(res.send).toHaveBeenCalledWith("Invalid credentials");
    // });

    // it("should return a token for valid credentials", async () => {
    //   const req = { body: userPayload };
    //   const res = {
    //     status: vi.fn().mockReturnThis(),
    //     send: vi.fn(),
    //   };

    //   //User.findOne.mockResolvedValue({ username: "test", password: "hashed_password", active: true });
    //   bcryptjs.compare.mockResolvedValue(true);
    //   jwt.sign.mockReturnValue("mock_token");

    //   await login(req, res);

    //   expect(jwt.sign).toHaveBeenCalled();
    //   expect(res.status).toHaveBeenCalledWith(200);
    // //   expect(res.send).toHaveBeenCalledWith({ token: "mock_token" });
    // });
//   });
  describe('PUT /change-password', () => {
    it('should return 400 if token, oldPassword, or newPassword is missing', async () => {
        const res = await request(app).put('/api/user/change-password').send({});
        expect(res.status).toBe(400);
        // expect(res.text).toBe('token, old password and new password are required');
    });

    it('should return 400 if token is invalid', async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error();
        });

        const res = await request(app).put('/api/user/change-password')
            .set('token', 'invalid-token')
            .send({username: 'existingUser', oldPassword: '123456', newPassword: 'newpassword' });

        expect(res.status).toBe(400);
        // expect(res.text).toBe('invalid token');
    });

    it('should return 400 if user is not found', async () => {
        jwt.verify.mockReturnValue({ username: 'nonexistentUser' });
        //User.findOne.mockResolvedValue(null);

        const res = await request(app).put('/api/user/change-password')
            .set('token', 'valid-token')
            .send({ username: 'existingUser', oldPassword: '123456', newPassword: 'newpassword' });

        expect(res.status).toBe(400);
        // expect(res.text).toBe('user not found');
    });

    it('should return 400 if old password does not match', async () => {
        jwt.verify.mockReturnValue({ username: 'existingUser' });
        //User.findOne.mockResolvedValue({ password: 'hashed-password' });
        bcryptjs.compare.mockResolvedValue(false);

        const res = await request(app).put('/api/user/change-password')
            .set('token', 'valid-token')
            .send({ username: 'existingUser', oldPassword: 'wrongpassword', newPassword: 'newpassword' });

        expect(res.status).toBe(400);
        // expect(res.text).toBe('old password not match');
    });

    // it('should return 200 if password is successfully changed', async () => {
    //     const res = await request(app).put('/api/user/change-password')
    //         .set('token', 'valid-token')
    //         .send({ username: userPayload.username, oldPassword: '123456', newPassword: 'newpassword' });

    //     expect(res.status).toBe(200);
    // });
});
describe('DELETE /user/delete', () => {
    it('should return 400 if token or password is missing', async () => {
        const res = await request(app).delete('/api/user/delete').send({});
        expect(res.status).toBe(400);
        expect(res.text).toBe('token and password are required');
    });

    it('should return 400 if token is invalid', async () => {
        jwt.verify.mockImplementation(() => {
            throw new Error();
        });

        const res = await request(app).delete('/api/user/delete')
            .set('token', 'invalid-token')
            .send({ password: 'password' });

        expect(res.status).toBe(400);
        expect(res.text).toBe('invalid token');
    });

    it('should return 400 if user is not found', async () => {
        jwt.verify.mockReturnValue({ username: 'nonexistentUser' });
        //User.findOne.mockResolvedValue(null);

        const res = await request(app).delete('/api/user/delete')
            .set('token', 'valid-token')
            .send({ password: 'password' });

        expect(res.status).toBe(400);
        // expect(res.text).toBe('user not found');
    });

    it('should return 400 if password does not match', async () => {
        jwt.verify.mockReturnValue({ username: userPayload.username });
        //User.findOne.mockResolvedValue({ password: 'hashed-password' });
        bcryptjs.compare.mockResolvedValue(false);

        const res = await request(app).delete('/api/user/delete')
            .set('token', 'valid-token')
            .send({ password: 'wrongpassword' });

        expect(res.status).toBe(400);
      
    });

    // it('should return 200 if user is successfully deleted', async () => {
    //     jwt.verify.mockReturnValue({ username: userPayload.username });
   
    //     bcryptjs.compare.mockResolvedValue(true);
    

    //     const res = await request(app).delete('/api/user/delete')
    //         .set('token', 'valid-token')
    //         .send({ password: 'password' });

    //     expect(res.status).toBe(200);
    //     expect(res.text).toBe('user deleted');
    // });
});
// describe('PUT /block-user and /unblock-user', () => {
//     const testCases = [
//         { route: 'api/user/block', finalStatus: false, message: 'user blocked' },
//         { route: 'api/user/unblock', finalStatus: true, message: 'user unblocked' },
//     ];

//     testCases.forEach(({ route, finalStatus, message }) => {
//         it(`should block or unblock a user for route ${route}`, async () => {
//             jwt.verify.mockReturnValue({ username: 'existingUser' });
           
//             bcryptjs.compare.mockResolvedValue(true);
         

//             const res = await request(app).put(route)
//                 .set('token', 'valid-token')
//                 .send({ password: 'password' });

//             expect(res.status).toBe(200);
//             expect(res.text).toBe(message);
//         });
//     });
// });

// describe('PUT /edit', () => {
//     it('should return 400 if token is missing', async () => {
//         const res = await request(app).put('/api/user/edit').send({});
//         expect(res.status).toBe(400);
//         expect(res.text).toBe('token is required');
//     });

//     it('should return 400 if user is not found', async () => {
       
       

//         const res = await request(app).put('/api/user/edit')
//             .set('token', 'valid-token')
//             .send({ email: 'newemail@example.com' });

//         expect(res.status).toBe(400);
     
//     });

//     it('should return 400 for invalid email', async () => {
//         const res = await request(app).put('/api/user/edit')
//             .set('token', 'valid-token')
//             .send({ email: 'invalid-email' });

//         expect(res.status).toBe(400);
      
//     });

//     it('should update user details successfully', async () => {
       
//         const res = await request(app).put('/api/user/edit')
//             .set('token', 'valid-token')
//             .send({ email: 'newemail@example.com' });

//         expect(res.status).toBe(200);
      
//     });
// });


 
});
