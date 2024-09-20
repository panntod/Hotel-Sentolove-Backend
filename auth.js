const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

auth = (req, res, next) => {
  let token =
    req.headers.authorization && req.headers.authorization.split(" ")[1];

  let jwtHeader = {
    algorithm: "HS256",
  };

  if (!token) {
    res.status(401).json({ message: "Unauthorized" });
  } else {
    jwt.verify(token, SECRET_KEY, jwtHeader, (error, user) => {
      if (error) {
        res.status(401).json({
          message: "Invalid token",
        });
      } else {
        next();
      }
    });
  }
};

module.exports = auth;
