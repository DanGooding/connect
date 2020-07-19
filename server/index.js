
const express = require('express');
const mongoose = require('mongoose');
const Wall = require('./Wall.js');

const app = express();

// TODO: environment variables
mongoose.connect('mongodb://localhost/connect', {useNewUrlParser: true, useUnifiedTopology: true});
const db = mongoose.connection;
db.once('open', () => {
  console.log('connected to mongo');
});
db.on('error', console.error.bind(console, 'connection error: '));


app.get('/walls', async (req, res) => {
  try {
    // TODO: limit & paginate
    const walls = await Wall.find({}, 'name');
    res.json(walls);
  }catch (err) {
    res.status(500).json({error: "failed to get walls"});
  }
});

app.get('/walls/:id', async (req, res) => {
  try {
    const wall = await Wall.findById(req.params.id)
    res.json(wall);
  }catch (err) {
    res.status(404).json({ error: "failed to find that wall" })
  }
});

app.listen(3001);
