const express = require('express');
const { exposeUserInView } = require('../middleware/custom');
const router = express.Router();
const db = require('../models');

// make user available in view
router.use(exposeUserInView);

router.get('/', async (req, res) => {
    const { Topic, Answerable, Subscription, Sequelize } = db;
    // hasn't gone through raven
    if (!req.user) return res.redirect('/login');

    // note on the query below
    // i'm not sure entirely how it works
    // i spent a LONG time experimenting and it's weird
    // especially how for GROUP BY we use the model name of Topic and table name of Answerable...
    // and use of "Subscriptions" when model name is Subscription and table name is subscriptions
    // https://stackoverflow.com/questions/53566038/counting-relationships-in-many-to-many-table-between-joined-tables-in-sequelize
    // https://bezkoder.com/sequelize-associate-many-to-many/

    const topics = await Topic.findAll({
        attributes: {
            include: [[Sequelize.fn("COUNT", Sequelize.col("answerables.id")), "answerableCount"], [Sequelize.fn("COUNT", Sequelize.col("Subscriptions.topicId")), "subCount"]]
        },
        include: [{
            model: Answerable,
            as: "answerables",
            attributes: [],
            through: {
                attributes: [],
            }
        }, {
            model: Subscription,
            attributes: [],
        }],
        group: [['Topic.id', "answerables.id"], ["Topic.id"]],
        raw: true
    });

    // const topic = await Topic.findOne({ where: { name: "2P1_MECHANICS" } });
    // console.log(req.user);

    // const sub = await Subscription.create({
    //     name: "hi",
    //     topicId: topic.id,
    //     repeatDayFrequency: 2,
    //     count: 2,
    //     repeatTime: new Date(),
    //     userId: req.user.id
    // });

    return res.render("topics", { title: "All topics", topics });
});

module.exports = router;