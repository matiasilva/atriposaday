const express = require('express');
const { exposeUserInView, requireAuth } = require('../middleware/custom');
const db = require('../models');
const router = express.Router();

// make user available in view
router.use(exposeUserInView);
router.use(requireAuth);

router.get('/home', async (req, res) => {
    // because of requireAuth, we will always have a valid user if we get here
    const subscriptions = await req.user.getSubscriptions();
    return res.render("home", {
        title: "Home",
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
    return res.render("subscriptions", {
        title: "Manage subscriptions",
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
    await sub.destroy();
    req.flash("success", "Subscription deleted successfully!")
    return res.redirect('/user/subscriptions');
});

module.exports = router;