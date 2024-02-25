import express from "express";
import { currentUser, loginUser, logoutUser, registerUser } from "../controllers/userControlers.js";
import { auth } from "../middlewares/auth.js";


const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", auth, logoutUser);

userRouter.post("/current", auth, currentUser);

export default userRouter;
