// utils/mailer.js
const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 465, // use 465 for SSL
  secure: true, //  true for 465
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS, // must be Gmail App Password
  },
  tls: {
    rejectUnauthorized: false, // helps if SSL validation fails locally
  },
});
// verify transporter once on startup (optional)
transporter.verify((err, success) => {
  if (err) {
    console.error("SMTP Connection Failed:", err);
  } else {
    console.log("SMTP is ready to send messages");
  }
});

async function sendVerificationEmail(toEmail, userFullName, token) {
  const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
  const link = `${frontendUrl}/verify-email?token=${encodeURIComponent(
    token
  )}&email=${encodeURIComponent(toEmail)}`;

  const html = ` 
  <!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to EasyLearn</title>
  </head>
  <body style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
    <div style="background: linear-gradient(to right, #36D1DC, #5B86E5); padding: 30px; text-align: center; border-radius: 12px 12px 0 0;">

    <h1 style="color: white; margin: 0; font-size: 28px; font-weight: 500;">Welcome to EasyLearn!</h1>
    </div>
    <div style="background-color: #ffffff; padding: 35px; border-radius: 0 0 12px 12px; box-shadow: 0 4px 15px rgba(0,0,0,0.05);">
      <p style="font-size: 18px; color: #5B86E5;"><strong>Hello ${userFullName},</strong></p>
      <p>We're excited to have you join our learning platform! 
      </p>
       
      <div style="text-align: center; margin: 30px 0;">
          <p>Thanks for registering. Please confirm your email by clicking the link below:</p>
        <a href=${link} style="background: linear-gradient(to right, #36D1DC, #5B86E5); color: white; text-decoration: none; padding: 12px 30px; border-radius: 50px; font-weight: 500; display: inline-block;">
          Verify my email
        </a>
      </div>
      
      <p style="margin-bottom: 5px;">If you need any help or have questions, we're always here to assist you.</p>
      <p style="margin-top: 0;">Happy Learning!</p>
       
    </div>
    
    <div style="text-align: center; padding: 20px; color: #999; font-size: 12px;">
      <p>© 2025 Messenger. All rights reserved.</p>
      <p>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Privacy Policy</a>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Terms of Service</a>
        <a href="#" style="color: #5B86E5; text-decoration: none; margin: 0 10px;">Contact Us</a>
      </p>
    </div>
  </body>
  </html>
    `;

  const mailOptions = {
    from: process.env.EMAIL_FROM,
    to: toEmail,
    subject: "Please verify your email",
    html,
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  sendVerificationEmail,
  transporter
};
