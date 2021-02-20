const express = require('express');
const app = express();
const {db, syncAll} = require('./database');
const {Answerable} =  require('./models')
const PORT = 8080;

app.get('/', (req, res) => {
    res.status(200).send("Hello!");
})

async function main() {
    try {
        await db.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    // DEV
    db.sync();
    app.listen(PORT, () => console.log(`We're live on ${PORT}!`));
}

main();