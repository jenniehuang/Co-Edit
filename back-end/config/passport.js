const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

//http://www.passportjs.org/packages/passport-google-oauth20/

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
      console.log(profile.emails[0].value);
      let foundUser = await User.findOne({ googleID: profile.id });
      if (foundUser) {
        console.log("already exist.");
        cb(null, foundUser);
      } else {
        const newUser = new User({
          name: profile.displayName,
          email: profile.emails[0].value,
          googleID: profile.id,
          thumbnail: profile.photos[0].value,
        });

        await newUser.save();
        console.log("New user saved");
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
    new JwtStrategy(opts, function (jwt_payload, done) {
      User.findById(jwt_payload._id, (err, user) => {
        if (err) return done(err, false);
        if (user) return done(null, user);
        return done(null, false);
      });
    })
  );
};
