module.exports = {
    config: {
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'fay.quigley@ethereal.email',
            pass: 'J93T35qNc5GWSVkBtR'
        },
        logger: true,
    },
    sender: '"A Tripos a Day" <atriposaday@srcf.net>'
};