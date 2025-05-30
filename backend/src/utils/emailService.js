const { transporter, defaultFrom } = require("../config/nodemailer");
const path = require("path");

const sendEmail = async ({ to, subject, html, from = defaultFrom, attachments = [] }) => {
  try {
    const logoAttachment = {
      filename: "logo.png",
      path: path.join(__dirname, "../assets/logo.png"),
      cid: "logo_terapia",
      contentDisposition: "inline", // 🟢 fuerza que no se muestre como archivo descargable
    };


    await transporter.sendMail({
      from,
      to,
      subject,
      html,
      attachments: [...attachments, logoAttachment], // ✅ añade el logo automáticamente
    });

    console.log(`✅ Email enviado a ${to}`);
  } catch (error) {
    console.error(`❌ Error al enviar el email a ${to}:`, error);
  }
};


module.exports = { sendEmail };
