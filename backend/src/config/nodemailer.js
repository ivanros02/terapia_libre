const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS, // tu App Password
    },
});

// Exportá también el valor de "from"
const defaultFrom = `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_USER}>`;

module.exports = { transporter, defaultFrom };

