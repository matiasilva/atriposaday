const ravenStrategy = require('passport-raven');
const passport = require('passport');
const { User } = require('../models');

passport.use(new ravenStrategy({
    desc: 'A Tripos a Day',
    msg: "It's time to use the bird!",
    audience: process.env["ATAD_FQDN"] || `http://localhost:${process.env.PORT}`,
    debug: false
}, function (crsid, params, done) {
    if (params.isCurrent) {
        done(null, { id: crsid });
    } else {
        done(new Error('A Tripos a Day is only for current students and staff'));
    }
}));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findOne({
        where: {
            crsid: id
        }
    }).then((user) => {
        if(user == null){
            done(null, id);
        }
        else {
            done(null, user);
        }
    });
});

module.exports = passport;
