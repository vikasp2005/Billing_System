import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 465,
    secure: true,
    secureConnection: true,
    auth: {
        user: process.env.EMAIL,
        pass: process.env.NODEMAILER_PASSKEY
    }
});

export const sendResetPasswordEmail = async (email, token) => {
    const mailOptions = {
        from: 'your-email@example.com',
        to: email,
        subject: 'Reset Your Password',
        html: `
      <p>You requested a password reset</p>
      <p>Click this <a href="http://localhost:3000/reset-password/${token}">link</a> to set a new password.</p>
    `
    };

    await transporter.sendMail(mailOptions);
};