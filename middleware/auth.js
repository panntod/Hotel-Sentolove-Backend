const jwt = require("jsonwebtoken");
const SECRET_KEY = process.env.SECRET_KEY;

auth = (req, res, next) => {
  let token =
    req.cookies["sentolove/token"] || req.headers?.authorization?.split(" ")[1];

  if (!token) {
    res.status(401).json({ message: "Ooooops! Token tidak ditemukan" });
  } else {
    jwt.verify(token, SECRET_KEY, (error, user) => {
      if (error) {
        res.status(401).json({
          message: "Ooooops! Token tidak valid",
        });
      } else {
        req.loginUser = user;
        next();
      }
    });
  }
};

module.exports = auth;
