let jwt = require("jsonwebtoken");
let config = require("./index.js");
const SECRET_KEY = "secretkey23456";

let checkToken = (req, res, next) => {
  //let token = req.headers['x-access-token'] || req.headers['authorization'];
  //   let token = req.headers.authorization.split(" ")[1];

  //   console.log(token);

  // if (token) {

  //     jwt.verify(token, config.SECRET_KEY, (err, decoded) => {
  //     if (err) {
  //         return res.json({
  //         success: false,
  //         message: 'Token is not valid'
  //         });
  //     } else {
  //         req.decoded = decoded;
  //         next();
  //     }
  //     });
  // } else {
  //     return res.json({
  //     success: false,
  //     message: 'Auth token is not supplied'
  //     });
  // }

  const authorizationHeader = req.headers.authorization;
  if (authorizationHeader) {
    const token = req.headers.authorization.split(" ")[1]; // Bearer <token>
    console.log(token);
    const options = {
      maxAge: "1d",
      issuer: "gifty"
    };
    try {
      decoded = jwt.verify(token, SECRET_KEY, options);
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
