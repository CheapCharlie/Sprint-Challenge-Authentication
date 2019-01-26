const axios = require('axios');

const { authenticate } = require('../auth/authenticate');
const knex = require('../database/dbConfig.js');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  knex('users').insert(req.body)
    .then(response => {
      console.log(response);
      res.status(201).json({message: `Registration complete! Welcome ${req.body.username}!`})
    })
    .catch(err => {
      console.log(error);
      res.status(400).json({error: 'unable to create account. please try again.'})
    })
}

function login(req, res) {
  // implement user login
}

function getJokes(req, res) {
  const requestOptions = {
    headers: { accept: 'application/json' },
  };

  axios
    .get('https://icanhazdadjoke.com/search', requestOptions)
    .then(response => {
      res.status(200).json(response.data.results);
    })
    .catch(err => {
      res.status(500).json({ message: 'Error Fetching Jokes', error: err });
    });
}
