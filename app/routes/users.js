const express = require('express');
const { exposeUserInView } = require('../middleware/custom');
const db = require('../models');
const router = express.Router();

// make user available in view
router.use(exposeUserInView);

router.get('/home', async (req, res) => {
    const { User } = db;
    if (!(req.user instanceof User)) {
        return res.redirect('/signup');
    }
    const subscriptions = await req.user.getSubscriptions();
    return res.render("home", {
        title: "Home",
        subscriptions
    });
});

router.get('/subscriptions', async (req, res) => {
    // if user doesn't give name, set it to the topic name
    // hasn't gone through raven
    if (!req.user) return res.redirect('/login');
    res.send("Hi");

});

module.exports = router;