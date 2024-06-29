const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ArticleSchema = new Schema({
  name: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  path: { type: String, required: true, unique: true }, // Set path as unique
  Restaurateur: { type: Schema.Types.ObjectId, ref: 'Restaurateur', required: true },
}, { timestamps: true });

module.exports = mongoose.model('Article', ArticleSchema);
