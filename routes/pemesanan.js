const express = require("express"); // import express
const bodyParser = require("body-parser"); // import body-parser
const { Op } = require("sequelize"); // import sequelize
const auth = require("../auth"); // import auth

const app = express(); // inisialisasi express
app.use(bodyParser.json()); // body parser
app.use(bodyParser.urlencoded({ extended: true })); // body parser

const model = require("../models/index"); // import model
const pemesanan = model.pemesanan; // inisialisasi model

// endpoint get all data
app.get("/getAllData", auth, async (req, res) => { // auth sebagai middleware
  await pemesanan // select * from pemesanan
    .findAll({ // find all data
      include: [ // include table lain
        {
          model: model.tipe_kamar, // table tipe_kamar
          as: "tipe_kamar", // alias
        },
        {
          model: model.user, // table user
          as: "user", // alias
        },
      ],
    })
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response dengan status 200
        status: "success", // status success
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

// endpoint get data by id
app.get("/getById/:id", auth, async (req, res) => { // auth sebagai middleware
  await pemesanan // select * from pemesanan
    .findByPk(req.params.id, { // find data by primary key
      include: [ // include table lain
        {
          model: model.tipe_kamar, // table tipe_kamar
          as: "tipe_kamar", // alias
        },
        {
          model: model.user, // table user
          as: "user", // alias
        },
      ],
    })
    .then((result) => { // jika berhasil
      if (result) { // jika data ditemukan
        res.status(200).json({ // kirim response dengan status 200
          status: "success", // status success
          data: result, // data result
        });
      } else { // jika data tidak ditemukan
        res.status(404).json({ // kirim response dengan status 404
          status: "error", // status error
          message: "data not found", // pesan data tidak ditemukan
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

// endpoint get data by id user
app.get("/getByIdUser/:id_user", auth, async (req, res) => { // auth sebagai middleware
  await pemesanan // select * from pemesanan
    .findAll({ // find all data
      where: { id_user: req.params.id_user }, // where id_user = id_user
      include: [ // include table lain
        {
          model: model.tipe_kamar, // table tipe_kamar
          as: "tipe_kamar", // alias
        },
        {
          model: model.user, // table user
          as: "user", // alias
        },
      ],
    })
    .then((result) => { // jika berhasil
      if (result) { // jika data ditemukan
        res.status(200).json({ // kirim response dengan status 200
          status: "success", // status success
          data: result, // data result
        });
      } else { // jika data tidak ditemukan
        res.status(404).json({ // kirim response dengan status 404
          status: "error", // status error
          message: "data not found", // pesan data tidak ditemukan
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

// endpoint buat data
app.post("/create", async (req, res) => { // auth sebagai middleware
  const data = { // data yang akan dimasukkan
    nomor_pemesanan: "PMS-" + Date.now(),
    nama_pemesan: req.body.nama_pemesan,
    email_pemesan: req.body.email_pemesan,
    tgl_check_in: req.body.tgl_check_in,
    tgl_check_out: req.body.tgl_check_out,
    nama_tamu: req.body.nama_tamu,
    jumlah_kamar: req.body.jumlah_kamar,
    id_tipe_kamar: req.body.id_tipe_kamar,
    id_user: req.body.id_user,
    status_pemesanan: req.body.status_pemesanan,
  };
  await pemesanan // insert into pemesanan
    .create(data) // create data
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response dengan status 200
        status: "success", // status success
        message: "data has been inserted", // pesan data berhasil dimasukkan
        data: result, // data result
      });
    })
    .catch((error) => { // jika error
      res.status(400).json({ // kirim response dengan status 400
        status: "error", // status error
        message: error.message,   // pesan error
      });
    });
});

// endpoint update data
app.delete("/delete/:id_pemesanan", auth, async (req, res) => { // auth sebagai middleware
  const param = { id_pemesanan: req.params.id_pemesanan }; // parameter
  pemesanan // delete from pemesanan
    .destroy({ where: param }) // where id_pemesanan = id_pemesanan
    .then((result) => { // jika berhasil
      if (result) { // jika data ditemukan
        res.status(200).json({ // kirim response dengan status 200
          status: "success", // status success
          message: "pemesanan has been deleted", // pesan data berhasil dihapus
          data: param, // data parameter
        });
      } else { // jika data tidak ditemukan
        res.status(404).json({ // kirim response dengan status 404
          status: "error", // status error
          message: "data not found", // pesan data tidak ditemukan
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
app.patch("/edit/:id_pemesanan", auth, async (req, res) => { // auth sebagai middleware
  const param = { id_pemesanan: req.params.id_pemesanan }; // parameter
  const data = { // data yang akan diubah
    nama_pemesan: req.body.nama_pemesan,
    email_pemesan: req.body.email_pemesan,
    tgl_check_in: req.body.tgl_check_in,
    tgl_check_out: req.body.tgl_check_out,
    nama_tamu: req.body.nama_tamu,
    jumlah_kamar: req.body.jumlah_kamar,
    id_tipe_kamar: req.body.id_tipe_kamar,
    id_user: req.body.id_user,
    status_pemesanan: req.body.status_pemesanan,
  };

  // cek status pemesanan
  pemesanan.findOne({ where: param }).then((result) => { // select * from pemesanan where id_pemesanan = id_pemesanan
    if (data.status_pemesanan == "check_out") { // jika status pemesanan = check_out
      model.detail_pemesanan // select * from detail_pemesanan
        .findAll({ // find all data
          where: { id_pemesanan: req.params.id_pemesanan }, // where id_pemesanan = id_pemesanan
        })
        .then((result) => { // jika berhasil
          model.kamar
            .update( // update kamar
              {
                check_in: null,
                check_out: null,
              },
              {
                where: { // where id_kamar = id_kamar
                  id_kamar: result[0].id_kamar, // id_kamar
                },
              }
            )
            .then((result) => { // jika berhasil
              console.log("kamar updated");
            })
            .catch((error) => { // jika error
              console.log(error.message);
            });
        });
    }
    pemesanan
      .update(data, { where: param }) // update pemesanan set data where id_pemesanan = id_pemesanan
      .then((result) => { // jika berhasil
        res.status(200).json({ // kirim response dengan status 200
          status: "success", // status success
          message: "pemesanan has been updated", // pesan data berhasil diubah
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
});

// endpoint search data
app.get("/search/:nama_tamu", auth, async (req, res) => { // auth sebagai middleware
  pemesanan // select * from pemesanan
    .findAll({ // find all data
      where: { // where nama_tamu like %nama_tamu%
        [Op.or]: [ // or
          {
            nama_tamu: { // nama_tamu
              [Op.like]: "%" + req.params.nama_tamu + "%", // like %nama_tamu%
            },
          },
        ],
      },
      include: [ // join table
        {
          model: model.tipe_kamar, // join table tipe_kamar
          as: "tipe_kamar",
        },
        {
          model: model.user, // join table user
          as: "user",
        },
      ],
    })
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response dengan status 200
        status: "success", // status success
        message: "result of nama tamu " + req.params.nama_tamu + "", // pesan hasil pencarian
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

// endpoint search data
app.post("/searchByEmailAndNumber", auth, async (req, res) => { // auth sebagai middleware
  pemesanan // select * from pemesanan
    .findAll({ // find all data
      where: { // where email_pemesan = email_pemesan and nomor_pemesanan = nomor_pemesanan
        email_pemesan: req.body.email,
        nomor_pemesanan: req.body.nomor_pemesanan,
      },
      include: [ // join table
        {
          model: model.tipe_kamar, // join table tipe_kamar
          as: "tipe_kamar",
        },
        {
          model: model.user, // join table user
          as: "user",
        },
      ],
    })
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response dengan status 200
        status: "success", // status success
        message: 
          "result of email pemesan " +
          req.params.email_pemesan +
          " and nomor pemesanan " +
          req.params.nomor_pemesanan +
          "",
        data: result,
      });
    })
    .catch((error) => { // jika error
      res.status(400).json({ // kirim response dengan status 400
        status: "error", // status error
        message: error.message, // pesan error
      });
    });
});

// endpoint filter data
app.get("/filter/check_in/:tgl_check_in", auth, async (req, res) => { // auth sebagai middleware
  const tgl_check_in = req.params.tgl_check_in.slice(0, 10); // ambil tanggal check in
  pemesanan // select * from pemesanan
    .findAll({ // find all data
      where: { // where tgl_check_in = tgl_check_in
        tgl_check_in: {
          [Op.between]: [
            tgl_check_in + " 00:00:00",
            tgl_check_in + " 23:59:59",
          ],
        },
      },
      include: [ // join table
        {
          model: model.tipe_kamar, // join table tipe_kamar
          as: "tipe_kamar", // as tipe_kamar
        },
        {
          model: model.user, // join table user
          as: "user", // as user
        },
      ],
    })
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response dengan status 200
        status: "success", // status success
        message: "result of tgl check in " + req.params.tgl_check_in + "", // pesan hasil filter
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
