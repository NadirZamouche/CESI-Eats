const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const logSchema = new Schema({
  value: {
    type: String,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
}, { timestamps: true });

const Log = mongoose.model('Log', logSchema);

module.exports = Log;
