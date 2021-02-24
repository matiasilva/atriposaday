module.exports = {
    "pick": function (keys, obj) {
        const values = {};
        for (const key of keys) {
            values[key] = obj[key];
        }
        return values;
    }
}