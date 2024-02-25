import { userSchema } from "../schemas/userSchemas.js";
import { deleteToken, getUser, postUser } from "../services/userServices.js";

export const registerUser = async (req, res) => {
  const userBody = req.body;
  const validation = userSchema.validate(userBody);
  if (validation.error) {
    return res.status(400).json({
      msg: validation.error.message,
    });
  }
  const responce = await postUser(userBody);
  if (responce === 409) {
    return res.status(409).json({
      message: "Email in use",
    });
  }
  if (!responce.email) {
    return res.status(400).json({
      msg: responce,
    });
  }
  res.status(201).json({
    user: {
      email: responce.email,
      subscription: responce.subscription,
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
  const responce = await getUser(userBody);
  if (responce === 401) {
    return res.status(401).json({
      message: "Email or password is wrong",
    });
  }
  if (!responce.email) {
    return res.status(400).json({
      msg: responce,
    });
  }
  res.status(200).json({
    token: responce.token,
    user: {
      email: responce.email,
      subscription: responce.subscription,
    },
  });
};

export const logoutUser = async (req, res) => {
  const responce = await deleteToken(req.user);
  console.log(responce);
  res.status(204).json();
};

export const currentUser = async (req, res) => {
  const user = req.user;
  res.status(200).json({
    email: user.email,
    subscription: user.subscription,
  });
};