const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const db = require('./models')
const { TRIPOS_PARTS } = require("./enums");
const session = require('express-session');
const flash = require('connect-flash');
const upload = require('./middleware/upload');

const PORT = 8080;

const hbs = exphbs.create({
    helpers: {
        "is_admin_page": function (viewName, opts) {
            if (viewName === "admin") {
                return opts.fn(this);
            }
        },
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'app/views')

// ideally only for dev
app.use(express.static("app/public/"));
app.use(session({
	secret:'some secret',
	saveUninitialized: true,
	resave: true
}));app.use(flash());
    
// nb. db oject contains all models, the "sequelize" obj as the db conn, and Sequelize as tools

app.get('/', (req, res) => {
    res.render("home", {
        title: "Home"
    });
})

app.get('/admin', async (req, res) => {
    const { Topic } = db;
    let rootTopics = await Topic.findAll({
        where: {
            isRootLevel: true
        },
        raw: true
    });
    res.render("admin", {
        title: "Administrator panel",
        "root_topics": rootTopics,
        "tripos_parts": Object.entries(TRIPOS_PARTS)
    });
})

app.post('/admin/create/question', upload.array('question-upload'), async (req, res) => {
    let errors = {};

    if (!req.files && req.files.length < 1) errors["question-upload"] = "You must upload at least one file."

    if (req.body["tripos-part"] === "") errors["tripos-part"] = "You must specify a part of the Tripos to which your upload belongs."

    if (req.body["description"].length >= 120) errors["description"] = "Your description is greater than 120 characters."

    if (!errors) {
        
    }
    else {
        const { Topic } = db;
        let rootTopics = await Topic.findAll({
            where: {
                isRootLevel: true
            },
            raw: true
        });
        // include sent back responses that failed
        res.render("admin", {
            title: "Administrator panel",
            "root_topics": rootTopics,
            "tripos_parts": Object.entries(TRIPOS_PARTS)
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