import { userSchema } from "../schemas/userSchemas.js";
import {
  deleteToken,
  getUser,
  patchAvatar,
  postUser,
} from "../services/userServices.js";

export const registerUser = async (req, res) => {
  const userBody = req.body;
  const validation = userSchema.validate(userBody);
  if (validation.error) {
    return res.status(400).json({
      msg: validation.error.message,
    });
  }
  const response = await postUser(userBody);
  if (response === 409) {
    return res.status(409).json({
      message: "Email in use",
    });
  }
  if (!response.email) {
    return res.status(400).json({
      msg: response,
    });
  }
  res.status(201).json({
    user: {
      email: response.email,
      subscription: response.subscription,
    },
  });
};

export const loginUser = async (req, res) => {
  const userBody = req.body;
  const validation = userSchema.validate(userBody);
  if (validation.error) {
    return res.status(400).json({
      msg: validation.error.message,
    });
  }
  const response = await getUser(userBody);
  if (response === 401) {
    return res.status(401).json({
      message: "Email or password is wrong",
    });
  }
  if (!response.email) {
    return res.status(400).json({
      msg: response,
    });
  }
  res.status(200).json({
    token: response.token,
    user: {
      email: response.email,
      subscription: response.subscription,
    },
  });
};

export const logoutUser = async (req, res) => {
  const response = await deleteToken(req.user);
  console.log(response);
  res.status(204).json();
};

export const currentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};

export const updateAvatar = async (req, res) => {
  const response = await patchAvatar(req);
  if (response.processFailed) {
    return res.status(400).json({
      msg: "Something went wrong!",
      error: response.err,
    });
  }
  res.status(200).json({
    msg: "Avatar successfuly updated!",
    avatar: response
  });
};
