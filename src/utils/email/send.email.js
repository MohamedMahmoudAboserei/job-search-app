import nodemailer from "nodemailer";

export const subjectTypes = {
    confirmEmail: 'confirm-email',
    resetPassword: 'reset-password',
}

export const sendEmail = async ({
    to = [],
    cc = [],
    bcc = [],
    subject = "Confirm-Email",
    text = "",
    html = "",
    attachments = []
} = {}) => {
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL,
            pass: process.env.EMAIL_PASSWORD,
        },
    });
    const info = await transporter.sendMail({
        from: `"C43 Rou te" <${process.env.EMAIL}>`,
        to,
        bcc,
        subject,
        text,
        html, 
        attachments,
    });

    return info;
}