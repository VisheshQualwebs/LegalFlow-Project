const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

const sendMail = async ({ to, subject, html }) => {
    await transporter.sendMail({
        from: `"LegalFlow" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html,
    });
};

module.exports = { sendMail };

/* 

const { sendMail } = require("../utils/mail");

await sendMail({
    to: "client@gmail.com",
    subject: "Upcoming Hearing Reminder",
    html: `
        <h2>LegalFlow</h2>
        <p>Your hearing is scheduled on <b>20 August 2026</b>.</p>
        <p>Please be available on time.</p>
    `,
});

*/