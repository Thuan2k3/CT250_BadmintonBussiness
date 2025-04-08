// utils/sendMail.js
const nodeMailer = require('nodemailer');
const mailConfig = require('../config/mail.config');

const sendMail = (to, subject, text) => {
    const transport = nodeMailer.createTransport({
        host: mailConfig.HOST,
        port: mailConfig.PORT,
        secure: false,
        auth: {
            user: mailConfig.USERNAME,
            pass: mailConfig.PASSWORD,
        },
    });

    const options = {
        from: mailConfig.FROM_ADDRESS,
        to: to,
        subject: subject,
        text: text,
    };

    return transport.sendMail(options);
};

module.exports = sendMail;
