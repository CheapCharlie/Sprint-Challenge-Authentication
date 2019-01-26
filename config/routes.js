const axios = require('axios');
const bcryptjs = require('bcryptjs');

const { authenticate } = require('../auth/authenticate');
const { generateToken } = require('../auth/authenticate');
const knex = require('../database/dbConfig.js');

module.exports = server => {
  server.post('/api/register', register);
  server.post('/api/login', login);
  server.get('/api/jokes', authenticate, getJokes);
};

function register(req, res) {
  // implement user registration
  req.body.password = bcryptjs.hashSync(req.body.password, 16);
  knex('users').insert(req.body)
    .then(response => {
      const yourJwtToken = generateToken(req.body);
      res.status(201).json({message: `Registration complete! Welcome ${req.body.username}! Your JWT is ${yourJwtToken}. ALWAYS REMEMBER TO PLUG IN YOUR JWT IN THE HEADER!`})
      console.log('success!', response);
    })
    .catch(err => {
      res.status(400).json({error: 'unable to create account. please try again.'})
      console.log(err);
    })
}

function login(req, res) {
  // implement user login
  knex('users').where('username', req.body.username)
    .then(response => {
      if((req.body.username === response[0].username) && bcryptjs.compareSync(req.body.password, response[0].password)) {
        const yourJwtToken = generateToken(req.body);
        res.status(200).json({message: `Login Successful! Welcome ${req.body.username}! Your JWT is ${yourJwtToken}. ALWAYS REMEMBER TO PLUG IN YOUR JWT IN THE HEADER! `})
        console.log('success', response);
      } else {
        res.status(404).json({error: `invalid username OR password. please try again.`})
      }
    })
    .catch(err => {
      res.status(500).json({error: 'Sorry but we were unable to process your login. Please try again.'});
      console.log(err);
    })
};

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
