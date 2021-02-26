const { User } = require('../models');

module.exports = {
    exposeUserInView: function (req, res, next) {
        res.locals.user = (req.user instanceof User) && req.user;
        next();
    }
};