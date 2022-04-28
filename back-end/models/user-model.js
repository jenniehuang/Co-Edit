const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    maxLength: 1024,
  },
  googleID: {
    type: String,
  },
  thumbnail: {
    type: String,
    default:
      "https://cdn4.iconfinder.com/data/icons/music-ui-solid-24px/24/user_account_profile-2-512.png",
  },
  background: {
    type: String,
  },
  date: {
    type: Date,
  },
  subscribe: {
    type: [
      {
        type: String,
        ref: "Document",
      },
    ],
    default: [],
  },
  recentlyOpened: {
    type: [
      {
        _id: {
          type: String,
          ref: "Document",
        },
        lastOpened: Date,
      },
    ],
    default: [],
  },
  pined: {
    type: [String],
    default: [],
  },
  link: {
    type: String,
    default: "",
  },
  about: {
    type: String,
    default: "",
  },
});

//https://mongoosejs.com/docs/middleware.html
userSchema.pre("save", async function (next) {
  if (this.googleID) return next();
  if (this.isModified("password") || this.isNew) {
    const hash = await bcrypt.hash(this.password, 10);
    this.password = hash;
    next();
  } else {
    return next();
  }
});

userSchema.methods.comparePassword = function (password, cb) {
  //------------plainText----DB----------
  bcrypt.compare(password, this.password, (err, isMatch) => {
    if (err) return cb(err, isMatch);
    cb(null, isMatch);
  });
};

module.exports = mongoose.model("User", userSchema);
