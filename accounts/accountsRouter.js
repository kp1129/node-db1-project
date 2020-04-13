const express = require('express');

// connect to database
const db = require('../data/dbConfig');

const router = express.Router();

// GET
router.get("/", (req, res) => {
    db('accounts')
    .then(response => res.status(200).json(response))
    .catch(error => res.status(500).json({ errorMessage: 'something went wrong'}));
});


// POST
router.post("/", (req, res) => {
    const newAccount = req.body;
    if(!newAccount.name || !newAccount.budget){
        res.status(400).json({ errorMessage: "please include account name and budget"})
    } else {
        db('accounts')
        // request id as a second argument just to get used to it (for other database server types)
        .insert(newAccount, 'id')
        .then(response => {
            // since it's returning a list with the id of the newly created account as first item,
            // let's query the database again and return the new account instead
            db('accounts').where({ id: response[0]})
            // remember this is also returning a list with our actual object as its first item, 
            // so let's use .first
            .first()
            .then(response => res.status(201).json(response))
            .catch(error => res.status(500).json({ errorMessage: 'something went wrong'}));            
        })
        .catch(error => res.status(500).json({ errorMessage: 'something went wrong'}));
    }   
});
// PATCH
router.patch("/:id", (req, res) => {
    const id = req.params.id;
    const changes = req.body;
    db('accounts')
    // remember to filter by id or you'll update the whole database
    .where({ id: id})
    .update(changes)
    // returns the number of rows affected
    .then(response => res.status(200).json({ api: "update successful"}))
    .catch(error => res.status(500).json({ errorMessage: 'something went wrong'}));

});
// DELETE
router.delete("/:id", (req, res) => {
    const id = req.params.id;
    db('accounts')
    // filter!
    .where({ id: id})
    .del()
    .then(response => res.status(200).json({ api: "account deleted"}))
    .catch(error => res.status(500).json({ errorMessage: 'something went wrong'}));
});

module.exports = router;