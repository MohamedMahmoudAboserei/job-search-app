// Import files
import nodemailer from "nodemailer";

// Defining email subject types for different email purposes
export const subjectTypes = {
    confirmEmail: 'confirm-email',
    resetPassword: 'reset-password',
}

// Function to send an email with configurable options
export const sendEmail = async ({
    to = [],
    cc = [],
    bcc = [],
    subject = "Confirm-Email",
    text = "",
    html = "",
    attachments = []
} = {}) => {
    // Creating a transporter to handle email sending via Gmail
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });

    // Sending the email using the configured transporter
    const info = await transporter.sendMail({
        from: `"C43 Rou te" <${process.env.EMAIL}>`,
        to,
        bcc,
        subject,
        text,
        html, 
        attachments
    });

    return info;
}