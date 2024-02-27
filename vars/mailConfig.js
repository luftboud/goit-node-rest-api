import "dotenv/config";

export const config = {
  host: "smtp.meta.ua",
  port: 465,
  secure: true,
  auth: {
    user: "luftboud@meta.ua",
    pass: process.env.META_PASSWORD,
  },
};