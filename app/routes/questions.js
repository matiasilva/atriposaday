const express = require('express');
const { exposeUserInView, requireAuth } = require('../middleware/custom');
const db = require('../models');

const router = express.Router();

// make user available in view
router.use(exposeUserInView);
// auth all views
router.use(requireAuth);

router.get('/', async (req, res, next) => {
    const { uuid } = req.query;
    if (!uuid) return next(new Error('No question to display selected!'));

    const { Answerable, User, UserAnswerableStat } = db;

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
            }
        }],
    });

    await UserAnswerableStat.create({
        userId: req.user.id,
        answerableId: answerable.id,
        hasAnswered: false
    });

    return res.render('question', {
        answerable: answerable.toJSON()
    });
});

module.exports = router;