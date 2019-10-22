    const Reply = require("../../models/reply");

   app.post("/api/reply", (req, res) => {
    if (req.isAuthenticated) {
    let reply = new Reply(req.body);
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
    }else {
      res.status(401).send({ message: "Invalid access token" });
    }
  });

  app.post("/api/replies", (req, res) => {
    if (req.isAuthenticated) {
    Reply.find({ issue_id: req.body.issue_id }, (err, replies) => {
      if (!replies) {
        res.status(400).send({ message: "No Replies retrieved" });
        throw err;
      }

      res
        .status(200)
        .send({ message: "Replies retrieved successfully", data: replies });
    });
  }else {
    res.status(401).send({ message: "Invalid access token" });
  }
  });