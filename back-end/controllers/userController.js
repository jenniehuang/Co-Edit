const User = require("../models/user-model");
const userDataValidation = require("../config/joi").userDataValidation;
//----------------------------------------------------------------
const uploadUserData = async (req, res) => {
  const { _id } = req.user;
  const { error } = userDataValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);
  const { thumbnailURL, backgroundURL, link, about } = req.body;

  try {
    await User.findByIdAndUpdate(_id, {
      thumbnail: thumbnailURL,
      background: backgroundURL,
      link,
      about,
    });
  } catch (e) {
    console.log(e);
    return res.status(500).send("Sorry, something went wrong.");
  }
  res.status(200).send({
    thumbnail: thumbnailURL,
    background: backgroundURL,
    link,
    about,
  });
};

const getUserInfo = async (req, res) => {
  let { _id } = req.params;
  const foundUser = await User.findOne({ _id });
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
