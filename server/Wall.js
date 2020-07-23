
const mongoose = require('mongoose');

const wallSchema = new mongoose.Schema({
  series: Number,
  episode: Number,
  symbolIndex: Number,
  symbolName: String,
  groups: [{
    clues: [String],
    connection: String
  }]
});

module.exports = mongoose.model('Wall', wallSchema);
