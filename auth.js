const jwt = require("jsonwebtoken"); // create token
const SECRET_KEY = "rahasia-sangat-rahasia"; // secret key
auth = (req, res, next) => { // middleware
  let header = req.headers.authorization; // ambil token dari header
  let token = header && header.split(" ")[1]; // ambil token dari header dan split

  let jwtHeader = {
    algorithm: "HS256", // algoritma yang digunakan
  };
  if (token == null) { // jika token tidak ada
    res.status(401).json({ message: "Unauthorized" }); // kirim pesan unauthorized
  } else { // jika token ada
    jwt.verify(token, SECRET_KEY, jwtHeader, (error, user) => { // verifikasi token
      if (error) { // jika error
        res.status(401).json({ // kirim pesan invalid token
          message: "Invalid token", // pesan
        });
      } else { // jika tidak error
        next(); // lanjutkan
      }
    });
  }
};

module.exports = auth; // export auth
