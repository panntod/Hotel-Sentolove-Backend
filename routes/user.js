const express = require("express"); // import express
const bodyParser = require("body-parser"); // import body-parser
const bcrypt = require("bcrypt"); // import bcrypt
const { Op } = require("sequelize"); // import sequelize
const auth = require("../auth"); // import auth
const jwt = require("jsonwebtoken"); // import jsonwebtoken
const SECRET_KEY = "rahasia-sangat-rahasia"; // set secret key

const app = express(); // create express app
app.use(bodyParser.json()); // parse request of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse request of content-type - application/x-www-form-urlencoded

const user = require("../models/index").user; // import models

const multer = require("multer"); // import multer
const path = require("path"); // import path
const fs = require("fs"); // import fs

const storage = multer.diskStorage({ // set storage
  destination: (req, file, cb) => { // set destination
    cb(null, "./img/user"); // set destination
  },
  filename: (req, file, cb) => { // set filename
    cb(null, "img-" + Date.now() + path.extname(file.originalname)); // set filename
  },
});

let upload = multer({ storage: storage }); // set upload

// endpoint get all data
app.get("/getAllData", auth, async (req, res) => { // get all data
  await user // user model
    .findAll() // get all data
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response dengan status 200
        status: "success", //  status success
        data: result, //  data result
      });
    })
    .catch((error) => { //  jika error
      res.status(400).json({ //  kirim response dengan status 400
        status: "error", //  status error
        message: error.message, //  pesan error
      });
    });
});

// endpoint get data by id
app.get("/getById/:id", auth, async (req, res) => { // get data by id
  await user // user model
    .findByPk(req.params.id) // get data by id
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response dengan status 200
        status: "success", //  status success
        data: result, //  data result
      });
    })
    .catch((error) => { //  jika error
      res.status(400).json({ //  kirim response dengan status 400
        status: "error", //  status error
        message: error.message, //  pesan error
      });
    });
});

// endpoint register
app.post("/register", upload.single("foto"), async (req, res) => { // register
  const data = { // set data
    nama_user: req.body.nama_user,
    password: bcrypt.hashSync(req.body.password, 10),
    email: req.body.email,
    role: req.body.role,
    foto: req.file.filename,
    resultArr: {},
  };
  await user // user model
    .findAll({ // get all data
      where: { // where
        [Op.or]: [{ email: data.email }], // email
      },
    })
    .then((result) => { // jika berhasil
      resultArr = result; // set resultArr
      if (resultArr.length > 0) { // jika resultArr lebih dari 0
        res.status(400).json({ // kirim response dengan status 400
          status: "error", // status error
          message: "email already exist", // pesan email already exist
        });
      } else { // jika tidak
        user // user model
          .create(data) // create data
          .then((result) => { // jika berhasil
            res.status(200).json({ // kirim response dengan status 200
              status: "success", // status success
              message: "user has been registered", // pesan user has been registered
              data: result, // data result
            });
          })
          .catch((error) => { // jika error
            res.status(400).json({ // kirim response dengan status 400
              status: "error", // status error
              message: error.message, // pesan error
            });
          });
      }
    });
});

// endpoint login
app.post("/login", async (req, res) => { // login
  const data = await user.findOne({ where: { email: req.body.email } }); // get data by email

  if (data) { // jika data ada
    const validPassword = await bcrypt.compare( // compare password
      req.body.password, // password yang diinput
      data.password // password yang ada di database
    );
    if (validPassword) { // jika validPassword true
      let payload = JSON.stringify(data); // set payload
      let token = jwt.sign(payload, SECRET_KEY); // set token
      res.status(200).json({ // kirim response dengan status 200
        status: "success", // status success
        logged: true, // logged true
        message: "valid password", // pesan valid password
        token: token, // token
        data: data, // data
      });
    } else { // jika tidak
      res.status(400).json({ // kirim response dengan status 400
        status: "error", // status error
        message: "invalid Password", // pesan invalid Password
      });
    }
  } else { // jika tidak
    res.status(400).json({ // kirim response dengan status 400
      status: "error", // status error
      message: "user does not exist",   // pesan user does not exist
    });
  }
});

// endpoint delete
app.delete("/delete/:id_user", auth, async (req, res) => { // delete
  const param = { id_user: req.params.id_user }; // set param
  user.findOne({ where: param }).then((result) => { // get data by id
    let oldFileName = result.foto; // set oldFileName
    let dir = path.join(__dirname, "../public/images/user/", oldFileName); // set dir
    fs.unlink(dir, (err) => err); // delete file
  });
  user // user model
    .destroy({ where: param }) // delete data
    .then((result) => { // jika berhasil
      res.json({ // kirim response
        status: "success", // status success
        message: "user has been deleted", // pesan user has been deleted
        data: param, // data param
      });
    })
    .catch((error) => { // jika error
      res.json({ // kirim response
        status: "error", // status error
        message: error.message, // pesan error
      });
    });
});

// endpoint edit
app.patch("/edit/:id_user", auth, upload.single("foto"), async (req, res) => { // edit
  const param = { id_user: req.params.id_user }; // set param
  const data = { // set data
    nama_user: req.body.nama_user,
    password: req.body.password,
    email: req.body.email,
    role: req.body.role,
    resultArr: {},
  };
  if (req.file) { // jika ada file
    user.findOne({ where: param }).then((result) => { // get data by id
      let oldFileName = result.foto; // set oldFileName
      let dir = path.join(__dirname, "../public/images/user/", oldFileName); // set dir
      fs.unlink(dir, (err) => err); // delete file
    });
    data.foto = req.file.filename; // set foto
  }
  if (data.password) { // jika password ada
    const salt = await bcrypt.genSalt(10); // set salt
    data.password = await bcrypt.hash(data.password, salt);   // set password
  }

  if (data.email) { // jika email ada
    user // user model
      .findAll({ // get all data
        where: { // where
          [Op.or]: [{ email: data.email }], // email
        },
      })
      .then((result) => { // jika berhasil
        resultArr = result; // set resultArr
        if (resultArr.length > 0) { // jika resultArr lebih dari 0
          res.status(400).json({ // kirim response dengan status 400
            status: "error",  // status error
            message: "email already exist", // pesan email already exist
          });
        }
      });
  }
  user // user model
    .update(data, { where: param }) // update data
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response dengan status 200
        status: "success", // status success
        message: "user has been updated", // pesan user has been updated
        data: { // data
          id_user: param.id_user,
          nama_user: data.nama_user,
          email: data.email,
          role: data.role,
          foto: data.foto,
        },
      });
    })
    .catch((error) => { // jika error
      res.status(400).json({ // kirim response dengan status 400
        status: "error", // status error
        message: error.message, // pesan error
      });
    });
});

// endpoint search
app.get("/search/:nama_user", auth, async (req, res) => { // search
  user // user model
    .findAll({ // get all data
      where: { // where
        [Op.or]: [ // or
          { nama_user: { [Op.like]: "%" + req.params.nama_user + "%" } }, // nama_user
        ],
      },
    })
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response dengan status 200
        status: "success", // status success
        message: "user has been found", // pesan user has been found
        data: result, // data result
      });
    })
    .catch((error) => { // jika error
      res.status(400).json({ // kirim response dengan status 400
        status: "error",  // status error
        message: error.message, // pesan error
      });
    });
});

module.exports = app; // export app
