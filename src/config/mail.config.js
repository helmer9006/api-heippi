import { debug } from "console";
import nodemailer from "nodemailer";
export const mail = {
  user: "helmer90@outlook.com",
  pass: "helvila",
};

let transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com",
  port: 587,
  secure: false, // true for 465, false for other ports,
  tls: {
    rejectUnauthorized: false,
  },
  auth: {
    user: mail.user, // generated ethereal user
    pass: mail.pass, // generated ethereal password
  },
});

// method sent mail
export const sendMail = async (email, subject, html) => {
  try {
    // send mail with defined transport object
    await transporter.sendMail({
      from: `Heippi Notifications<${mail.user}>`, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      text: "Validation of user", // plain text body
      html: html, // html body
    });
  } catch (error) {
    console.log("Error sendding mail", error);
  }
};

