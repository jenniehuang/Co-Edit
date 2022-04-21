const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/user-model");

const signupValidation = require("../config/joi").signupValidation;
const loginValidation = require("../config/joi").loginValidation;

//------------------------------signup-----------------------------
router.post("/signup", async (req, res) => {
  //validating data
  const { error } = signupValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const existEmail = await User.findOne({ email: req.body.email });
  if (existEmail)
    return res.status(400).send("This email has already been registered!");

  const newUser = new User({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
  });

  try {
    const savedUser = await newUser.save();
    res.status(200).send("Sign up successful, you can login now!");
  } catch (err) {
    res.status(400).send("User not saved.");
  }
});

//-----------------------------------login------------------------------------

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  function (req, res) {
    const { user } = req;
    const tokenObj = { _id: user.id, email: user.email };
    const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET);
    res.redirect(
      `${process.env.SOCKET_ORIGIN}/?token=JWT ${token}&name=${user.name}&email=${user.email}&image=${user.thumbnail}&id=${user.id}`
    );
  }
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

router.post("/login", async (req, res) => {
  //validating data
  const { error } = loginValidation(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  User.findOne({ email: req.body.email }, (err, user) => {
    if (err) return res.status(400).send(err);
    if (!user) return res.status(404).send("User not found.");
    user.comparePassword(req.body.password, function (err, isMatch) {
      if (err) return res.status(400).send(err);
      if (isMatch) {
        const tokenObj = { _id: user.id, email: user.email };
        const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET);
        res.send({
          token: "JWT " + token,
          name: user.name,
          email: user.email,
          image: user.thumbnail,
          id: user.id,
        });
      } else {
        console.log(err);
        return res.status(401).send("Wrong email or password.");
      }
    });
  });
});

module.exports = router;
