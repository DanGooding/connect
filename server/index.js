
const express = require('express');
const app = express();
const apiRouter = require('./api.js');

const mongoose = require('mongoose');
// TODO: environment variables
const db_url = 'mongodb://localhost/connect';

// so api requests can 503 rather than hanging when not connected
mongoose.set('bufferCommands', false);

mongoose.connection.once('open', () => console.log(`connected to: ${db_url}`));
mongoose.connection.on('error', err => console.error('mongo error: ', err.message));

mongoose.connect(db_url, {useNewUrlParser: true, useUnifiedTopology: true})
  .catch(err => {
    console.error(`failed to connect to: ${db_url}`);
    console.error(err.message);
  });

app.use('/api', apiRouter);

app.listen(3001);
