const express = require('express');
const db = require('../models');
const auth = require('../middleware/auth');
const fetch = require('node-fetch');
const upload = require('../middleware/upload');
const utils = require('../utils');
const { exposeUserInView } = require('../middleware/custom');

const router = express.Router();

// make user available in view
router.use(exposeUserInView);


router.get('/', async (req, res) => {
    const { User } = db;

    return res.render("index", {
        userCount: await User.count()
    });
});

router.get('/login',
    auth.authenticate('raven', {
        successRedirect: '/user/home',
        failureRedirect: '/',
        failureFlash: true
    })
);

router.get('/home', async (req, res) => {
    return res.redirect('/user/home');
});

router.get('/signup', async (req, res) => {
    const { User } = db;

    // hasn't gone through raven
    if (!req.user) return res.redirect('/login');
    // is already a valid user
    if (req.user instanceof User) return res.redirect('/home');

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
});

router.post('/signup', upload.none(), async (req, res) => {
    const formKeys = ["userName", "userEmail"];
    const values = utils.pick(formKeys, req.body);
    let errors = {};

    if (!utils.matchEmail(values["userEmail"])) errors["userEmail"] = true;
    if (values["userName"] > 120) errors["userName"] = true;

    const hasNoErrors = Object.keys(errors).length === 0;

    if (hasNoErrors) {
        const { User } = db;
        await User.create({
            name: values["userName"],
            crsid: req.user,
            email: values["userEmail"]
        });
        req.flash("success", "You were successfully registered as a new user.");
        res.redirect('/home');
    } else {
        req.flash("danger", "There are problems with the information you submitted.");

        res.render("signup", {
            title: "Confirm your details",
            errors
        });
    }
});

router.get('/random', async (req, res) => {
    const { part, subject } = req.query;
    const { Answerable, Paper } = db;
    let result;

    if (!part && !subject) {
        result = await Answerable.findOne(
            { order: db.sequelize.random(), include: 'paper' }
        );
        result = result.toJSON();
    } else {
        const whereObj = { ...part && { triposPart: part }, ...subject && { subject } };
        const matchingPapers = await Paper.findAll({
            where: whereObj
        });
        let questions = [];
        for (const paper of matchingPapers) {
            questions.concat(await Answerable.findAll({
                where: {
                    paperId: paper.id
                }
            }));
        }
        if (questions.length > 0) {
            result = questions[Math.floor(Math.random() * questions.length)].toJSON();
        }
        else {
            result = "No matching questions found.";
        }
    }
    res.json(result);
    // res.render("random", {
    //     "tripos_parts": Object.entries(TRIPOS_PARTS),
    //     "subjects": SUBJECTS,
    // });
});

module.exports = router;