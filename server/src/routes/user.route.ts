import express from "express";
import { deleteUser, test, updateUserInfo } from "../controllers/user.controller";
import { verifyUser_byCookie } from './../utils/verifyUser';

const userRouter = express.Router();

userRouter.get("/test", test);
userRouter.post("/update/:id", verifyUser_byCookie, updateUserInfo);
userRouter.delete("/delete/:id", verifyUser_byCookie, deleteUser);


export default userRouter;
