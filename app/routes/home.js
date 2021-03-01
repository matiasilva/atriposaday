const express = require('express');
const db = require('../models');
const auth = require('../middleware/auth');
const fetch = require('node-fetch');
const upload = require('../middleware/upload');
const utils = require('../utils');
const { exposeUserInView } = require('../middleware/custom');
const mail = require('../middleware/mail');

const router = express.Router();

// make user available in view
router.use(exposeUserInView);


router.get('/', async (req, res) => {
    const { User } = db;

    return res.render('index', {
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
    // hasn't gone through raven at all
    if (!req.user) return res.redirect('/login');

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

    res.render('signup', {
        title: 'Confirm your details',
        name: result.person.visibleName,
        email: `${req.user}@cam.ac.uk`
    });
});

router.post('/signup', upload.none(), async (req, res) => {
    const formKeys = ['userName', 'userEmail'];
    const values = utils.pick(formKeys, req.body);
    let errors = {};

    if (!utils.matchEmail(values['userEmail'])) errors['userEmail'] = true;
    if (values['userName'] > 120) errors['userName'] = true;

    const hasNoErrors = Object.keys(errors).length === 0;

    if (hasNoErrors) {
        const { User } = db;
        await User.create({
            name: values['userName'],
            crsid: req.user,
            email: values['userEmail']
        });
        req.flash('success', 'You were successfully registered as a new user.');
        res.redirect('/user/home');
    } else {
        req.flash('danger', 'There were problems with the information you submitted.');

        res.render('signup', {
            title: 'Confirm your details',
            errors
        });
    }
});

router.get('/heartbeat', (req, res) => {
    return res.send('I\'m alive!');
});

router.get('/mail', async (req, res) => {
    const { Subscription, Sequelize: { Op } } = db;

    // get all subs that need to be actioned
    const now = new Date();
    const toAction = await Subscription.findAll({
        where: {
            nextActioned: {
                [Op.lt]: now
            }
        },
        include: 'user'
    });

    const { nodemailer, config } = mail;
    const transporter = nodemailer.createTransport(config);

    for (const sub of toAction) {

        await sub.sendMail();
        sub.nextActioned = utils.getNextTime(sub.subRepeatEvery, sub.repeatTime);
        await sub.save();
    }

    console.info(`Successfully emailed ${toAction.length} people their Tripos questions!`);
    return res.send('Done!');
});

module.exports = router;