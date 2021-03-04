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

router.get('/delete', requireAdmin, async (req, res, next) => {
    const { uuid } = req.query;
    if (!uuid) return next(new Error('No question to delete provided!'));

    const { Answerable, Topic, User, Paper } = db;

    const answerable = await Answerable.findOne({
        where: {
            uuid
        },
        include: ['topics', 'paper', 'userStats']
    });

    if (answerable == null) return next(new Error('Invalid question to delete provided'));

    try {   
        await answerable.removeTopics(answerable.topics);
        await answerable.removeUserStats(answerable.userStats);
        await answerable.destroy();
    }
    catch (err) {
        return next(err);
    }

    req.flash('success', 'Question deleted successfully.');
    return res.redirect('/user/home');
});

module.exports = router;