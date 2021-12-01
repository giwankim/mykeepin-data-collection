const path = require('path');
const express = require('express');
const indexRoutes = require('./routes/index');
const mykeepinRoutes = require('./routes/mykeepin');
const restaurants = require('./routes/restaurants');
const manufacturers = require('./routes/manufacturers');

const app = express();

app.use(express.static('public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// routes
app.use('/', indexRoutes);
app.use('/mykeepin', mykeepinRoutes);
app.use('/restaurants', restaurants);
app.use('/manufacturers', manufacturers);

// error handling
app.use((req, res, next) => {
  return res.sendFile(path.join(__dirname, 'public', 'notfound.html'));
});
app.use((err, req, res, next) => {
  return res.sendFile(path.join(__dirname, 'public', 'notfound.html'));
});

app.listen(3000);
