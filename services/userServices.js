import { users } from "../models/userModel.js";
import jwt from "jsonwebtoken";
import "dotenv/config";
import pkg from "bcryptjs";
import gravatar from "gravatar";
import path from "path";
import fs from "fs/promises";
import { avatarsDir } from "../vars/avatarsDir.js";
import Jimp from "jimp";
import { customAlphabet } from "nanoid";
import { emailSender } from "../middlewares/emailSender.js";

const nanoid = customAlphabet("1234567890abcdef", 10);

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
    const avatar = gravatar.profile_url(email);
    const verificationToken = nanoid();
    const result = await users.create({
      email,
      password: hash,
      avatarURL: avatar,
      verificationToken,
    });

    emailSender(email, verificationToken);

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
  const verified = user.verify;
  if (!verified) {
    return 303;
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
export async function patchAvatar(req) {
  const { id } = req.user;
  const { path: tempUpload, originalname } = req.file;
  const resultUpload = path.join(avatarsDir, `${id}_${originalname}`);
  let processFailed = false;
  let error;
  Jimp.read(tempUpload)
    .then((av) => {
      return av.resize(250, 250).write(resultUpload);
    })
    .catch((err) => {
      console.error(err);
      processFailed = true;
      error = err;
      return err;
    });
  await fs.unlink(tempUpload).catch((err) => {
    console.log(err);
    processFailed = true;
    error = err;
    return err;
  });
  const avatar = path.join("avatars", `${id}_${originalname}`);
  await users.findByIdAndUpdate(id, { avatarURL: avatar }).catch((err) => {
    processFailed = true;
    error = err;
    return err;
  });
  if (processFailed) {
    return { err: error, processFailed };
  }
  return avatar;
}
export async function findUser(token) {
  const user = await users
    .findOne({ verificationToken: token })
    .catch((err) => {
      return err;
    });
  if (!user) {
    return false;
  }
  if (user.verify) {
    return 400;
  }
  const { id } = user;
  await users.findByIdAndUpdate(id, { verify: true, verificationToken: null });
  return true;
}
export async function reFindUser(email) {
  const user = await users.findOne({ email }).catch((err) => {
    return err;
  });
  if (!user) {
    return false;
  }
  if (user.verify) {
    return 400;
  }
  const { verificationToken } = user;
  emailSender(email, verificationToken);
  return true;
}
