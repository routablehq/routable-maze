const express = require('express');

const refereeApi = express();

refereeApi.use(express.json());

// enable CORS as api is on :8080, client is on :3000
refereeApi.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

refereeApi.post('/register', function (req, res) {
  res.json({"seed": 123456, "playerName": req.body.playerName });
});

module.exports = { refereeApi };
