const express = require('express');
const { exposeUserInView } = require('../middleware/custom');
const db = require('../models');
const router = express.Router();

// make user available in view
router.use(exposeUserInView);

router.get('/home', async (req, res)=> {
    const { User } = db;
    if (!(req.user instanceof User)) {
        return res.redirect('/signup');
    }
    const subscriptions = await req.user.getSubscriptions();
    res.render("home", {
        title: "Home"
    });
});

module.exports = router;