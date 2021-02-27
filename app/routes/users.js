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
    // if user doesn't give name, set it to the topic name
    // hasn't gone through raven
    res.send("Hi");

});

module.exports = router;