
const express = require('express');
const router = express.Router();

const Wall = require('./Wall.js');

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
    res.status(500).json({error: "failed to get walls"});
  }
});

router.get('/walls/:id', async (req, res) => {
  try {
    const wall = await Wall.findById(req.params.id);
    res.json(wall);
  }catch (err) {
    res.status(404).json({ error: "failed to find that wall" });
  }
});

module.exports = router;
