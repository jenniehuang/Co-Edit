const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    maxLength: 10,
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
  },
  date: {
    type: Date,
    default: Date.now,
  },
  subscribe: {
    type: [String],
    default: [],
  },
});

//https://mongoosejs.com/docs/middleware.html
userSchema.pre("save", async function (next) {
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
