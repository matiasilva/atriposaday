const express = require('express');
const { TRIPOS_PARTS, SUBJECTS } = require("../enums");
const upload = require('../middleware/upload');
const utils = require('../utils');
const db = require('../models');
const { exposeUserInView } = require('../middleware/custom');

const router = express.Router();

// make user available in view
router.use(exposeUserInView);

router.get('/', async (req, res) => {
    const { Answerable, Topic, User, Subscription, Paper } = db;
    const status = {
        "questions": await Answerable.count(),
        "users": await User.count(),
        "topics": await Topic.count(),
        "subscriptions": await Subscription.count(),
        "papers": await Paper.count(),
    };
    res.render("admin", {
        title: "Administrator panel",
        "tripos_parts": Object.entries(TRIPOS_PARTS),
        "subjects": SUBJECTS,
        status
    });
});

router.post('/create/question', upload.array('question-upload'), async (req, res, next) => {

    const { Answerable, Paper, Topic, Asset } = db;
    const formKeys = ["tripos-part", "description", "subject", "year"];
    const values = utils.pick(formKeys, req.body);
    let errors = {};

    if (req.files.length < 1) errors["question-upload"] = true;

    if (!values["subject"]) errors["subject"] = true;

    if (values["tripos-part"] === "") errors["tripos-part"] = true;

    if (values["description"].length >= 120) errors["description"] = true;

    if (!utils.isValidYear(values["year"])) errors["year"] = true;

    const paper = await Paper.findOne({
        where: {
            year: parseInt(values["year"]),
            subject: values["subject"],
            triposPart: values["tripos-part"]
        }
    });

    if (paper == null) {
        req.flash("danger", "Failed to find a valid paper with these parameters");
        res.redirect('/admin');
    }

    const hasNoErrors = Object.keys(errors).length === 0;

    if (hasNoErrors) {
        // add question
        const topic = await Topic.findOne({
            where: {
                isRootLevel: true,
                name: values["subject"]
            }
        });

        for (let i = 0; i < req.files.length; i++) {
            const file = req.files[i];
            const fileName = file.originalname.split('.')[0];
            let args = fileName.split('_');
            args = args.map(parseInt);

            const [question, created] = await Answerable.findOrCreate({
                where: {
                    paperId: paper.id,
                    number: args[0]
                }, defaults: {
                    description: values["description"],
                }
            }).catch(next);

            if (args.length === 1) {
                // just the question, no further assets
                await Asset.create({
                    path: file.path,
                    answerableId: question.id,
                    isMainAsset: true
                });
            } else if (args.length === 2 && !isNaN(args[1])) {
                // a question's supporting material: graphs, etc
                await Asset.create({
                    path: file.path,
                    answerableId: question.id,
                    isMainAsset: false
                });
            } else {
                return next(new Error("Invalid input image name"));
            }

            const hasQuestion = topic.hasAnswerable(question);
            if(!hasQuestion) await topic.addAnswerable(question);

        }

        req.flash("success", "All questions created successfully!");

        res.redirect('/admin');
    }
    else {
        // include sent back responses that failed
        req.flash("danger", "There were problems with the information you submitted.");

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