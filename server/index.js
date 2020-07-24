
const express = require('express');
const app = express();
const apiRouter = require('./api.js');

const mongoose = require('mongoose');
const Wall = require('./Wall.js');

// TODO: environment variables
mongoose.connect('mongodb://localhost/connect', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.once('open', () => console.log('connected to mongo'));
db.on('error', console.error.bind(console, 'mongo connection error: '));

app.use('/api', apiRouter);

app.listen(3001);
