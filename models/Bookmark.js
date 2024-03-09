const mongoose = require('mongoose');

const bookmarkSchema = new mongoose.Schema({
  title: String,
  url: String,
  collections: [String],
  tags: [String],
  notes: String,
  content: String,
}, { timestamps: true });

module.exports = mongoose.model('Bookmark', bookmarkSchema);
