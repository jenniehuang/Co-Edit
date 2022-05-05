const Document = require("../models/document-model");
const User = require("../models/user-model");
const { DateTime } = require("luxon");

const recentlyOpened = async (req, res) => {
  try {
    const recentlyOpened = await User.findOne({
      email: req.user.email,
    })
      .select("recentlyOpened -_id")
      .populate({
        path: "recentlyOpened._id",
        model: "Document",
        select: "_id title host background",
        populate: {
          path: "host",
          model: "User",
          select: "name email",
        },
      });
    let data = recentlyOpened.recentlyOpened.map((v) => {
      return {
        _id: v._id._id,
        title: v._id.title,
        host: v._id.host,
        background: v._id.background,
        lastOpened: v.lastOpened,
      };
    });

    res.status(200).send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send("Sorry, something went wrong.");
  }
};

const myDoc = async (req, res) => {
  try {
    const docs = await Document.find({ host: req.user._id })
      .select(" -data")
      .populate("host", ["name", "email"]);
    res.status(200).send(docs);
  } catch (e) {
    console.log(e);
    res.status(500).send("Sorry, something went wrong.");
  }
};

const shared = async (req, res) => {
  try {
    const subscribe = await User.findOne({
      email: req.user.email,
    })
      .select("subscribe -_id")
      .populate({
        path: "subscribe",
        model: "Document",
        select: "_id title host background lastModified",
        populate: {
          path: "host",
          model: "User",
          select: "name email",
        },
      });
    res.status(200).send(subscribe.subscribe);
  } catch (e) {
    console.log(e);
    res.status(500).send("Sorry, something went wrong.");
  }
};

const docUserList = async (req, res) => {
  let { _id } = req.params;
  try {
    const doc = await Document.findById(_id);

    if (!doc.host.equals(req.user._id)) {
      return res
        .status(403)
        .send("Sorry! You are not authorized to access this.");
    }
    const users = await User.find({ subscribe: _id }).select("name email -_id");
    res.status(200).send(users);
  } catch (e) {
    console.log(e);
    res.status(500).send("Sorry, something went wrong.");
  }
};

const getOneOrCreate = async (req, res) => {
  let { _id } = req.params;
  const doc = await Document.findById(_id).populate("host", ["name", "email"]);

  if (doc) {
    if (!doc.host.equals(req.user._id) && !req.user.subscribe.includes(_id))
      return res
        .status(403)
        .send("Sorry! You are not authorized to access this document.");
    return res.status(200).send(doc);
  } else {
    console.log("new");
    const newDoc = await Document.create({
      _id,
      data: "",
      host: req.user._id,
      lastModified: DateTime.utc(),
    });
    res.status(200).send(newDoc);
  }
};

const grantAccess = async (req, res) => {
  let { email, docId } = req.body;
  let host = req.user._id;

  try {
    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).send("document not found!");
    if (!doc.host.equals(host))
      return res.status(403).send("Unauthorized Access.");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found!");

    if (user.subscribe.includes(docId) | (email === req.user.email)) {
      res.status(400).send("This user already joined this document!");
    } else {
      user.subscribe.push(docId);
      let result = await user.save();
      res.status(200).send("Access granted!");
    }
  } catch (e) {
    res.status(500).send("Sorry, something went wrong.");
  }
};

const removeUser = async (req, res) => {
  let { email, docId } = req.body;
  let host = req.user._id;

  try {
    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).send("document not found!");
    if (!doc.host.equals(host))
      return res.status(403).send("Unauthorized Access.");

    const user = await User.findOne({ email });
    if (!user) return res.status(404).send("User not found!");

    if (!user.subscribe.includes(docId)) {
      res.status(400).send("This is not in the list.");
    } else {
      user.subscribe.pull(docId);
      user.recentlyOpened.pull({ docId });
      await user.save();
      res.status(200).send("User removed!");
    }
  } catch (e) {
    console.log(e);
    res.status(500).send("Sorry, something went wrong.");
  }
};

const deleteDoc = async (req, res) => {
  let { _id } = req.params;
  let host = req.user._id;
  const doc = await Document.findById(_id);
  if (!doc) return res.status(404).send("document not found!");
  if (!doc.host.equals(host))
    return res.status(403).send("Unauthorized Access.");

  try {
    const result = await Document.deleteOne({ _id });
    res.status(200).send("Document deleted!");
  } catch (e) {
    console.log(e);
    res.status(500).send("Sorry, something went wrong.");
  }
};

module.exports = {
  recentlyOpened,
  myDoc,
  shared,
  docUserList,
  grantAccess,
  getOneOrCreate,
  removeUser,
  deleteDoc,
};
