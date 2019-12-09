const express = require('express');

const knex = require('../dbConfig');

const router = express.Router();

router.get('/', (req, res) => {
  knex.select('*').from('accounts').then(e => {
    res.status(200).json(e)
  }).catch(error => {
    console.log(error);
    res.status(500).json({ errorMessage: "Error getting the accounts."})
  })
})

module.exports = router;
