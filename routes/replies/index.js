const Issue = require("../../models/issue");


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
    if (req.isAuthenticated) {
    Issue.find({ status: req.body.status }, (err, issues) => {
      if (err) {
        res.status(400).send({ message: "Issues not retrieved" });
      } else {
        res.status(200).send({ message: "Issues retrieved", data: issues });
      }
    });
    }else {
        res.status(401).send({ message: "Invalid access token" });
      }
  });

  app.post("/api/issue", (req, res) => {
    if (req.isAuthenticated) {
    let issue = new Issue(req.body);
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
    }else {
        res.status(401).send({ message: "Invalid access token" });
      }
  });

  app.post("/api/issues", (req, res) => {
    if (req.isAuthenticated) {
    Issue.find({ user_id: req.body.user_id }, (err, issues) => {
      if (!issues) {
        res.status(400).send({ message: "No Issues retrieved" });
        throw err;
      }

      res
        .status(200)
        .send({ message: "Issues retrieved successfully", data: issues });
    });
    }else {
        res.status(401).send({ message: "Invalid access token" });
      }
  });

  app.get("/api/issue/:id", (req, res) => {
      if (req.isAuthenticated) {
    let id = req.params.id;
    Issue.findById(id, (err, issue) => {
      if (!issue) res.status(400).send({ message: "Issue not found" });

      res.status(200).send({ message: "Issue Found", data: issue });
    });
    }else {
        res.status(401).send({ message: "Invalid access token" });
      }
  });

  app.put("/api/issue/:id", (req, res) => {
      if (req.isAuthenticated) {
    Issue.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, issue) => {
        if (err) return res.status(500).send(err);
        res.status(200).send({ message: "Issue Updated", data: issue });
      }
    );
    }else {
        res.status(401).send({ message: "Invalid access token" });
      }
  });

  app.get("/api/delete/issue/:id", (req, res) => {
      if (req.isAuthenticated) {
    Issue.findByIdAndRemove(req.params.id, (err, issue) => {
      if (err) return res.status(500).send(err);
      const response = {
        message: "Issue successfully deleted",
        id: issue._id
      };
      return res.status(200).send(response);
    });
    }else {
        res.status(401).send({ message: "Invalid access token" });
      }
  });