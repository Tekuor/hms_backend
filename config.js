const SECRET_KEY = "secretkey23456";
const port = process.env.PORT || 4000;


module.exports = {
  SECRET_KEY: SECRET_KEY,
  db: {
    url: "mongodb://localhost:27017/gifty"
  },
  port:port
};
