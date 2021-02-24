const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const db = require('./models')
const { TRIPOS_PARTS, SUBJECTS } = require("./enums");
const session = require('express-session');
const flash = require('flash');
const upload = require('./middleware/upload');
const utils = require('./utils');

const PORT = 8080;

const hbs = exphbs.create({
    helpers: {
        "is_admin_page": function (viewName, opts) {
            if (viewName === "admin") {
                return opts.fn(this);
            }
        },
        "display_flashes": function (flashes, options) {
            let ret = "";
            let flash;
            while ((flash = flashes.shift()) != undefined) {
                ret = ret + options.fn(flash);
            }
            return ret;
        },
        "ifeq": function (a, b, opts) {
            if (a === b) return opts.fn(this);
            return opts.inverse(this);
        },
        "unlesseq": function (a, b, opts) {
            if (!a || !(a === b)) return opts.fn(this);
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'app/views')

// ideally only for dev
app.use(express.static("app/public/"));
app.use(session({
    secret: 'some secret',
    saveUninitialized: true,
    resave: true
}));
app.use(flash());

// nb. db oject contains all models, the "sequelize" obj as the db conn, and Sequelize as tools

app.get('/', (req, res) => {
    res.render("home", {
        title: "Home"
    });
})


app.get('/api/parts', (req, res) => {
    res.json(Object.keys(TRIPOS_PARTS));
});

app.get('/admin', async (req, res) => {
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

app.post('/admin/create/question', upload.array('question-upload'), async (req, res) => {

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

        const paper = await Paper.findOne({where: {
            year: parseInt(values["year"]),
            subject: values["subject"],
            triposPart: values["tripos-part"]
        }});

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

async function main() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    // DEV
    //db.sync();
    app.listen(PORT, () => console.log(`We're live on ${PORT}!`));
}

main();