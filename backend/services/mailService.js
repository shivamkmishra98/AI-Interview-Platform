const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
  // Create a transporter using SMTP
  const transporter = nodemailer.createTransport({
    service: 'gmail', // You can change this to sendgrid, mailgun, etc if using other service
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  // Construct email HTML template
  const htmlTemplate = `
    <div style="max-width: 600px; margin: 0 auto; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; background-color: #f9fafb; border-radius: 10px; border: 1px solid #e5e7eb;">
      <h2 style="color: #4f46e5; text-align: center; font-size: 24px; margin-bottom: 20px;">Password Reset Request</h2>
      <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
        You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to:
      </p>
      <div style="text-align: center; margin: 30px 0;">
        <a href="${options.resetUrl}" style="background-color: #4f46e5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px; display: inline-block;">Reset Password</a>
      </div>
      <p style="color: #374151; font-size: 16px; line-height: 1.5; margin-bottom: 10px;">
        Or click the link below:
      </p>
      <p style="word-break: break-all; margin-bottom: 20px;">
        <a href="${options.resetUrl}" style="color: #4f46e5;">${options.resetUrl}</a>
      </p>
      <p style="color: #dc2626; font-size: 14px; font-weight: bold; margin-bottom: 20px;">
        ⚠️ This link is only valid for 10 minutes.
      </p>
      <p style="color: #6b7280; font-size: 14px; text-align: center; border-top: 1px solid #e5e7eb; padding-top: 20px;">
        If you did not request this, please ignore this email and your password will remain unchanged.
      </p>
    </div>
  `;

  // Define email options
  const message = {
    from: `${process.env.FROM_NAME || 'AI Interview Platform'} <${process.env.EMAIL_USER}>`,
    to: options.email,
    subject: options.subject,
    html: htmlTemplate,
  };

  // Send email
  const info = await transporter.sendMail(message);
  console.log('Message sent: %s', info.messageId);
};

module.exports = sendEmail;
