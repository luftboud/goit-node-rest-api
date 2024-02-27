import Joi from "joi";

export const userSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});

export const verifySchema = Joi.object({
  email: Joi.string().required(),
});