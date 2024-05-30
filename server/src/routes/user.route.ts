import express from "express";
import { deleteUser, getUserInfo, test, updateUserInfo } from "../controllers/user.controller";
import { verifyUser_byCookie } from './../utils/verifyUser';

const userRouter = express.Router();

userRouter.get("/test", test);
userRouter.post("/update/:id", verifyUser_byCookie, updateUserInfo);
userRouter.delete("/delete/:id", verifyUser_byCookie, deleteUser);

// public for registered users
userRouter.get("/:id", verifyUser_byCookie, getUserInfo);

export default userRouter;
