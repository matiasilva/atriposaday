const nodemailer = require("nodemailer");
const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: 'fay.quigley@ethereal.email',
        pass: 'J93T35qNc5GWSVkBtR'
    },
    logger: true,
});

module.exports = {
    mailSub: function (sub, content) {
        return transporter.sendMail({
            from: '"A Tripos a Day" <atriposaday@srcf.net>',
            to: sub.user.email,
            subject: `A Tripos a Day: ${sub.name} question`,
            text: "Hello world?",
        }, (err, info) => { if (err) console.error(err.message) });
    }
};