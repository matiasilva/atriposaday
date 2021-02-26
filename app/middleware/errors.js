module.exports = {
    notFoundHandler: function (req, res, next) {
        res.status(404).render("404");
    },
    errorHandler: function (err, req, res, next) {
        console.error(err);
        res.render("error", { error: err });
    }
}