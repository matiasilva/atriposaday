const exphbs = require('express-handlebars');
const { daysOfTheWeek, months } = require('../utils');
const { SUBJECTS, PAPER_TYPES } = require('../enums');

const hbs = exphbs.create({
    helpers: {
        'is_admin_page': function (viewName, opts) {
            if (viewName === 'admin') {
                return opts.fn(this);
            }
        },
        'display_flashes': function (flashes, options) {
            let ret = '';
            let flash;
            while ((flash = flashes.shift()) != undefined) {
                ret = ret + options.fn(flash);
            }
            return ret;
        },
        'ifeq': function (a, b, opts) {
            if (a === b) return opts.fn(this);
            return opts.inverse(this);
        },
        'unlesseq': function (a, b, opts) {
            if (!a || !(a === b)) return opts.fn(this);
        },
        'readable_date': function (date) {
            return `${daysOfTheWeek[date.getDay()]}, ${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()}`;
        },
        'readable_time': function(date){
            return `${date.getHours()}:${date.getMinutes()}`;
        },
        'readable_subject': function(part, subject){
            return SUBJECTS[part][subject];
        },
        'readable_qtype': function(type){
            return PAPER_TYPES[type];
        }
    }
});

module.exports = hbs;