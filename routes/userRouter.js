import express from "express";
import {
  currentUser,
  loginUser,
  logoutUser,
  registerUser,
  updateAvatar,
} from "../controllers/userControlers.js";
import { auth } from "../middlewares/auth.js";
import { uploadSingleFile } from "../middlewares/uploadSingleFile.js";

const userRouter = express.Router();

userRouter.post("/register", registerUser);

userRouter.post("/login", loginUser);

userRouter.post("/logout", auth, logoutUser);

userRouter.get("/current", auth, currentUser);

userRouter.patch("/avatars", auth, uploadSingleFile("avatarURL"), updateAvatar);

export default userRouter;
