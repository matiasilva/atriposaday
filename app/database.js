const { Sequelize } = require('sequelize');

module.exports = {
    db: new Sequelize('postgres://postgres:password@db:5432/atriposaday'),
    syncAll: function (db) {
        for (model in db.models) {
            db.models[model].sync();
        }
    }
}
