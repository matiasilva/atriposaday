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

    return res.render('signup', {
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

        return res.render('signup', {
            title: 'Confirm your details',
            errors
        });
    }
});

router.get('/heartbeat', (req, res) => {
    return res.send('I\'m alive!');
});

router.get('/random', async (req, res, next) => {
    const { Answerable, sequelize } = db;

    const answerable = await Answerable.findOne({
        order: sequelize.random(),
        attributes: ['uuid'],
        raw: true
    });

    if (answerable == null) {
        return next(new Error('No question was found (usually because the DB is empty)'));
    }

    return res.redirect(`/question?uuid=${answerable.uuid}`);
});

router.get('/mail', async (req, res) => {
    const { Subscription, Sequelize: { Op }, sequelize, Topic, User, Paper, UserAnswerableStat } = db;

    // get all subs that need to be actioned
    const now = new Date();
    const toAction = await Subscription.findAll({
        benchmark: true,
        where: {
            nextActioned: {
                [Op.lt]: now
            }
        },
        attributes: ['count', 'repeatTime', 'repeatDayFrequency', 'id', 'name'],
        include: [{
            model: User,
            as: 'user',
            attributes: ['id', 'email']
        }, {
            model: Topic,
            as: 'topic',
            attributes: ['id']
        }]
    });

    if (toAction.length > 0) {
        const { nodemailer, config, template } = mail;
        const transporter = nodemailer.createTransport(config);

        for (const sub of toAction) {
            let questions = await sub.topic.getAnswerables({
                benchmark: true,
                order: sequelize.random(),
                attributes: ['uuid'],
                limit: sub.count,
                joinTableAttributes: [],
                include: [{
                    model: Paper,
                    as: 'paper',
                    attributes: ['triposPart', 'year', 'type', 'subject']
                },
                {
                    model: UserAnswerableStat,
                    as: 'stats',
                    attributes: ['hasAnswered'],
                    required: false
                }]
            });

            // all questions in the topic
            // if hasAnswered exists, then ensure it is false
            // if it doesn't exist then just include the question
            questions = questions.filter(q => !q.stats || !q.stats[0].hasAnswered);

            // update the sub's nextActioned
            // even if the email fails to send
            const nextTime = sub.getNextTime();
            sub.nextActioned = nextTime;
            await sub.save();

            const locals = {
                FQDN: process.env.ATAD_FQDN,
                questions: questions.map(q => q.toJSON()),
                sub: sub.toJSON(),
                nextTime
            };

            const text = template(locals);

            const { err, info } = await transporter.sendMail({
                from: '"A Tripos a Day" <atriposaday@srcf.net>',
                to: sub.user.email,
                subject: `[A Tripos a Day] ${sub.name} question`,
                text,
            });

            if (err) console.error(err);
        }

        transporter.close();

        return res.send(`Successfully emailed ${toAction.length} people their Tripos questions!`);
    } else {
        return res.send(`No subscriptions to action found!`);
    }
});

module.exports = router;