import express from 'express';
import { google_controller, logIn_controller, logout_controller, signup_controller } from '../controllers/auth.controller';

const authRouter = express.Router()

authRouter.post("/register", signup_controller);
authRouter.post("/login", logIn_controller);
authRouter.post("/google", google_controller);
authRouter.get("/logout", logout_controller);

export default authRouter;