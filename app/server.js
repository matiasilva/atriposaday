const express = require('express');
const session = require('express-session');
const flash = require('flash');
const morgan = require('morgan');
const favicon = require('serve-favicon');
const path = require('path');

const routes = require('./routes');
const db = require('./models');
const auth = require('./middleware/auth');
const { errorHandler, notFoundHandler } = require('./middleware/errors');
const hbs = require('./middleware/handlebars');
// nb. db oject contains all models, the "sequelize" obj as the db conn, and Sequelize as tools

const PORT = process.env.PORT || 8080;
const env = process.env.NODE_ENV || 'development';

let sessionConfig;
let sessionStore;
if (env === 'production') {
    const SequelizeStore = require('connect-session-sequelize')(session.Store);
    sessionStore = new SequelizeStore({
        db: db.sequelize,
    });
    sessionConfig = {
        secret: 'some secret',
        saveUninitialized: true,
        resave: true,
        store: sessionStore,
        proxy: true, // if you do SSL outside of node.
    };
}
else if (env === 'development') {
    sessionConfig = {
        secret: 'some secret',
        saveUninitialized: true,
        resave: true,
    };
}

const app = express();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'app/views');

// init middleware
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/static/uploads', express.static(path.join(__dirname, '/../static/uploads')));

app.use(session(sessionConfig));
app.use(flash());
app.use(morgan('dev'));
app.use(auth.initialize());
app.use(auth.session());

// init all routes
const { admin, topics, home, users, questions } = routes;
app.use('/topics', topics);
app.use('/admin', admin);
app.use('/user', users);
app.use('/question', questions);
app.use('/', home);

// 404s
app.use(notFoundHandler);
// error handlers
app.use(errorHandler);

async function main() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.name);
        process.exit(1);
    }

    if (env === 'production') {
        await sessionStore.sync();
        app.listen(`./${process.env.ATAD_SOCKET}`, () => console.log('ATAD deployment started'));
    } else {
        app.listen(PORT, () => console.log(`We're live on ${PORT}!`));
    }
}

main();