const path = require('path');
const express = require('express');

const app = express();

app.use(express.static('public'));

app.get('/', (req, res) => {
  return res.sendFile(path.join(__dirname, 'public', '01.main.html'));
});

app.listen(3000, () => {
  console.log('Server listening at port 3000');
});
