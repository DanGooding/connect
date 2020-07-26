
const express = require('express');
const router = express.Router();

const mongoose = require('mongoose');
const Wall = require('./Wall.js');

mongoose.connection.once('open', () => console.log(`connected to: ${process.env.DB_URL}`));
mongoose.connection.on('error', err => console.error('mongo error: ', err.message));

mongoose.connect(process.env.DB_URL, {useNewUrlParser: true, useUnifiedTopology: true})
  .catch(err => {
    console.error(`failed to connect to: ${process.env.DB_URL}`);
    console.error(err.message);
  });

// ensure we give an error response, rather than hanging waiting for the db
mongoose.set('bufferCommands', false);
router.use((req, res, next) => {
  if (mongoose.connection.readyState != mongoose.connection.states.connected) {
    res.status(503).json({error: "can't connect to database"});
  }else {
    next();
  }
});

router.get('/walls', async (req, res) => {
  try {
    // TODO: limit & paginate
    const walls = 
      await Wall
        .find({})
        .sort({'series': 'asc', 'episode': 'asc', 'symbolIndex': 'asc'})
        .select(['series', 'episode', 'symbolName']);
    res.json(walls);
  }catch (err) {
    res.status(404).json({error: 'failed to get walls'});
  }
});

router.get('/walls/:id', async (req, res) => {
  try {
    const wall = await Wall.findById(req.params.id);
    res.json(wall);
  }catch (err) {
    res.status(404).json({ error: 'failed to find that wall' });
  }
});

module.exports = router;
