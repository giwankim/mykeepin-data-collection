const path = require('path');
const express = require('express');
const mykeepinRoutes = require('./routes/mykeepin.routes');

const app = express();

// middleware
app.use(express.static('public'));

// routes
app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'login.html'));
});
app.use('/mykeepin', mykeepinRoutes);

// error handling
app.use((req, res, next) => {
  return res.status(404).send({ message: `Route ${req.url} Not Found` });
});
app.use((err, req, res, next) => {
  console.log(err);
  return res.status(500).send({ error: err });
});

app.listen(3000);
