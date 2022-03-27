const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    default: "Untitled Document",
    maxLength: 50,
  },

  data: {
    type: Object,
  },

  time: {
    type: Date,
    default: Date.now(),
  },

  hostEmail: {
    type: String,
    required: true,
  },

  hostName: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Document", documentSchema);
