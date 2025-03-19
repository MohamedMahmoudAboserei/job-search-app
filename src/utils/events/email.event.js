// Import files
import { EventEmitter } from 'node:events';
import { sendEmail, subjectTypes } from '../email/send.email.js';
import { customAlphabet } from 'nanoid'
import { verificationEmailTemplate } from '../email/template/verification.email.js';
import userModel from '../../db/model/User.model.js';
import { generateHash } from '../security/hash.security.js';
import * as dbService from '../../db/db.service.js';

// Creating an instance of EventEmitter to handle email-related events
export const emailEvent = new EventEmitter();

// Function to generate and send a verification or password reset code via email
const sendCode = async ({ data, subject = subjectTypes.confirmEmail }) => {
    const { id, email } = data;

    // Generating a 4-digit numeric OTP code
    const otp = customAlphabet('0123456789', 4)();

    // Creating email content using the template
    const html = verificationEmailTemplate({ code: otp });

    // Hashing the OTP for security
    const hash = generateHash({ plainText: `${otp}` });

    // Creating an OTP entry with expiration time (10 minutes)
    const otpEntry = {
        code: hash,
        type: subject === subjectTypes.confirmEmail ? subjectTypes.confirmEmail : subjectTypes.resetPassword,
        expiresIn: new Date(Date.now() + 10 * 60 * 1000),
    };

    // Saving the OTP entry in the user's database record
    await dbService.updateOne({
        model: userModel,
        filter: { _id: id },
        data: { $push: { OTP: otpEntry } }
    });

    // Sending the email with the OTP code
    await sendEmail({ to: email, subject, html });

    // Setting a timeout to automatically delete the OTP after expiration
    setTimeout(async () => {
        console.log(`Deleting expired OTP for email: ${email}`);
        await dbService.updateOne({
            model: userModel,
            filter: { _id: id },
            data: { $pull: { OTP: { code: hash } } }
        });
    }, 10 * 60 * 1000);
};

// Function to send an email notification about an application status update
const sendApplicationStatusEmail = async ({ data }) => {
    const { email, applicationStatus, jobTitle } = data;
    // Creating email content using the template
    const html = verificationEmailTemplate({ applicationStatus, jobTitle });

    // Setting the subject based on the application status
    const subject =
        applicationStatus === 'accepted'
            ? 'Congratulations! Your application has been accepted 🎉'
            : 'Application Update: Your application has been rejected';

    // Sending the email notification
    await sendEmail({ to: email, subject, html });
};

// Event listener to send email verification OTP
emailEvent.on("sendEmail", async (data) => {
    await sendCode({ data, subject: subjectTypes.confirmEmail });
});

// Event listener to send password reset OTP
emailEvent.on("sendForgetPassword", async (data) => {
    await sendCode({ data, subject: subjectTypes.resetPassword });
});

// Event listener to send application status update emails
emailEvent.on("sendApplicationStatus", async (data) => {
    await sendApplicationStatusEmail({ data });
});