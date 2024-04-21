import express from "express";
import { test, updateUserInfo } from "../controllers/user.controller";
import { verifyUser_byCookie } from './../utils/verifyUser';

const userRouter = express.Router();

userRouter.get("/test", test);
userRouter.post("/update/:id", verifyUser_byCookie, updateUserInfo);

export default userRouter;
