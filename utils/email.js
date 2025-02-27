const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // 1)Transporter
  const Transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });
  // 2)Define email options
  const mailOptions = {
    from: 'Zero <zero@gmail.com>',
    to: options.email,
    to: options.email,
    subject: options.subject,
    text: options.message,
    // html:
  };
  // 3)actually sent the email
  await Transporter.sendMail(mailOptions);
};

module.exports = sendEmail;
