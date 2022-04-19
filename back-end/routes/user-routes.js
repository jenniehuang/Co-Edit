const router = require("express").Router();
const User = require("../models/user-model");

//---------------------------------------------
router.patch("/thumbnail", async (req, res) => {
  const { _id } = req.user;
  const { url } = req.body;
  await User.findByIdAndUpdate(_id, { thumbnail: url });
  res.status(200).send("ok");
});

module.exports = router;
