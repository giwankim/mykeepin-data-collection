const axios = require('axios');
const express = require('express');
const router = express.Router();
const configs = require('../configs');

router.post('/', (req, res) => {
  const body = req.body;
  axios
    .post(`${configs.api_server}/manufacturers`, body)
    .then((response) => {
      return res.status(201).json(response.data);
    })
    .catch((err) => {
      return res.status(400).send(err);
    });
});

module.exports = router;
