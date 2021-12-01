const nodemailer = require('nodemailer');

export class GmailApiHelper {
    /**
     *
     * @param email
     * @param password
     */
    async sendEmailUsingGmail(email: string, password:string) {
        const transporter = nodemailer.createTransport({
            host: 'smtp.gmail.com',
            port: 465,
            secure: true,
            auth: {
                user: email,
                pass: password
            }
        });
        const mailOptions = {
            from: 'protractor@gmail.com',
            to: email,
            subject: 'PS5',
            text: 'see screenshot',
            attachments: [{
                'path': './reports/screenshots/ps5.png',
            }],
        };
        await transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                throw new Error(error);
            }
            console.log(`Mail sent: ${info.response}`);
        });
    }
}
