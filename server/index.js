
if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const app = express();
const apiRouter = require('./api.js');

const mongoose = require('mongoose');

// so api requests can 503 rather than hanging when not connected
mongoose.set('bufferCommands', false);

mongoose.connection.once('open', () => console.log(`connected to: ${process.env.DB_URL}`));
mongoose.connection.on('error', err => console.error('mongo error: ', err.message));

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
  .catch(err => {
    console.error(`failed to connect to: ${process.env.DB_URL}`);
    console.error(err.message);
  });

app.use('/api', apiRouter);

app.listen(process.env.PORT);
