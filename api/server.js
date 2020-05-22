const express = require("express");

const AccountsRouter = require('../accounts/accountsRouter');

const server = express();

server.use(express.json());
server.use('/accounts', AccountsRouter);

server.get("/", (req, res) => {
    res.status(200).json({ api: 'good to go!'})
});

module.exports = server;
