const express = require('express');
const session = require('express-session');
const flash = require('flash');
const morgan = require('morgan');

const routes = require('./routes');
const db = require('./models');
const auth = require('./middleware/auth');
const {errorHandler, notFoundHandler} = require('./middleware/errors');
const hbs = require('./middleware/handlebars');
// nb. db oject contains all models, the "sequelize" obj as the db conn, and Sequelize as tools

const PORT = process.env.PORT || 8080;

const app = express();

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');
app.set('views', 'app/views');

// init middleware
app.use(express.static("app/public/"));
app.use(session({
    secret: 'some secret',
    saveUninitialized: true,
    resave: true
}));
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

async function main() {
    try {
        await db.sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error.name);
    }
    app.listen(PORT, () => console.log(`We're live on ${PORT}!`));
}

main();