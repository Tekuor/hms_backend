const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
let SALT = 10;
const jwt = require("jsonwebtoken");

let middleware = require("./middleware");

const mongourl = "mongodb://localhost:27017/gifty";

const app = express();
const SECRET_KEY = "secretkey23456";

mongoose.connect(mongourl).then(
  () => {
    console.log("Database connection is successful");
  },
  err => {
    console.log("Error when connecting to the database" + err);
  }
);

const { User } = require("./models/user");
const { Issue } = require("./models/issue");
const { Reply } = require("./models/reply");

app.use(bodyParser.json());
app.use(cors());
app.use(middleware);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log("Listening on port " + port);
});

app.post("/api/user/signup", (req, res) => {
  var user = new User(req.body);
  user
    .save()
    .then(user => {
      const options = { expiresIn: "1d", issuer: "gifty" };
      const accessToken = jwt.sign({ id: user._id }, SECRET_KEY, options);

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
        const options = { expiresIn: "d", issuer: "gifty" };
        const accessToken = jwt.sign({ id: user._id }, SECRET_KEY, options);
        res.status(200).send({
          message: "Login Successful",
          data: user,
          token: accessToken,
          expires_in: expiresIn
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

app.post("/api/issue", (req, res) => {
  var issue = new Issue(req.body);
  issue
    .save()
    .then(issue => {
      res
        .status(201)
        .send({ message: "Issue successfully added", data: issue });
    })
    .catch(err => {
      res
        .status(400)
        .send({ message: "Error when saving to database", error: err });
    });
});

app.post("/api/issues", (req, res) => {
  Issue.find({ user_id: req.body.user_id }, (err, issues) => {
    if (!issues) {
      res.status(400).send({ message: "No Issues retrieved" });
      throw err;
    }

    res
      .status(200)
      .send({ message: "Issues retrieved successfully", data: issues });
  });
});

app.get("/api/issue/:id", (req, res) => {
  var id = req.params.id;
  Issue.findById(id, (err, issue) => {
    if (!issue) res.status(400).send({ message: "Issue not found" });

    res.status(200).send({ message: "Issue Found", data: issue });
  });
});

app.put("/api/issue/:id", (req, res) => {
  Issue.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, issue) => {
      if (err) return res.status(500).send(err);
      res.status(200).send({ message: "Issue Updated", data: issue });
    }
  );
});

app.get("/api/delete/issue/:id", (req, res) => {
  Issue.findByIdAndRemove(req.params.id, (err, issue) => {
    if (err) return res.status(500).send(err);
    const response = {
      message: "Issue successfully deleted",
      id: issue._id
    };
    return res.status(200).send(response);
  });
});

app.post("/api/reply", (req, res) => {
  var reply = new Reply(req.body);
  reply
    .save()
    .then(reply => {
      res
        .status(201)
        .send({ message: "Reply successfully added", data: reply });
    })
    .catch(err => {
      res
        .status(400)
        .send({ message: "Error when saving to database", error: err });
    });
});

app.post("/api/replies", (req, res) => {
  Reply.find({ issue_id: req.body.issue_id }, (err, replies) => {
    if (!replies) {
      res.status(400).send({ message: "No Replies retrieved" });
      throw err;
    }

    res
      .status(200)
      .send({ message: "Replies retrieved successfully", data: replies });
  });
});

app.put("/api/user/:id", (req, res) => {
  User.findByIdAndUpdate(
    req.params.id,
    req.body,
    { new: true },
    (err, issue) => {
      if (err) return res.status(500).send(err);
      res.status(200).send({ message: "User Updated", data: issue });
    }
  );
});

app.get("/api/users", (req, res) => {
  User.find({ user_type: "patient" }, (err, users) => {
    if (err) {
      res.status(400).send({ message: "Users not retrieved" });
    } else {
      res.status(200).send({ message: "Users retrieved", data: users });
    }
  });
});

app.get("/api/all/issues", (req, res) => {
  if (req.isAuthenticated) {
    Issue.find({}, (err, issues) => {
      if (err) {
        res.status(400).send({ message: "Issues not retrieved" });
      } else {
        res.status(200).send({ message: "Issues retrieved", data: issues });
      }
    });
  } else {
    res.status(401).send({ message: "Invalid access token" });
  }
});

app.post("/api/find/issues", (req, res) => {
  Issue.find({ status: req.body.status }, (err, issues) => {
    if (err) {
      res.status(400).send({ message: "Issues not retrieved" });
    } else {
      res.status(200).send({ message: "Issues retrieved", data: issues });
    }
  });
});
