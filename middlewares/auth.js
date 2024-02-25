import jwt from "jsonwebtoken";
import "dotenv/config";
import { users } from "../models/userModel.js";

export const auth = async (req, res, next) => {
  const token =
    req.headers.authorization?.startsWith("Bearer") &&
    req.headers.authorization.split(" ")[1];
  const id = checkToken(token);
  if (id === 401) {
    return res.status(401).json({
      message: "Not authorized",
    });
  }
    const user = await users.findById(id);
  if (!user || user.token !== token) {
    return res.status(401).json({
        message: "Not authorized",
    });
  }
    req.user = user;
    next();
};

const checkToken = (token) => {
  if (!token) {
    return 401;
  }
  try {
    const { id } = jwt.verify(token, process.env.SECRET_WORD);
    return id;
  } catch (err) {
    console.log(err);
    return 401;
  }
};
