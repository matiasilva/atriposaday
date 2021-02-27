const { User } = require('../models');

module.exports = {
    // possible improvements here with combining these two methods
    exposeUserInView: function (req, res, next) {
        res.locals.user = (req.user instanceof User) && req.user;
        next();
    },
    requireAuth: function(req, res, next){
        // user has not logged in at all
        if(!req.user) return res.redirect('/login');
        // user has valid crsid, BUT isn't in the DB
        // we automatically deserialize user, so req.user will hold
        // a valid user if they exist
        if (!(req.user instanceof User)) return res.redirect('/signup');
        next();
    }
};