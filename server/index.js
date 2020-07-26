
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const apiRouter = require('./api.js');

app.use('/api', apiRouter);

app.listen(process.env.PORT);
