import express from "express"
import UserController from "./user.controller.js"
import jwtAuth from "../../middelewares/jwt.middeleware.js";

const UserRouter = express.Router()

const userController = new UserController()

UserRouter.post('/signup', (req, res,next)=>{
    userController.signUp(req, res,next)
});
UserRouter.post('/signin', (req, res)=>{
    userController.signIn(req, res)
});
UserRouter.post('/resetpassword',jwtAuth, (req, res)=>{
    userController.resetPassword(req, res)
});


export default UserRouter

