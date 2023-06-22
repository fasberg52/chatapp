const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const peopleSchema = new Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    minlenght: 1,
    lowercase: true,
  },
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 255,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  ExpiredDateresetToken: Date,
});

module.exports = mongoose.model("People", peopleSchema);
