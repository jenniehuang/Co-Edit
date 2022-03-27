// const passport = require("passport");
// const GoogleStrategy = require("passport-google-oauth20");
const User = require("../models/user-model");
const JwtStrategy = require("passport-jwt").Strategy;
const ExtractJwt = require("passport-jwt").ExtractJwt;

//http://www.passportjs.org/packages/passport-google-oauth20/

// passport.use(
//   new GoogleStrategy(
//     {
//       clientID: process.env.GOOGLE_CLIENT_ID,
//       clientSecret: process.env.GOOGLE_CLIENT_SECRET,
//       callbackURL: "http://localhost:3000",
//     },
//     //passport callback
//     async function (accessToken, refreshToken, profile, cb) {
//       let foundUser = await User.findOne({ googleID: profile.id });
//       if (foundUser) {
//         console.log("already exist.");
//         const tokenObj = { _id: foundUser.id, email: foundUser.email };
//         const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET);
//         res.send({ success: true, token: "JWT" + token, user: foundUser.name });
//         console.log(`token from google:${token}`);
//         cb(null, foundUser);

//         //----delete
//         console.log(token);
//         console.log(foundUser);
//       } else {
//         let newUser = new User({
//           name: profile.displayName,
//           googleID: profile.id,
//           thumbnail: profile.photos[0].value,
//         });

//         await newUser.save();
//         console.log("New user saved");
//         const tokenObj = { _id: newUser.id, email: newUser.email };
//         const token = jwt.sign(tokenObj, process.env.PASSPORT_SECRET);
//         res.send({ success: true, token: "JWT" + token, user: newUser.name });
//         cb(null, newUser);
//       }
//     }
//   )
// );

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
