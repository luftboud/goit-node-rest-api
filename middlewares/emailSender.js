import nodemailer from "nodemailer";
import { config } from "../vars/mailConfig.js";

export function emailSender(email, token) {
  const transporter = nodemailer.createTransport(config);
  const emailOptions = {
    from: config.auth.user,
    to: email,
    subject: "Verify your account",
    text: `Hello! Here is your token for verification - ${token}`,
    path: `http://localhost:3000/api/users/verify/${token}`,
  };
    transporter.sendMail(emailOptions).then(info => console.log(info)).catch(err => console.log(err))
}
