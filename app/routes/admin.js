const express = require('express')
const { TRIPOS_PARTS, SUBJECTS } = require("./enums");
const upload = require('./middleware/upload');
const utils = require('./utils');
const db = require('./models')

const router = express.Router()

router.get('/', async (req, res) => {
    const { Answerable, Topic, User, Subscription, Paper } = db;
    const status = {
        "questions": await Answerable.count(),
        "users": await User.count(),
        "topics": await Topic.count(),
        "subscriptions": await Subscription.count(),
        "papers": await Paper.count(),
    }
    res.render("admin", {
        title: "Administrator panel",
        "tripos_parts": Object.entries(TRIPOS_PARTS),
        "subjects": SUBJECTS,
        status
    });
})

router.post('/create/question', upload.array('question-upload'), async (req, res) => {

    const formKeys = ["tripos-part", "description", "subject", "year"];
    const values = utils.pick(formKeys, req.body);
    let errors = {};

    if (req.files.length < 1) errors["question-upload"] = true;

    if (!values["subject"]) errors["subject"] = true;

    if (values["tripos-part"] === "") errors["tripos-part"] = true;

    if (values["description"].length >= 120) errors["description"] = true;

    if (isNaN(Date.parse(values["year"]))) errors["year"] = true;

    const hasNoErrors = Object.keys(errors).length === 0;
    if (hasNoErrors) {
        // add question
        const { Answerable, Paper } = db;

        const paper = await Paper.findOne({
            where: {
                year: parseInt(values["year"]),
                subject: values["subject"],
                triposPart: values["tripos-part"]
            }
        });

        for (const file of req.files) {
            await Answerable.create(
                {
                    description: values["description"],
                    image: file.path,
                    paperId: paper.id,
                }
            )
        }

        req.flash("success", "All questions created successfully!");

        res.redirect('/admin');
    }
    else {
        // include sent back responses that failed
        req.flash("danger", "There are problems with the information you submitted.")

        res.render("admin", {
            title: "Administrator panel",
            "subjects": SUBJECTS,
            "tripos_parts": Object.entries(TRIPOS_PARTS),
            "form_vals": values,
            errors
        });

    }
});

module.exports = router;