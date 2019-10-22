"use-strict";

const User = require("../../models/user");
const config = require("../../config");
const jwt = require("jsonwebtoken");

app.post("/api/user/signup", (req, res) => {
  var user = new User(req.body);
  user
    .save()
    .then(user => {
      const options = { expiresIn: "1d", issuer: "gifty" };
      const accessToken = jwt.sign(
        { id: user._id },
        config.SECRET_KEY,
        options
      );

      res.status(201).send({
        message: "User successfully added",
        data: user,
        token: accessToken
      });
    })
    .catch(err => {
      res.status(400).send(err.message);
    });
});

app.post("/api/user/signin", (req, res) => {
  User.findOne({ email: req.body.email }, (err, user) => {
    if (!user) res.status(400).send({ message: "User not found" });

    if (req.body.password) {
      user.comparePassword(req.body.password, (err, isMatch) => {
        if (err) throw err;
        if (!isMatch) res.status(400).send({ message: "Wrong Password" });
        const options = { expiresIn: "1d", issuer: "gifty" };
        const accessToken = jwt.sign(
          { id: user._id },
          config.SECRET_KEY,
          options
        );
        res.status(200).send({
          message: "Login Successful",
          data: user,
          token: accessToken
        });
      });
    }
  });
});

app.get("/api/users/:id", (req, res) => {
  var id = req.params.id;
  User.findById(id, (err, user) => {
    if (!user) res.status(400).send({ message: "User not found" });

    res.status(200).send({ message: "User Found", data: user });
  });
});
