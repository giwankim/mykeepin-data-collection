const path = require('path');
const express = require('express');
const sessions = require('client-sessions');
// const mongoose = require('mongoose');
// const config = require('./configs');
const indexRoutes = require('./routes/index');
const mykeepinRoutes = require('./routes/mykeepin');
const auth = require('./middleware/auth.middleware');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));

// routes
app.use('/', indexRoutes);
app.use('/mykeepin', mykeepinRoutes);

// error handling
app.use((req, res, next) => {
  return res.sendFile(path.join(__dirname, 'public', 'notfound.html'));
});
app.use((err, req, res, next) => {
  return res.sendFile(path.join(__dirname, 'public', 'notfound.html'));
});

app.listen(3000);
