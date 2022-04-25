const User = require("../models/user-model");
//----------------------------------------------------------------
const uploadUserData = async (req, res) => {
  const { _id } = req.user;
  const { thumbnailURL, backgroundURL, link, about } = req.body;
  await User.findByIdAndUpdate(_id, {
    thumbnail: thumbnailURL,
    background: backgroundURL,
    link,
    about,
  });
  res.status(200).send("ok");
};

const getUserInfo = async (req, res) => {
  let { _id } = req.params;
  const foundUser = await User.findById(_id);
  const data = {
    name: foundUser.name,
    thumbnail: foundUser.thumbnail,
    background: foundUser.background,
    about: foundUser.about,
    link: foundUser.link,
  };
  res.status(200).send(data);
};

module.exports = {
  uploadUserData,
  getUserInfo,
};
