const router = require("express").Router();
const passport = require("passport");
const jwt = require("jsonwebtoken");

const User = require("../models/user-model");

const signupValidation = require("../config/joi").signupValidation;
const loginValidation = require("../config/joi").loginValidation;

//mw
router.use((req, res, next) => {
  console.log("coming to auth.");
  next();
});

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
router.get("/google", passport.authenticate("google", { scope: ["profile"] }));

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
          subscribe: user.subscribe,
        });
      } else {
        console.log(err);
        return res.status(401).send("Wrong email or password.");
      }
    });
  });
});

router.get("/testAPI", (req, res) => {
  const mesgObj = {
    message: "test is working",
  };

  return res.json(mesgObj);
});

module.exports = router;

/*
invalid from joi
{
  value: { name: 'je8888ie', email: '9om', password: '888888' },
  error: [Error [ValidationError]: "email" must be a valid email] {
    _original: { name: 'je8888ie', email: '9om', password: '888888' },
    details: [ [Object] ]
  }
}

*/

/*
post login return
{
    "success": true,
    "token": "JWT eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MjM0MjYzMjkyNjUyMjUwOGYxY2VhZGQiLCJlbWFpbCI6Ijg4OEA4ODguY29tIiwiaWF0IjoxNjQ3NjcyMzk2fQ.bfJ3Pa78uiM0NLoxgvobDrZt27rqFRShLzvdH2LqgHg",
    "user": {
        "_id": "62342632926522508f1ceadd",
        "name": "ppp",
        "email": "888@888.com",
        "password": "$2b$10$9ypllPbtvUWHpvnUxkMDyOsTq0Ob6AOFyN6Punyukl3u5HoTo0eOi",
        "subscribe": [],
        "date": "2022-03-18T06:26:58.226Z",
        "__v": 0
    }
}

*/
