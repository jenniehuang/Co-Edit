const router = require("express").Router();
const passport = require("passport");
const authController = require("../controllers/authController");

//------------------------------signup-----------------------------
router.post("/signup", authController.signupLocal);

//-----------------------------------login------------------------------------

router.post("/login", authController.loginLocal);

router.get(
  "/google/callback",
  passport.authenticate("google", {
    failureRedirect: "/",
    session: false,
  }),
  authController.googleCallback
);

router.get(
  "/google",
  passport.authenticate("google", {
    scope: ["profile", "email"],
    prompt: "select_account",
  })
);

module.exports = router;
