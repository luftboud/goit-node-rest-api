import { users } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import pkg from "bcryptjs";

const bcrypt = pkg;

export async function postUser(userBody) {
  const { email, password } = userBody;
  const userInUse = await users.findOne({ email }).catch((err) => {
    return err;
  });
  if (userInUse) {
    return 409;
  }
  try {
    const hash = bcrypt.hashSync(password, 8);
    const result = await users.create({ email, password: hash });
    return result;
  } catch (err) {
    return err;
  }
}

export async function getUser(userBody) {
  const { email, password } = userBody;
  const user = await users.findOne({ email }).catch((err) => {
    return err;
  });
  if (!user) {
    return 401;
  }
  const checkPassword = bcrypt.compareSync(password, user.password);
  if (!checkPassword) {
    return 401;
  }
  const payload = {
    id: user.id,
    email: user.email,
  };
  const token = jwt.sign(payload, process.env.SECRET_WORD, { expiresIn: "1h" });
  await users.findByIdAndUpdate(user.id, { token });
  const result = await users.findById(user.id);
  return result;
}

export async function deleteToken(userBody) {
  const { id } = userBody;
  const token = null;
  const result = await users.findByIdAndUpdate(id, { token });
  return result;
}
