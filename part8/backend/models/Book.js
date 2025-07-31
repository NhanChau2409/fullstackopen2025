const mongoose = require("mongoose");

// you must install this library
// const uniqueValidator = require("mongoose-unique-validator");

const schema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
    minlength: 5,
  },
  published: {
    type: Number,
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Author",
    required: true,
  },
  genres: {
    type: [String],
    required: true,
    validate: {
      validator: function(v) {
        return v && v.length > 0;
      },
      message: 'Genres cannot be empty'
    }
  },
});

// schema.plugin(uniqueValidator);

module.exports = mongoose.model("Book", schema);
