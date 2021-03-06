const express = require('express');
const { exposeUserInView, requireAuth } = require('../middleware/custom');
const upload = require('../middleware/upload');
const db = require('../models');
const utils = require('../utils');
const { SUBJECTS, TRIPOS_PARTS } = require('../enums');
const router = express.Router();

// make user available in view
router.use(exposeUserInView);
router.use(requireAuth);

router.get('/profile', (req, res) => {
    // note we already expose the user in all values, no need to pass it here
    return res.render('profile', {
        title: 'Manage profile',
    });
});

router.post('/profile', upload.none(), async (req, res) => {
    const formKeys = ['userName', 'userEmail'];
    const values = utils.pick(formKeys, req.body);
    let errors = {};

    // TODO: wrap these validators elsewhere, since they're duplicated
    if (!utils.matchEmail(values['userEmail'])) errors['userEmail'] = true;
    if (values['userName'] > 120) errors['userName'] = true;

    const hasNoErrors = Object.keys(errors).length === 0;
    const { user } = req;
    if (hasNoErrors) {
        user.name = values['userName'];
        user.email = values['userEmail'];
        await user.save();
        req.flash('success', 'Your profile was successfully updated');
        return res.redirect('/user/profile');
    }
    else {
        req.flash('danger', 'There were errors with the information you provided.');
        return res.render('profile', {
            title: 'Manage profile',
            errors
        });
    }
});

router.get('/home', async (req, res) => {
    // because of requireAuth, we will always have a valid user if we get here

    const subscriptions = await req.user.getSubscriptions();
    return res.render('home', {
        title: 'Home',
        subscriptions
    });
});

router.get('/subscriptions', async (req, res) => {
    const { Topic } = db;
    const subscriptions = await req.user.getSubscriptions({
        include: [{
            model: Topic,
            as: 'topic',
            attributes: ['prettyName']
        }], raw: true,
    });
    return res.render('subscriptions', {
        title: 'Manage subscriptions',
        subscriptions
    });
});

router.get('/subscriptions/delete', async (req, res, next) => {
    const { Subscription } = db;
    const sub = await Subscription.findOne({
        where: {
            uuid: req.query.uuid,
            userId: req.user.id
        }
    }).catch(next);

    if (sub == null) {
        return next(new Error('Invalid subscription UUID'));
    }

    await sub.destroy();
    req.flash('success', 'Subscription deleted successfully!');
    return res.redirect('/user/subscriptions');
});

router.get('/answered', async (req, res, next) => {

    const { Answerable, UserAnswerableStat, Paper } = db;

    const { count, rows } = await Answerable.findAndCountAll({
        include: [
            {
                model: UserAnswerableStat,
                where: {
                    userId: req.user.id,
                    hasAnswered: true
                },
                as: 'stats',
                attributes: ['dateAnswered']
            }, {
                model: Paper,
                as: 'paper',
                attributes: ['year', 'triposPart', 'subject']
            }
        ]
        //order: [[Sequelize.col('answerableStats.dateAnswered'), 'DESC']],
    }).catch(next);

    let papers = {};
    
    for (const part of Object.keys(TRIPOS_PARTS)) {
        let preprocessed = await Paper.findAll({
            attributes: ['year', 'subject'],
            where: {
                triposPart: part
            },
            include: [{
                model: Answerable,
                as: 'answerables',
                attributes: ['uuid']
            }]
        });
        preprocessed = preprocessed.map(p => p.toJSON());

        // need to define sub dictionaries
        if(!papers[part]) papers[part] =  {};
        // if no subjects have been added for a tripos part, IIA, IIB
        if(!SUBJECTS[part]) continue;

        const subjects = Object.keys(SUBJECTS[part]);
        for(const subject of subjects){
            papers[part][subject] = preprocessed.filter(p => p.subject === subject);
        }
    }

    res.render('answered', {
        title: 'Your answered questions',
        count,
        'subjects': SUBJECTS,
        'tripos_parts': Object.keys(TRIPOS_PARTS),
        'papers': papers,
        questions: rows.map(q => q.toJSON())
    });
});

router.get('/bookmarked', async (req, res, next) => {

    const { Answerable, UserAnswerableStat, Paper } = db;


    const { count, rows } = await Answerable.findAndCountAll({
        include: [
            {
                model: UserAnswerableStat,
                where: {
                    userId: req.user.id,
                    hasBookmarked: true
                },
                as: 'stats',
                attributes: ['dateBookmarked']
            }, {
                model: Paper,
                as: 'paper',
                attributes: ['year', 'triposPart', 'subject']
            }
        ]
        //order: [[Sequelize.col('answerableStats.dateAnswered'), 'DESC']],
    }).catch(next);

    res.render('bookmarked', {
        title: 'Your bookmarks',
        count,
        questions: rows.map(q => q.toJSON())
    });
});


module.exports = router;