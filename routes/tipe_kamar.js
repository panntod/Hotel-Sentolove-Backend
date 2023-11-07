const express = require("express"); // import express
const bodyParser = require("body-parser"); // import body-parser
const { Op } = require("sequelize"); // import sequelize
const auth = require("../auth"); // import auth

const app = express(); // create express app
app.use(bodyParser.json()); // parse request of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse request of content-type - application/x-www-form-urlencoded

const model = require("../models/index"); // import models
const tipe_kamar = model.tipe_kamar; // import tipe_kamar model

const multer = require("multer"); // import multer
const path = require("path"); // import path
const fs = require("fs"); // import fs

const storage = multer.diskStorage({ // set storage
  destination: (req, file, cb) => { // set destination
    cb(null, "./img/tipe_kamar"); // set destination
  },
  filename: (req, file, cb) => { // set filename
    cb(null, "img-" + Date.now() + path.extname(file.originalname)); // set filename
  },
});
let upload = multer({ storage: storage }); // set upload

// endpoint get all data
app.get("/getAllData", auth, async (req, res) => { // get all data
  await tipe_kamar // tipe kamar model
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
  await tipe_kamar // tipe kamar model
    .findByPk(req.params.id) // get data by id
    .then((result) => { // jika berhasil
      if (result) { // jika data ditemukan
        res.status(200).json({ // kirim response dengan status 200
          status: "success", // status success
          data: result, // data result
        });
      } else { // jika data tidak ditemukan
        res.status(404).json({ // kirim response dengan status 404
          status: "error", // status error
          message: "data not found", // pesan error
        });
      }
    })
    .catch((error) => { // jika error
      res.status(400).json({ // kirim response dengan status 400
        status: "error", // status error
        message: error.message, // pesan error
      });
    });
});

// endpoint cr
app.post("/create", upload.single("foto"), async (req, res) => { // create data
  const data = { // set data
    nama_tipe_kamar: req.body.nama_tipe_kamar,
    harga: req.body.harga,
    deskripsi: req.body.deskripsi,
    foto: req.file.filename,
    resultArr: {},
  };
  await tipe_kamar // tipe kamar model
    .create(data) // create data
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response dengan status 200
        status: "success", // status success
        message: "data has been inserted", // pesan berhasil
        data: result, // data result
      });
    })
    .catch((error) => { // jika error
      res.status(400).json({ // kirim response dengan status 400
        status: "error", // status error
        message: error.message, // pesan error
      });
    });
});

// endpoint update data
app.delete("/delete/:id_tipe_kamar", auth, async (req, res) => { // delete data
  const param = { id_tipe_kamar: req.params.id_tipe_kamar }; // set parameter
  tipe_kamar.findOne({ where: param }).then((result) => { // find data by id
    if (result) { // jika data ditemukan
      let oldFileName = result.foto; // set old file name
      let dir = path.join( // set directory
        __dirname,
        "../public/images/tipe kamar/",
        oldFileName
      );
      fs.unlink(dir, (err) => err); // delete file
    }
  });
  tipe_kamar // tipe kamar model
    .destroy({ where: param }) // delete data
    .then((result) => { // jika berhasil
      if (result) { // jika data ditemukan
        res.status(200).json({ // kirim response dengan status 200
          status: "success", // status success
          message: "type room has been deleted", // pesan berhasil
          data: param, // data parameter
        });
      } else { // jika data tidak ditemukan
        res.status(404).json({ // kirim response dengan status 404
          status: "error", // status error
          message: "data not found", // pesan error
        });
      }
    })
    .catch((error) => { // jika error
      res.status(400).json({ // kirim response dengan status 400
        status: "error", // status error
        message: error.message, // pesan error
      });
    });
});

// endpoint update data
app.patch( // update data
  "/edit/:id_tipe_kamar",
  auth, // auth
  upload.single("foto"), // upload file
  async (req, res) => { // async
    const param = { id_tipe_kamar: req.params.id_tipe_kamar }; // set parameter
    const data = { // set data
      nama_tipe_kamar: req.body.nama_tipe_kamar,
      harga: req.body.harga,
      deskripsi: req.body.deskripsi,
      resultArr: {},
    };

    tipe_kamar.findOne({ where: param }).then((result) => { // find data by id
      if (result) { // jika data ditemukan
        if (req.file) { // jika file ditemukan
          let oldFileName = result.foto; // set old file name
          let dir = path.join( // set directory
            __dirname,
            "../public/images/tipe kamar/",
            oldFileName
          );
          fs.unlink(dir, (err) => err); // delete file
          data.foto = req.file.filename; // set new file name
        }
        tipe_kamar // tipe kamar model
          .update(data, { where: param }) // update data
          .then((result) => { // jika berhasil
            if (result) { // jika data ditemukan 
              res.status(200).json({ // kirim response dengan status 200
                status: "success", // status success
                message: "data has been updated", // pesan berhasil
                data: { // data
                  id_tipe_kamar: param.id_tipe_kamar,
                  nama_tipe_kamar: data.nama_tipe_kamar,
                  harga: data.harga,
                  deskripsi: data.deskripsi,
                  foto: data.foto,
                },
              });
            } else { // jika data tidak ditemukan
              res.status(404).json({ // kirim response dengan status 404
                status: "error", // status error
                message: "data not found", // pesan error
              });
            }
          })
          .catch((error) => { // jika error
            res.status(400).json({ // kirim response dengan status 400
              status: "error", // status error
              message: error.message, // pesan error
            }); 
          });
      } else { // jika data tidak ditemukan
        res.status(404).json({ // kirim response dengan status 404
          status: "error", // status error
          message: "data not found", // pesan error
        });
      }
    });
  }
);

// endpoint search
app.get("/search/:nama_tipe_kamar", auth, async (req, res) => { // search data
  tipe_kamar // tipe kamar model
    .findAll({ // find all data
      where: { // where
        [Op.or]: [ // or
          {
            nama_tipe_kamar: { // nama tipe kamar
              [Op.between]: "%" + req.params.nama_tipe_kamar + "%", // between
            },
          },
        ],
      },
    })
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response dengan status 200
        status: "success", // status success
        message: "result of " + req.params.nama_tipe_kamar + "", // pesan berhasil
        data: result, // data result
      });
    })
    .catch((error) => { // jika error
      res.status(400).json({ // kirim response dengan status 400
        status: "error", // status error
        message: error.message, // pesan error
      });
    });
});

module.exports = app; // export app
