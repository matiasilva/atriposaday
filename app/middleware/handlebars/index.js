const exphbs = require('express-handlebars');
const helpers = require('./helpers');

const hbs = exphbs.create({
    helpers
});

module.exports = hbs;