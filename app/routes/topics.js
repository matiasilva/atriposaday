const express = require('express');
const { exposeUserInView } = require('../middleware/custom');
const router = express.Router();
const db = require('../models');

// make user available in view
router.use(exposeUserInView);

router.get('/', async (req, res) => {
    const { Topic, Answerable, Sequelize } = db;

    // note on the query below
    // i'm not sure entirely how it works
    // i spent a LONG time experimenting and it's weird
    // especially how for group we use the model name of Topic and table name of Answerable...

    const topics = await Topic.findAll({
        attributes: {
            include: [[Sequelize.fn("COUNT", Sequelize.col("answerables.id")), "answerableCount"]]
        },
        include: [{
            model: Answerable,
            as: "answerables",
            attributes: [],
            through: {
                attributes: [],
            }
        }],
        group: ['Topic.id', "answerables.id"]
        
    });

    return res.render("topics", { title: "All topics", topics });
});

module.exports = router;