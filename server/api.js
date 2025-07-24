
const express = require('express');
const router = express.Router();
const fs = require('node:fs/promises')

const mongoose = require('mongoose');
const Wall = require('./Wall.js');

mongoose.connection.once('open', () => console.log(`connected to mongodb`));
mongoose.connection.on('error', err => console.error('mongo error: ', err.message));

fs.readFile(process.env.DB_URL_FILE)
  .catch(err => console.error('missing mongodb configuration', err))
  .then(db_url => db_url.toString().trim())
  .then(db_url =>
    mongoose.connect(db_url, { dbName: process.env.DB_NAME, useNewUrlParser: true, useUnifiedTopology: true }))
  .catch(err => {
    console.error('failed to connect to mongodb');
    console.error(err);
  });

// ensure we give an error response, rather than hanging waiting for the db
mongoose.set('bufferCommands', false);
router.use((req, res, next) => {
  if (mongoose.connection.readyState != mongoose.connection.states.connected) {
    res.sendStatus(503);
  } else {
    next();
  }
});

router.get('/walls', async (req, res) => {
  try {
    // TODO: limit & paginate
    const walls =
      await Wall
        .find({})
        .sort({ 'series': 'asc', 'episode': 'asc', 'symbolIndex': 'asc' })
        .select(['series', 'episode', 'symbolName']);
    res.json(walls);
  } catch (err) {
    console.error('/walls :', err);
    res.status(404).json({ error: 'Unable to get list of walls' });
  }
});

router.get('/walls/random', async (req, res) => {
  try {
    const [wall] = await Wall.aggregate([{ $sample: { size: 1 } }]);
    res.json(wall);
  } catch (err) {
    console.error('/walls/random :', err);
    res.status(404).json({ error: 'Unable to get a random wall' });
  }
});

router.get('/walls/:id', async (req, res) => {
  try {
    const wall = await Wall.findById(req.params.id);
    res.json(wall);
  } catch (err) {
    res.status(404).json({ error: 'That wall does not exist' });
  }
});

router.get('*', (req, res) => {
  res.status(404).json({ error: 'That endpoint does not exist' });
})

module.exports = router;
