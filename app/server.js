const express = require('express');
const session = require('express-session');
const flash = require('flash');
const morgan = require('morgan');
const nodemailer = require("nodemailer");

const routes = require('./routes');
const db = require('./models');
const auth = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errors');
const hbs = require('./middleware/handlebars');
const mailConfig = require('./config/mail');
// nb. db oject contains all models, the "sequelize" obj as the db conn, and Sequelize as tools

const PORT = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'development';

let SequelizeStore;
let sessionConfig;
if (env === 'production') {
    SequelizeStore = require("connect-session-sequelize")(session.Store);
    sessionConfig = {
        secret: 'some secret',
        saveUninitialized: true,
        resave: true,
        store: new SequelizeStore({
            db: db.sequelize,
        }),
        proxy: true, // if you do SSL outside of node.
    };
}
else if (env === 'development') {
    sessionConfig = {
        secret: 'some secret',
        saveUninitialized: true,
        resave: true,
}

const app = express();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'app/views');

// init middleware
app.use(express.static("app/public/"));
app.use(session(sessionConfig));
app.use(flash());
app.use(morgan('dev'));
app.use(auth.initialize());
app.use(auth.session());

// init all routes
const { admin, topics, home, users } = routes;
app.use('/topics', topics);
app.use('/admin', admin);
app.use('/user', users);
app.use('/', home);

// 404s
app.use(notFoundHandler);
// error handlers
app.use(errorHandler);

const transporter = nodemailer.createTransport(mailConfig.config);

async function main() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.name);
    }


    if (env === 'production') {
        app.listen(`${__dirname}/${process.env.ATAD_SOCKET}`, () => console.log("ATAD deployment started"));
    } else {
        app.listen(PORT, () => console.log(`We're live on ${PORT}!`));
    }
    // send mail with defined transport object
    // let info = await transporter.sendMail({
    //     from: mailConfig.sender,
    //     to: "bar@example.com",
    //     subject: "Hello ✔", 
    //     text: "Hello world?",
    // }, (err, info) => { if (err) console.error(err.message) });
}

main();