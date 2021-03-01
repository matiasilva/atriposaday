const exphbs = require('express-handlebars');
const { daysOfTheWeek, months } = require('../utils');

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
        }
    }
});

module.exports = hbs;