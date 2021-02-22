const express = require('express');
const app = express();
const exphbs = require('express-handlebars');
const db = require('./models')
const PORT = 8080;

const hbs = exphbs.create({
    helpers: {
        "is_admin_page": function (viewName, opts) {
            if (viewName === "admin") {
                return opts.fn(this);
            }
        }
    }
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'app/views')

// ideally only for dev
app.use(express.static("app/public/"));

// nb. db oject contains all models, the "sequelize" obj as the db conn, and Sequelize as tools

app.get('/', (req, res) => {
    res.render("home", {
        title: "Home"
    });
})

app.get('/admin', (req, res) => {
    const { Topic } = db;
    let rootTopics = Topic.findAll({
        where: {
            subLevel: 0
        }
    });
    res.render("admin", {
        title: "Administrator panel",
        "root_topics": rootTopics
    });
})

app.post('/admin/create/question', (req, res) => {

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