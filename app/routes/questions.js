const express = require('express');
const { exposeUserInView, requireAuth, requireAdmin } = require('../middleware/custom');
const db = require('../models');

const router = express.Router();

// make user available in view
router.use(exposeUserInView);
// auth all views
router.use(requireAuth);

router.get('/', async (req, res, next) => {
    const { uuid } = req.query;
    if (!uuid) return next(new Error('No question to display selected!'));

    const { Answerable, User } = db;

    const answerable = await Answerable.findOne({
        where: {
            uuid
        },
        include: ['assets', 'paper', {
            model: User,
            as: 'userStats',
            through: {
                as: 'stats',
                attributes: ['hasAnswered']
            },
            where: {
                id: req.user.id
            },
            required: false
        }],
    });

    if (answerable == null || answerable.isHidden) {
        return next();
    }

    // await UserAnswerableStat.findOrCreate({
    //     where: {
    //         userId: req.user.id,
    //         answerableId: answerable.id,
    //     },
    //     defaults: {
    //         hasAnswered: false
    //     }
    // }).catch(next);

    return res.render('question', {
        answerable: answerable.toJSON()
    });
});

router.get('/all', async (req, res, next )=>{
    const { topic: topicUuid } = req.query;
    if (!topicUuid) return next(new Error('No topic to list provided!'));

    const { Topic } = db;

    const topic = await Topic.findOne({
        where: {
            uuid: topicUuid
        },
    });

    const questions = await topic.getAnswerables({include: ['paper', 'assets']});

    res.render('questions_list', {
        title: `All questions in ${topic.prettyName}`,
        questions: questions.map(q => q.toJSON())
    });
});

router.get('/delete', requireAdmin, async (req, res, next) => {
    const { uuid } = req.query;
    if (!uuid) return next(new Error('No question to delete provided!'));

    const { Answerable } = db;

    const answerable = await Answerable.findOne({
        where: {
            uuid
        },
    });

    if (answerable == null) return next(new Error('Invalid question to delete provided'));

    try {
        await answerable.destroy();
    }
    catch (err) {
        return next(err);
    }

    req.flash('success', 'Question deleted successfully.');
    return res.redirect('/user/home');
});

module.exports = router;