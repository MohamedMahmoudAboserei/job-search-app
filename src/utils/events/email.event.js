import { EventEmitter } from 'node:events';
import { sendEmail, subjectTypes } from '../email/send.email.js';
import { customAlphabet } from 'nanoid'
import { verificationEmailTemplate } from '../email/template/verification.email.js';
import userModel from '../../db/model/User.model.js';
import { generateHash } from '../security/hash.security.js';
import * as dbService from '../../db/db.service.js';

export const emailEvent = new EventEmitter();

const sendCode = async ({ data, subject = subjectTypes.confirmEmail }) => {
    const { id, email } = data;

    const otp = customAlphabet('0123456789', 4)();
    const html = verificationEmailTemplate({ code: otp });
    const hash = generateHash({ plainText: `${otp}` });

    const otpEntry = {
        code: hash,
        type: subject === subjectTypes.confirmEmail ? subjectTypes.confirmEmail : subjectTypes.resetPassword,
        expiresIn: new Date(Date.now() + 10 * 60 * 1000),
    };

    await dbService.updateOne({
        model: userModel,
        filter: { _id: id },
        data: { $push: { OTP: otpEntry } }
    });

    await sendEmail({ to: email, subject, html });

    setTimeout(async () => {
        console.log(`Deleting expired OTP for email: ${email}`);
        await dbService.updateOne({
            model: userModel,
            filter: { _id: id },
            data: { $pull: { OTP: { code: hash } } }
        });
    }, 10 * 60 * 1000);
};

const sendApplicationStatusEmail = async ({ data }) => {
    const { email, applicationStatus, jobTitle } = data;
    const html = verificationEmailTemplate({ applicationStatus, jobTitle });

    const subject =
        applicationStatus === 'accepted'
            ? 'Congratulations! Your application has been accepted 🎉'
            : 'Application Update: Your application has been rejected';

    await sendEmail({ to: email, subject, html });
};

emailEvent.on("sendEmail", async (data) => {
    await sendCode({ data, subject: subjectTypes.confirmEmail });
});

emailEvent.on("sendForgetPassword", async (data) => {
    await sendCode({ data, subject: subjectTypes.resetPassword });
});

emailEvent.on("sendApplicationStatus", async (data) => {
    await sendApplicationStatusEmail({ data });
});