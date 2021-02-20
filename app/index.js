const { Sequelize } = require('sequelize');

const sequelize = new Sequelize('postgres://postgres:password@db:5432/atriposaday')

const express = require('express');
const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
    res.status(200).send("Hello!");
})

async function main() {
    try {
        await sequelize.authenticate();
        console.log('Connection has been established successfully.');
    } catch (error) {
        console.error('Unable to connect to the database:', error);
    }
    app.listen(PORT, () => console.log(`We're live on ${PORT}!`));
}

main();