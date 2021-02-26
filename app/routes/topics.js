const express = require('express');
const { exposeUserInView } = require('../middleware/custom');
const router = express.Router();

// make user available in view
router.use(exposeUserInView);

module.exports = router;