const express = require("express"); // import express
const bodyParser = require("body-parser"); // import body-parser
const { Op } = require("sequelize"); // import sequelize
const auth = require("../auth"); // import auth

const app = express(); // create express app
app.use(bodyParser.json()); // parse request of content-type - application/json
app.use(bodyParser.urlencoded({ extended: true })); // parse request of content-type - application/x-www-form-urlencoded

const model = require("../models/index"); // import models
const kamar = model.kamar; // import kamar model

// get all data
app.get("/getAllData", auth, async (req, res) => { // auth middleware
  await kamar // ambil semua data
    .findAll({ // find all
      include: [ // include table lain
        { 
          model: model.tipe_kamar, // include tipe_kamar
          as: "tipe_kamar", // alias tipe_kamar
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
  await kamar // ambil data berdasarkan id
    .findByPk(req.params.id, { // find by primary key
      include: [ // include table lain
        {
          model: model.tipe_kamar, // include tipe_kamar
          as: "tipe_kamar", // alias tipe_kamar
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
    .catch((error) => {  // jika error
      res.status(400).json({ // kirim response
        status: "error", // status error
        message: error.message, // pesan error
      });
    });
});

// create data
app.post("/create", async (req, res) => { // auth middleware
  const data = { // data yang akan diinput
    nomor_kamar: req.body.nomor_kamar, // ambil nomor_kamar dari body
    id_tipe_kamar: req.body.id_tipe_kamar, // ambil id_tipe_kamar dari body
  };
  await kamar // cek nomor kamar
    .findOne({ where: { nomor_kamar: data.nomor_kamar } }) // find one
    .then((result) => { // jika berhasil
      if (result) { // jika data ada
        res.status(400).json({ // kirim response
          status: "error", // status error
          message: "nomor kamar already exist", // pesan error
        });
      } else { // jika data tidak ada
        kamar // input data
          .create(data) // create
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
      }
    });
});

// delete data
app.delete("/delete/:id_kamar", auth, async (req, res) => { // auth middleware
  const param = { id_kamar: req.params.id_kamar }; // parameter
  kamar // hapus data
    .destroy({ where: param }) // destroy
    .then((result) => { // jika berhasil
      if (result) { // jika data ada
        res.status(200).json({ // kirim response
          status: "success", // status success
          message: "room has been deleted", // pesan
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

// update data
app.patch("/edit/:id_kamar", auth, async (req, res) => { // auth middleware
  const param = { id_kamar: req.params.id_kamar }; // parameter
  const data = { // data yang akan diupdate
    nomor_kamar: req.body.nomor_kamar, // ambil nomor_kamar dari body
    id_tipe_kamar: req.body.id_tipe_kamar, // ambil id_tipe_kamar dari body
    check_in: req.body.check_in, // ambil check_in dari body
    check_out: req.body.check_out, // ambil check_out dari body
  };

  kamar.findOne({ where: param }).then((result) => { // cek data
    if (result) { // jika data ada
      if (data.nomor_kamar != null) { // jika nomor kamar tidak kosong
        kamar // cek nomor kamar
          .findOne({ where: { nomor_kamar: data.nomor_kamar } }) // find one
          .then((result) => { // jika berhasil
            if (result) { // jika data ada
              res.status(400).json({ // kirim response
                status: "error", // status error
                message: "nomor kamar already exist", // pesan error
              });
            } else { // jika data tidak ada
              kamar // update data
                .update(data, { where: param }) // update
                .then((result) => { // jika berhasil
                  res.status(200).json({ // kirim response
                    status: "success", // status success
                    message: "data has been updated", // pesan
                    data: { // data
                      id_kamar: param.id_kamar, // id_kamar
                      nomor_kamar: data.nomor_kamar, // nomor_kamar
                      id_tipe_kamar: data.id_tipe_kamar, // id_tipe_kamar
                    },
                  });
                })
                .catch((error) => { // jika error
                  res.status(400).json({ // kirim response
                    status: "error", // status error
                    message: error.message, // pesan error
                  });
                });
            }
          });
      } else { // jika nomor kamar kosong
        kamar // update data
          .update(data, { where: param }) // update
          .then((result) => { // jika berhasil
            res.status(200).json({ // kirim response
              status: "success", // status success
              message: "data has been updated", // pesan
              data: { // data
                id_kamar: param.id_kamar, // id_kamar
                nomor_kamar: data.nomor_kamar, // nomor_kamar
                id_tipe_kamar: data.id_tipe_kamar, // id_tipe_kamar
              },
            });
          })
          .catch((error) => { // jika error
            res.status(400).json({ // kirim response
              status: "error", // status error
              message: error.message, // pesan error
            });
          });
      }
    } else { // jika data tidak ada
      res.status(404).json({ // kirim response
        status: "error", // status error
        message: "data not found", // pesan error
      });
    }
  });
});

// search data
app.get("/search/:nomor_kamar", auth, async (req, res) => { // auth middleware
  kamar // cari data
    .findAll({ // find all
      where: { // where
        [Op.or]: [ // or
          { 
            nomor_kamar: {
              [Op.like]: "%" + req.params.nomor_kamar + "%", // like %nomor_kamar%
            },
          },
        ],
      },
      include: [ // include
        {
          model: model.tipe_kamar, // model tipe_kamar
          as: "tipe_kamar", // alias tipe_kamar
        },
      ],
    })
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response
        status: "success", // status success
        message: "result of nomor kamar " + req.params.nomor_kamar + "", // pesan
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

// get all data
app.get("/getByTipeKamar/:id_tipe_kamar", auth, async (req, res) => { // auth middleware
  kamar // cari data
    .findAll({ // find all
      where: {
        id_tipe_kamar: req.params.id_tipe_kamar, // where id_tipe_kamar
      },
      include: [ // include
        {
          model: model.tipe_kamar, // model tipe_kamar
          as: "tipe_kamar", // alias tipe_kamar
        },
      ],
    })
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response
        status: "success", // status success
        message: "result of tipe kamar " + req.params.id_tipe_kamar + "", // pesan
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

// get all data
app.get("/getByTipeKamarAvailable/:id_tipe_kamar", auth, async (req, res) => { // auth middleware
  kamar // cari data
    .findAll({ // find all
      where: { // where
        id_tipe_kamar: req.params.id_tipe_kamar, // id_tipe_kamar
        check_in: null, // check_in
        check_out: null, // check_out
      },
      include: [ // include
        { // model tipe_kamar
          model: model.tipe_kamar, // model tipe_kamar
          as: "tipe_kamar", // alias tipe_kamar
        },
      ],
    })
    .then((result) => { // jika berhasil
      res.status(200).json({ // kirim response
        status: "success", // status success
        message: "result of tipe kamar " + req.params.id_tipe_kamar + "", // pesan
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

// get all data available date range check in and check out
app.get(
  "/getTipeKamarAvailable/:check_in/:check_out",
  auth,
  async (req, res) => { // auth middleware
    kamar // cari data
      .findAll({ // find all
        where: { // where
          check_in: null, // check_in
          check_out: null, // check_out
        },
        include: [ // include
          {
            model: model.tipe_kamar, // model tipe_kamar
            as: "tipe_kamar", // alias tipe_kamar
          },
        ],
      })
      .then((result) => { // jika berhasil
        const tipeKamarAvailable = result.map((item) => item.id_tipe_kamar); // ambil id_tipe_kamar
        const uniqueTipeKamarAvailable = [...new Set(tipeKamarAvailable)]; // ambil id_tipe_kamar yang unik
        res.status(200).json({ // kirim response
          status: "success", // status success
          message: "result of tipe kamar available", // pesan
          data: uniqueTipeKamarAvailable, // data
        });
      })
      .catch((error) => { // jika error
        res.status(400).json({ // kirim response
          status: "error", // status error
          message: error.message, // pesan error
        });
      });
  }
);

// get all data unavailable date range check in and check out
app.get( // get
  "/getTipeKamarUnavailable/:check_in/:check_out",
  auth, // auth middleware
  async (req, res) => { // async
    kamar // cari data
      .findAll({ // find all
        where: { // where
          check_in: { // check_in
            [Op.between]: [req.params.check_in, req.params.check_out], // between check_in
          },
          check_out: { // check_out
            [Op.between]: [req.params.check_in, req.params.check_out], // between check_out
          },
        },
        include: [ // include
          {
            model: model.tipe_kamar, // model tipe_kamar
            as: "tipe_kamar", // alias tipe_kamar
          },
        ],
      })
      .then((result) => { // jika berhasil
        kamar // cari data
          .findAll({ // find all
            where: { // where
              id_tipe_kamar: result.map((item) => item.id_tipe_kamar), // id_tipe_kamar
            },
            include: [ // include
              {
                model: model.tipe_kamar, // model tipe_kamar
                as: "tipe_kamar", // alias tipe_kamar
              },
            ],
          })
          .then((result) => { // jika berhasil
            const tipeKamarAvailable = result.filter( // filter
              (item) => item.check_in === null && item.check_out === null // check_in dan check_out null
            ); // filter
            const tipeKamarUnavailable = result.filter( // filter
              (item) => item.check_in !== null && item.check_out !== null // check_in dan check_out tidak null
            );
            const uniqueTipeKamarAvailable = [ // ambil id_tipe_kamar yang unik
              ...new Set(tipeKamarAvailable.map((item) => item.id_tipe_kamar)), // ambil id_tipe_kamar yang unik
            ];
            const uniqueTipeKamarUnavailable = [ // ambil id_tipe_kamar yang unik
              ...new Set( // ambil id_tipe_kamar yang unik
                tipeKamarUnavailable.map((item) => item.id_tipe_kamar) // ambil id_tipe_kamar yang unik
              ),
            ];

            model.tipe_kamar.findAll().then((result) => { // cari data
              const tipeKamar = result.filter( // filter
                (item) => 
                  !uniqueTipeKamarUnavailable.includes(item.id_tipe_kamar) // jika tidak ada di uniqueTipeKamarUnavailable
              );
              tipeKamar.push( // push
                ...result.filter((item) => // filter
                  uniqueTipeKamarAvailable.includes(item.id_tipe_kamar) // jika ada di uniqueTipeKamarAvailable
                )
              );

              res.status(200).json({ // kirim response
                status: "success",  // status success
                message: "result of tipe kamar available", // pesan
                data: tipeKamar, // data
              });
            });
          });
      })
      .catch((error) => { // jika error
        res.status(400).json({ // kirim response
          status: "error", // status error
          message: error.message, // pesan error
        });
      });
  }
);

module.exports = app; // export app
