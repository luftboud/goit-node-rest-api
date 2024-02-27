import { userSchema, verifySchema } from "../schemas/userSchemas.js";
import {
  deleteToken,
  findUser,
  getUser,
  patchAvatar,
  postUser,
  reFindUser,
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
  if (response === 303) {
    return res.status(303).json({
      message: "Your account is not verified",
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
  if (req.file === undefined || !req.file) {
    return res.status(400).json({
      msg: "You should upload file!",
    });
  }
  const response = await patchAvatar(req);
  if (response.processFailed) {
    return res.status(400).json({
      msg: "Something went wrong!",
      error: response.err,
    });
  }
  res.status(200).json({
    msg: "Avatar successfuly updated!",
    avatar: response,
  });
};

export const verifyUser = async (req, res) => {
  const token = req.params.verificationToken;
  const response = await findUser(token);
  if (response === 400) {
    return res.status(400).json({
      msg: "This user has already been verified.",
    });
  }
  if (!response) {
    return res.status(404).json({
      msg: "Not found!",
    });
  }
  res.status(200).json({
    msg: "Verification successful.",
  });
};

export const sendEmail = async (req, res) => {
  const validation = verifySchema.validate(req.body);
  if (validation.error) {
    res.status(400).json({
      msg: validation.error.message,
    });
  }
  const response = await reFindUser(req.body.email);
  if (response === 400) {
    return res.status(400).json({
      msg: "This user has already been verified.",
    });
  }
  if (!response) {
    return res.status(404).json({
      msg: "Not found!",
    });
  }
  res.status(200).json({
    msg: "Verification email sent.",
  });
};
