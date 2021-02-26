const express = require('express');
const db = require('./models');

const router = express.Router();

router.get('/', (req, res) => {
    res.render("home", {
        title: "Home"
    });
})

router.get('/random', async (req, res) => {
    const { part, subject } = req.query;
    const { Answerable, Paper } = db;
    let result;

    if (!part && !subject) {
        result = await Answerable.findOne(
            { order: db.sequelize.random(), include: 'paper' }
        )
        result = result.toJSON();
    } else {
        const whereObj = { ...part && { triposPart: part }, ...subject && { subject } };
        const matchingPapers = await Paper.findAll({
            where: whereObj
        })
        let questions = [];
        for (const paper of matchingPapers) {
            questions.concat(await Answerable.findAll({
                where: {
                    paperId: paper.id
                }
            }));
        }
        if (questions.length > 0) {
            result = questions[Math.floor(Math.random() * questions.length)].toJSON()
        }
        else {
            result = "No matching questions found."
        }
    }
    res.json(result);
    // res.render("random", {
    //     "tripos_parts": Object.entries(TRIPOS_PARTS),
    //     "subjects": SUBJECTS,
    // });
});

module.exports = router;