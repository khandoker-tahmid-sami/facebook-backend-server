// const { Resend } = require("resend");

// const sendEmail = async (to, subject, html) => {
//   const resend = new Resend(process.env.RESEND_API_KEY);
//   const { error } = await resend.emails.send({
//     from: "Facehook App <onboarding@resend.dev>",
//     to,
//     subject,
//     html,
//   });

//   if (error) {
//     throw new Error(error.message || error.name || "Failed to send email");
//   }
// };

// module.exports = sendEmail;

const nodemailer = require("nodemailer");

const getGmailConfig = () => {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (!user || !pass) {
    throw new Error("Email is not configured. Set GMAIL_USER and GMAIL_APP_PASSWORD in .env.");
  }

  return { user, pass };
};

const sendEmail = async (to, subject, html) => {
  const { user, pass } = getGmailConfig();

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user,
      pass,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Facehook App" <${user}>`,
      to,
      subject,
      html,
    });
  } catch (err) {
    throw new Error(`Email delivery failed: ${err.message}`);
  }
};

module.exports = sendEmail;
