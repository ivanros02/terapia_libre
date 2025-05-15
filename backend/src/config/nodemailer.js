const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: "ivanrosendo1102@gmail.com", // Tu correo
        pass: "djve kpbf xgwm qgtz", // Tu contraseña o App Password
    },
});

module.exports = transporter;
