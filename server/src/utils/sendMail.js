import nodemailer from "nodemailer";
import { EMAIL_USER, EMAIL_PASS } from "../config/index.js";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: EMAIL_USER,
        pass: EMAIL_PASS
    }
});

const sendMail = async (to, subject, text) => {
    const mailOptions = {
        from: EMAIL_USER,
        to,
        subject,
        text
    };

    await transporter.sendMail(mailOptions);
};

export default sendMail;