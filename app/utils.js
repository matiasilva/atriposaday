module.exports = {
    "pick": function (keys, obj) {
        const values = {};
        for (const key of keys) {
            values[key] = obj[key];
        }
        return values;
    },
    "matchEmail" : function(email){
        const emailRe = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
        return emailRe.test(email);
    }
};