const express = require("express"); // import express
const bodyParser = require("body-parser"); // import body-parser
const { Op } = require("sequelize"); // import sequelize
const auth = require("../auth"); // import auth

const app = express(); // create express app
app.use(bodyParser.json()); // parse request of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse request of content-type - application/x-www-form-urlencoded

const model = require("../models/index"); // import models
const detail_pemesanan = model.detail_pemesanan; // import detail_pemesanan model

// get all data
app.get("/getAllData", auth, async (req, res) => { // auth middleware
  await detail_pemesanan // ambil semua data
    .findAll({ // find all
      include: [ // include table lain
        {
          model: model.kamar, // include kamar
          as: "kamar", // alias kamar
        },
        {
          model: model.pemesanan, // include pemesanan
          as: "pemesanan", // alias pemesanan
        },
      ],
    })
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response
        status: "success", // status success
        data: result, // data
      });
    })
    .catch((error) => { // jika error
      res.status(400).json({ // kirim response
        status: "error", // status error
        message: error.message, // pesan error
      });
    });
});

// get data by id
app.get("/getById/:id", auth, async (req, res) => { // auth middleware
  await detail_pemesanan // ambil data berdasarkan id
    .findByPk(req.params.id, { // find by primary key
      include: [ // include table lain
        {
          model: model.kamar, // include kamar
          as: "kamar", // alias kamar
        },
        {
          model: model.pemesanan, // include pemesanan
          as: "pemesanan", // alias pemesanan
        },
      ],
    })
    .then((result) => { // jika berhasil
      if (result) { // jika data ada
        res.status(200).json({ // kirim response
          status: "success", // status success
          data: result, // data
        });
      } else { // jika data tidak ada
        res.status(404).json({ // kirim response
          status: "error", // status error
          message: "data not found", // pesan error
        });
      }
    })
    .catch((error) => { // jika error
      res.status(400).json({ // kirim response
        status: "error", // status error
        message: error.message, // pesan error
      });
    });
});

// get data by id pemesanan
app.post("/create", async (req, res) => { // auth middleware
  const data = { // data
    id_pemesanan: req.body.id_pemesanan, // ambil id pemesanan dari body
    id_kamar: req.body.id_kamar, // ambil id kamar dari body
    tgl_akses: req.body.tgl_akses, // ambil tgl akses dari body
    harga: req.body.harga, // ambil harga dari body
    check_in: req.body.check_in, // ambil check in dari body
    check_out: req.body.check_out, // ambil check out dari body
  };
  await detail_pemesanan // insert data
    .create(data) // create data
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response
        status: "success", // status success
        message: "data has been inserted", // pesan
        data: result, // data
      });
    })
    .catch((error) => { // jika error
      res.status(400).json({ // kirim response
        status: "error", // status error
        message: error.message, // pesan error
      });
    });
});

// get data by id pemesanan
app.delete("/delete/:id_detail_pemesanan", auth, async (req, res) => { // auth middleware
  const param = { id_detail_pemesanan: req.params.id_detail_pemesanan }; // parameter
  detail_pemesanan // delete data
    .destroy({ where: param }) // destroy data
    .then((result) => { // jika berhasil
      if (result) { // jika data ada
        res.status(200).json({ // kirim response
          status: "success", // status success
          message: "detail pemesanan has been deleted", // pesan
          data: param, // data
        });
      } else { // jika data tidak ada
        res.status(404).json({ // kirim response
          status: "error", // status error
          message: "data not found", // pesan error
        });
      }
    })
    .catch((error) => { // jika error
      res.status(400).json({ // kirim response
        status: "error", // status error
        message: error.message, // pesan error
      });
    });
});

// get data by id pemesanan
app.patch("/edit/:id_detail_pemesanan", auth, async (req, res) => { // auth middleware
  const param = { id_detail_pemesanan: req.params.id_detail_pemesanan }; // parameter
  const data = { // data
    id_pemesanan: req.body.id_pemesanan, // ambil id pemesanan dari body
    id_kamar: req.body.id_kamar, // ambil id kamar dari body
    tgl_akses: req.body.tgl_akses, // ambil tgl akses dari body
    harga: req.body.harga, // ambil harga dari body
  };

  detail_pemesanan.findOne({ where: param }).then((result) => { // cek data
    if (result) { // jika data ada
      detail_pemesanan // update data
        .update(data, { where: param }) // update data
        .then((result) => { // jika berhasil
          res.status(200).json({ // kirim response
            status: "success", // status success
            message: "data has been updated", // pesan
            data: { // data
              id_detail_pemesanan: param.id_detail_pemesanan, // id detail pemesanan
              id_pemesanan: data.id_pemesanan, // id pemesanan
              id_kamar: data.id_kamar, // id kamar
              tgl_akses: data.tgl_akses, // tgl akses
              harga: data.harga, // harga
            },
          });
        })
        .catch((error) => { // jika error
          res.status(400).json({ // kirim response
            status: "error", // status error
            message: error.message, // pesan error
          });
        });
    } else { // jika data tidak ada
      res.status(404).json({ // kirim response
        status: "error", // status error
        message: "data not found", // pesan error
      });
    }
  });
});

// get data by id pemesanan
app.get("/search/:id_kamar", auth, async (req, res) => { // auth middleware
  detail_pemesanan // select data
    .findAll({ // find all data
      where: { // where
        [Op.or]: [ // or
          { // where id kamar
            id_kamar: { // like
              [Op.like]: "%" + req.params.id_kamar + "%", // id kamar
            },
          },
        ],
      },
    })
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response
        status: "success", // status success
        message: "result of nomor kamar " + req.params.id_kamar + "", // pesan
        data: result, // data
      });
    })
    .catch((error) => { // jika error
      res.status(400).json({ // kirim response
        status: "error", // status error
        message: error.message, // pesan error
      });
    });
});

module.exports = app; // export app
