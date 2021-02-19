// const { Sequelize } = require('sequelize');

// const sequelize = new Sequelize('postgres://user:pass@example.com:5432/dbname')

const express = require('express');
const app = express();
const PORT = 8080;

app.get('/', (req, res) => {
    res.status(200).send("Hello!");
})

app.listen(PORT, ()=>console.log(`We're live on ${PORT}!`));