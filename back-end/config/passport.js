const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;
const fetch = require("node-fetch");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: `${process.env.SERVER_URI}/api/auth/google/callback`,
      scope: ["profile", "email"],
    },
    //passport callback
    async function (accessToken, refreshToken, profile, cb) {
      let foundUser = await User.findOne({ googleID: profile.id });
      if (foundUser) {
        cb(null, foundUser);
      } else {
        const auth = "563492ad6f91700001000001c889c828ca8441f5a53ac461e4dbfa16";
        const url =
          "https://api.pexels.com/v1/search?query=landscape&per_page=30";
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
          name: profile.displayName,
          email: profile.emails[0].value,
          googleID: profile.id,
          thumbnail: profile.photos[0].value,
          background: fetchedBg,
        });

        await newUser.save();
        cb(null, newUser);
      }
    }
  )
);

module.exports = (passport) => {
  let opts = {};
  opts.jwtFromRequest = ExtractJwt.fromAuthHeaderWithScheme("JWT");
  opts.secretOrKey = process.env.PASSPORT_SECRET;
  passport.use(
    new JwtStrategy(opts, async function (jwt_payload, done) {
      try {
        const user = await User.findById(jwt_payload._id);
        if (user) return done(null, user);
      } catch (e) {
        return done(e, false);
      }
      return done(null, false);
    })
  );
};
