module.exports = {
    notFoundHandler: function (req, res, next) {
        return res.status(404).render('404');
    },
    errorHandler: function (err, req, res, next) {
        console.error(err.stack);
        return res.render('error', { error: err });
    }
};