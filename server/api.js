
const express = require('express');
const router = express.Router();

const Wall = require('./Wall.js');

router.use((req, res, next) => {
  if (Wall.db.readyState != Wall.db.states.connected) {
    res.status(503).json({error: "can't connect to database"});
  }else {
    next();
  }
});

router.get('/walls', async (req, res) => {
  console.log('get of /walls');
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
