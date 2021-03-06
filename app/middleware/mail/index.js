const nodemailer = require('nodemailer');
const handlebars = require('handlebars');
const helpers = require('../handlebars/helpers');
const fs = require('fs');
const path = require('path');

handlebars.registerHelper(helpers);
const source = fs.readFileSync(path.join(__dirname, 'subscription.handlebars'), 'utf8');

module.exports = {
    config: {
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'graciela.frami38@ethereal.email',
            pass: '7WbpwttxXxe7ww29Np'
        },
        logger: true,
        pool: true
    },
    sender: '"A Tripos a Day" <atriposaday@srcf.net>',
    template: handlebars.compile(source),
    nodemailer
};