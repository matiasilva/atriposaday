const express = require('express');
const { exposeUserInView, requireAuth } = require('../middleware/custom');
const utils = require('../utils');
const db = require('../models');
const upload = require('../middleware/upload');

const router = express.Router();

// make user available in view
router.use(exposeUserInView);
// require Raven on all routes
router.use(requireAuth);

router.get('/subscribe', async (req, res) => {
    const { topic: topicUuid } = req.query;

    // get request to this route without param
    if (!topicUuid) {
        req.flash('danger', 'Invalid unique identifier for topic.');
        return res.redirect('/topics');
    }

    const { Topic } = db;
    const topic = await Topic.findOne({
        where:
            { uuid: topicUuid },
        raw: true
    });

    return res.render('subscribe', {
        title: 'Confirm subscription',
        topic,
        'allowed_times': utils.allowedTimes
    });
});

router.post('/subscribe', upload.none(), async (req, res, next) => {
    const { Topic, Subscription } = db;

    const formKeys = ['subUuid', 'subName', 'subRepeatEvery', 'subRepeatTime', 'subCount'];
    const values = utils.pick(formKeys, req.body);
    let errors = {};

    // in case uuid is invalid or user tampers
    const topic = await Topic.findOne({
        where:
            { uuid: values['subUuid'] }
    }).catch(next);

    const test = await Subscription.findOne({
        where: {
            topicId: topic.id,
            userId: req.user.id
        }
    });

    if(test != null){
        req.flash('warning', 'You are already subscribed to this topic!');
        return res.redirect('/topics');
    }

    const subRepeatEvery = parseInt(values['subRepeatEvery']);
    const subCount = parseInt(values['subCount']);

    if (values['subName'].length > 120) errors['subName'] = true;
    if (isNaN(subCount)) errors['subCount'] = true;
    if (isNaN(subRepeatEvery)) errors['subRepeatEvery'] = true;
    if (subRepeatEvery > 15) errors['subRepeatEvery'] = true;
    if (subRepeatEvery <= 0) errors['subRepeatEvery'] = true;

    const hourMinute = values['subRepeatTime'].split(':');
    const repeatTime = new Date(2001, 8, 1, hourMinute[0], hourMinute[1]);

    if (topic == null) {
        return next(new Error('Invalid topic UUID'));
    }

    if (values['subName'] === '') values['subName'] = topic.prettyName;

    const hasNoErrors = Object.keys(errors).length === 0;

    if (hasNoErrors) {
        const sub = await Subscription.create({
            name: values['subName'],
            topicId: topic.id,
            repeatDayFrequency: subRepeatEvery,
            count: subCount,
            repeatTime,
            userId: req.user.id,
            nextActioned: utils.getNextTime(subRepeatEvery, repeatTime)
        });
        req.flash('success', `You have successfully subscribed to ${sub.name}`);
        return res.redirect('/user/home');
    }
    else {
        req.flash('danger', 'There were problems with the information you submitted');
        return res.render('subscribe', {
            title: 'Confirm subscription', errors
        });
    }
});

router.get('/', async (req, res) => {
    const { Topic, Answerable, Subscription, Sequelize } = db;
    // note on the query below
    // i'm not sure entirely how it works
    // i spent a LONG time experimenting and it's weird
    // especially how for GROUP BY we use the model name of Topic and table name of Answerable..., possily aliases?? ->YEs
    // and use of "Subscriptions" when model name is Subscription and table name is subscriptions
    // https://stackoverflow.com/questions/53566038/counting-relationships-in-many-to-many-table-between-joined-tables-in-sequelize
    // https://bezkoder.com/sequelize-associate-many-to-many/

    const topics = await Topic.findAll({
        attributes: {
            include: [[Sequelize.fn('COUNT', Sequelize.col('answerables.id')), 'answerableCount'], [Sequelize.fn('COUNT', Sequelize.col('subscriptions.topicId')), 'subCount']]
        },
        include: [{
            model: Answerable,
            as: 'answerables',
            attributes: [],
            through: {
                attributes: [],
            }
        }, {
            model: Subscription,
            as: 'subscriptions',
            attributes: [],
        }],
        group: [['Topic.id', 'answerables.id'], ['Topic.id']],
        raw: true
    });

    return res.render('topics', { title: 'All topics', topics });
});

module.exports = router;