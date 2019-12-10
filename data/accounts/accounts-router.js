const express = require('express');

const knex = require('../dbConfig');

const router = express.Router();

// get all accounts
router.get('/', (req, res) => {
  knex
  .select('*')
  .from('accounts')
  .then(e => {
    res.status(200).json(e)
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ errorMessage: "Error getting the accounts." })
  })
})

// get account by id
router.get('/:id', (req, res) => {
  knex.select('*')
  .from('accounts')
  .where({ id: req.params.id })
  .then(posts => {
    res.status(200).json(posts);
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ errorMessage: "Erro getting the account" })
  })
})

// add account
router.post('/', (req, res) => {
  const accountData = req.body;
  if (accountData.name && accountData.budget) {
    knex('accounts')
    .insert(accountData, 'id')
    .then(ids => {
      const id = ids[0]
      return knex('accounts')
      .where({ id })
      .first()
      .then(account => {
        res.status(201).json(account)
      })
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({ errorMessage: 'Error adding account' })
    })
  } else {
    res.status(400).json({ errorMessage: 'account could not be added please use name and budget' })
  }
})

// update accounts
router.put('/:id', (req, res) => {
  const { id } = req.params;
  const accountData = req.body;

  knex('accounts')
  .where({ id })
  .update(accountData)
  .then(count => {
    if (count > 0) {
      return knex('accounts')
      .where({ id })
      .first()
      .then(account => {
        res.status(200).json(account)
      })
    } else {
      res.status(404).json({ message: 'Account not found' })
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ errorMessage: 'Error updating the account' })
  })
})

// delete accounts
router.delete('/:id', (req, res) => {
  const { id } = req.params;
  knex('accounts')
  .where({ id })
  .del()
  .then(count => {
    return knex.select('*').from('accounts').then(e => {
      res.status(200).json(e)
    })
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ errorMessage: 'Error deleting the account' })
  })
})

module.exports = router;
