const router = require("express").Router();
const Document = require("../models/document-model");
const User = require("../models/user-model");
const { DateTime } = require("luxon");

//mw
// router.use((req, res, next) => {
//   console.log("coming to doc.");
//   next();
// });
//------------------------------C-----post-----------------------
//create in get.

//------------------------------R-----get-----------------------
router.get("/recentlyOpened", async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  const recentlyOpened = user.recentlyOpened;

  try {
    const data = await Promise.all(
      recentlyOpened.map(async (v) => {
        let doc = await Document.findById(v.docId);
        console.log(`${req.user.email}per doc ${doc}`);
        if (!doc) return;
        let subData = {
          id: doc._id,
          title: doc.title,
          hostName: doc.hostName,
          time: doc.time,
          background: doc.background,
          lastOpened: v.time,
        };
        return subData;
      })
    );
    if (!data) {
      data = [];
    }
    console.log(data);
    res.send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send("Sorry, something went wrong.");
  }
});

// get docs created by current user.
router.get("/mydoc", async (req, res) => {
  const docs = await Document.find({ hostEmail: req.user.email });
  let data = [];
  docs.forEach((v) => {
    subData = {};
    subData.id = v._id;
    subData.title = v.title;
    subData.hostName = v.hostName;
    subData.background = v.background;
    subData.lastModified = v.lastModified;
    data.push(subData);
  });
  res.send(data);
});

// get docs shared with current user.
router.get("/shared", async (req, res) => {
  const user = await User.findOne({ email: req.user.email });
  const subscribe = user.subscribe;

  try {
    const data = await Promise.all(
      subscribe.map(async (v) => {
        let doc = await Document.findById(v);
        let subData = {
          id: doc._id,
          title: doc.title,
          hostName: doc.hostName,
          time: doc.time,
          background: doc.background,
          lastModified: doc.lastModified,
        };
        return subData;
      })
    );

    res.send(data);
  } catch (e) {
    console.log(e);
    res.status(500).send("Sorry, something went wrong.");
  }
});

//get doc's users list.
router.get("/users/:_id", async (req, res) => {
  let { _id } = req.params;
  const users = await User.find({ subscribe: _id }).select("name email -_id");
  res.status(200).send(users);
});

//get one or create.
router.get("/:_id", async (req, res) => {
  let { _id } = req.params;
  const doc = await Document.findById(_id);

  if (doc) {
    if (
      !(doc.hostEmail === req.user.email) &&
      !req.user.subscribe.includes(_id)
    )
      return res
        .status(403)
        .send("Sorry! You are not authorized to access this document.");
    return res.status(200).send(doc);
  } else {
    const newDoc = await Document.create({
      _id,
      data: "",
      hostEmail: req.user.email,
      hostName: req.user.name,
      lastModified: DateTime.utc(),
    });
    res.status(200).send(newDoc);
  }
});

//-------------------------------U----patch----------------------------
//host grant access to another user.
router.patch("/access", async (req, res) => {
  let { email, docId } = req.body;
  let hostEmail = req.user.email;

  try {
    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).send("document not found!");
    if (doc.hostEmail !== hostEmail)
      return res.status(403).send("Unauthorized Access.");

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found!");

    if (user.subscribe.includes(docId) | (email === hostEmail)) {
      res.status(400).send("This user already joined this document!");
    } else {
      user.subscribe.push(docId);
      await user.save();
      res.status(200).send("Access granted!");
    }
  } catch (e) {
    res.status(500).send("Sorry, something went wrong.");
  }
});

//kick a user out of a doc.
router.patch("/remove", async (req, res) => {
  let { email, docId } = req.body;
  let hostEmail = req.user.email;

  try {
    const doc = await Document.findById(docId);
    if (!doc) return res.status(404).send("document not found!");
    if (doc.hostEmail !== hostEmail)
      return res.status(403).send("Unauthorized Access.");

    const user = await User.findOne({ email });
    if (!user) return res.status(400).send("User not found!");

    if (!user.subscribe.includes(docId)) {
      res.status(400).send("This is not in the list.");
    } else {
      user.subscribe.pull(docId);
      await user.save();
      res.status(200).send("User removed!");
    }
  } catch (e) {
    res.status(500).send("Sorry, something went wrong.");
  }
});

//-------------------------------D-----delete---------------------------
//host delete doc
router.delete("/:_id", async (req, res) => {
  let { _id } = req.params;
  let hostEmail = req.user.email;
  const doc = await Document.findById(_id);
  if (!doc) return res.status(404).send("document not found!");
  if (doc.hostEmail !== hostEmail)
    return res.status(403).send("Unauthorized Access.");

  try {
    const result = await Document.deleteOne({ _id });
    res.status(200).send("Document deleted!");
  } catch (e) {
    console.log(e);
    res.status(500).send("Sorry, something went wrong.");
  }
});

module.exports = router;
