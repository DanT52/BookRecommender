const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// basically same as book model, but with different name
const bookRecSchema = new Schema({
  title: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  user: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

const BookRec = mongoose.model('Book', bookRecSchema);

module.exports = BookRec;
