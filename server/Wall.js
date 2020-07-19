
const mongoose = require('mongoose');

const wallSchema = new mongoose.Schema({
  // name: String,  // TODO: there appears to be no good name!!!
  groups: {
    clues: [String],
    connection: String
  }
});

module.exports = mongoose.model('Wall', wallSchema);
