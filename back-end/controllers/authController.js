const jwt = require("jsonwebtoken");
const { DateTime } = require("luxon");
const fetch = require("node-fetch");
const User = require("../models/user-model");

const signupValidation = require("../config/joi").signupValidation;
const loginValidation = require("../config/joi").loginValidation;

//-----------------------------------------------------------------

const signupLocal = async (req, res) => {
  //validating data
  const { error } = signupValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existEmail = await User.findOne({ email: req.body.email });
  if (existEmail)
    return res.status(400).send("This email has already been registered!");
  const auth = "563492ad6f91700001000001c889c828ca8441f5a53ac461e4dbfa16";
  const url = "https://api.pexels.com/v1/search?query=landscape&per_page=30";
  let response = await fetch(url, {
    method: "GET",
    headers: {
      Accept: "application/json",
      Authorization: auth,
    },
  });
  let data = await response.json();
  let index = Math.floor(Math.random() * 30);
  const fetchedBg = data.photos[index].src.large2x;
  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    date: DateTime.utc(),
    background: fetchedBg,
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).send("Sign up successful, you can login now!");
  } catch (err) {
    res.status(500).send("User not saved.");
  }
};

const loginLocal = async (req, res) => {
  //validating data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(404).send("User not found.");
    try {
      const isMatch = await user.comparePassword(req.body.password);
      if (isMatch) {
        const tokenObj = { _id: user.id, email: user.email };
        const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET);
        res.status(200).send({
          token: "JWT " + token,
          name: user.name,
          email: user.email,
          image: user.thumbnail,
          background: user.background,
          id: user.id,
        });
      } else {
        return res.status(401).send("Wrong email or password.");
      }
    } catch (e) {
      if (process.env.NODE_ENV !== "test") {
        console.log(e);
      }
      return res.status(500).send(e);
    }
  } catch (e) {
    return res.status(500).send(e);
  }
};

const googleCallback = (req, res) => {
  const { user } = req;
  const tokenObj = { _id: user.id, email: user.email };
  const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET);
  res.redirect(
    `${process.env.SOCKET_ORIGIN}/?token=JWT ${token}&name=${user.name}&email=${user.email}&image=${user.thumbnail}&id=${user.id}&bg=${user.background}`
  );
};

module.exports = {
  loginLocal,
  signupLocal,
  googleCallback,
};
