const nodemailer = require('nodemailer');

const from = process.env.EMAIL_ADDRESS;
const subject = 'ChatGPT Account Verification Code';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: from,
        pass: process.env.EMAIL_APP_PASSWORD
    },
    secure: true,
});

transporter.verify((err) => {
    if(err)
        console.log('Error verifying transporter.');
    else
        console.log('Transporter has been verified.');
});

const emailCode = async (user, code) => {
    const text = `Hi ${user.firstName},

Your verification code is ${code}.

Thanks`;

    const mailOptions = {
        from: from,
        to: user.email,
        subject: subject,
        text: text,
    };

    return await transporter.sendMail(mailOptions);
}

module.exports = emailCode