const mongoose = require("mongoose");
const { DateTime } = require("luxon");
const User = require("./user-model");
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

  hostEmail: {
    type: String,
    required: true,
  },

  hostName: {
    type: String,
    required: true,
  },

  background: {
    type: String,
    default:
      "https://images.unsplash.com/photo-1562654501-a0ccc0fc3fb1?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1632&q=80",
  },
  lastModified: {
    type: Date,
  },
});

documentSchema.pre("deleteOne", async function (next) {
  const deletedId = this.getFilter()["_id"];
  let subResult = await User.updateMany(
    { subscribe: { $in: [deletedId] } },
    { $pull: { subscribe: { $in: [deletedId] } } }
  );
  let recentResult = await User.updateMany(
    { "recentlyOpened.docId": deletedId },
    { $pull: { recentlyOpened: { _id: [deletedId] } } }
  );

  return next();
});

module.exports = mongoose.model("Document", documentSchema);
