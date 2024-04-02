import express from 'express'
import { logInController, signupController } from '../controllers/auth.controller';

const authRouter = express.Router()

authRouter.post("/register", signupController);
authRouter.post("/login", logInController);

export default authRouter;