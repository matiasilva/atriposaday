const express = require('express');
const db = require('../models');
const auth = require('../middleware/auth');
const fetch = require('node-fetch');
const upload = require('../middleware/upload');
const utils = require('../utils');

const router = express.Router();

router.get('/', (req, res) => {
    res.render("home", {
        title: "Home"
    });
})

router.get('/login',
    auth.authenticate('raven', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    })
);

router.get('/home', (req, res) => {
    const { User } = db;
    if (!(req.user instanceof User)) {
        res.redirect('/signup');
    }
    res.send(`Success`)
})

router.get('/signup', async (req, res) => {
    if (!req.user) res.redirect('/login');

    const url = `https://www.lookup.cam.ac.uk/api/v1/person/crsid/${req.user}`;
    const options = {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json;charset=UTF-8'
        },
    };

    const response = await fetch(url, options);
    const { result } = await response.json();

    res.render("signup", {
        title: "Confirm your details",
        name: result.person.visibleName,
        email: `${req.user}@cam.ac.uk`
    });
})

router.post('/signup', upload.none(), async (req, res) => {
    const formKeys = ["tripos-part", "description", "subject", "year"];
    const values = utils.pick(formKeys, req.body);
    let errors = {};
    const { User } = db;
    await User.create({
        {}
    })
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