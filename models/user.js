const mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
  first_name: {
    type: String,
    required: "First name can't be empty"
  },
  last_name: {
    type: String,
    required: "Last name can't be empty"
  },
  email: {
    type: String,
    required: "Email can't be empty",
    unique: true
  },
  dob: {
    type: String,
    required: "Date of birth can't be empty"
  },
  address: {
    type: String
  },
  phone_number: {
    type: String
  },
  gender: {
    type: String,
    required: "Gender can't be empty"
  },
  user_type: {
    type: String,
    required: "User type can't be empty"
  },
  password: {
    type: String,
    required: "Password can't be empty",
    minlength: [4, "Password must be at least 4 characters long"]
  }
});

const bcrypt = require("bcrypt");
let SALT = 10;

userSchema.pre("save", function(next) {
  var user = this;
  if (!user.isModified("password")) return next();

  bcrypt.genSalt(SALT, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

userSchema.methods.comparePassword = function(
  candidatePassword,
  checkPassword
) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return checkPassword(err);
    checkPassword(null, isMatch);
  });
};

const User = mongoose.model("User", userSchema);
module.exports = { User };
