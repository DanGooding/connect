
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const path = require('path');
const apiRouter = require('./api.js');

app.use('/api', apiRouter);

app.use(express.static(path.join(__dirname, 'static')));
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'static', 'index.html'));
});


app.listen(process.env.PORT);
