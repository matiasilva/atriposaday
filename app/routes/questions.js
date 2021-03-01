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

    const { Answerable } = db;

    const answerable = await Answerable.findOne({
        where: {
            uuid
        }
    });

    return res.render('question', {
        answerable
    });
});

module.exports = router;