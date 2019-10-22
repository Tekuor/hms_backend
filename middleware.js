let jwt = require("jsonwebtoken");
let config = require("./config.js");

let checkToken = (req, res, next) => {

  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    console.log(token);
    const options = {
      maxAge: "1d",
      issuer: "gifty"
    };
    try {
      decoded = jwt.verify(token, config.SECRET_KEY, options);
      req.isAuthenticated = true;
      req.decoded = decoded;
      next();
    } catch (err) {
      req.isAuthenticated = false;
      next();
    }
  } else {
    req.isAuthenticated = false;
    next();
  }
};

module.exports = checkToken;
