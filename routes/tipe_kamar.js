const express = require("express");
const { Op } = require("sequelize");
const auth = require("../auth");

const app = express();

const model = require("../models/index");
const tipe_kamar = model.tipe_kamar;

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "./public/tipe_kamar");
  },
  filename: (_, file, cb) => {
    cb(null, "img-" + Date.now() + path.extname(file.originalname));
  },
});
let upload = multer({ storage: storage });

app.get("/getAllData", auth, async (req, res) => {
  await tipe_kamar
    .findAll()
    .then((result) => {
      res.status(200).json({
        status: "success",
        data: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

app.get("/getById/:id", auth, async (req, res) => {
  await tipe_kamar
    .findByPk(req.params.id)
    .then((result) => {
      if (result) {
        res.status(200).json({
          status: "success",
          data: result,
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "data not found",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

app.post("/create", upload.single("foto"), async (req, res) => {
  const data = {
    nama_tipe_kamar: req.body.nama_tipe_kamar,
    harga: req.body.harga,
    deskripsi: req.body.deskripsi,
    foto: req.file.filename,
    resultArr: {},
  };
  await tipe_kamar
    .create(data)
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "data has been inserted",
        data: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

app.delete("/delete/:id_tipe_kamar", auth, async (req, res) => {
  const param = { id_tipe_kamar: req.params.id_tipe_kamar };
  tipe_kamar.findOne({ where: param }).then((result) => {
    if (result) {
      let oldFileName = result.foto;
      let dir = path.join(
        __dirname,
        "../public/images/tipe kamar/",
        oldFileName
      );
      fs.unlink(dir, (err) => err);
    }
  });
  tipe_kamar
    .destroy({ where: param })
    .then((result) => {
      if (result) {
        res.status(200).json({
          status: "success",
          message: "type room has been deleted",
          data: param,
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "data not found",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

app.patch(
  "/edit/:id_tipe_kamar",
  auth,
  upload.single("foto"),
  async (req, res) => {
    const param = { id_tipe_kamar: req.params.id_tipe_kamar };
    const data = {
      nama_tipe_kamar: req.body.nama_tipe_kamar,
      harga: req.body.harga,
      deskripsi: req.body.deskripsi,
      resultArr: {},
    };

    tipe_kamar.findOne({ where: param }).then((result) => {
      if (result) {
        if (req.file) {
          let oldFileName = result.foto;
          let dir = path.join(
            __dirname,
            "../public/images/tipe kamar/",
            oldFileName
          );
          fs.unlink(dir, (err) => err);
          data.foto = req.file.filename;
        }
        tipe_kamar
          .update(data, { where: param })
          .then((result) => {
            if (result) {
              res.status(200).json({
                status: "success",
                message: "data has been updated",
                data: {
                  id_tipe_kamar: param.id_tipe_kamar,
                  nama_tipe_kamar: data.nama_tipe_kamar,
                  harga: data.harga,
                  deskripsi: data.deskripsi,
                  foto: data.foto,
                },
              });
            } else {
              res.status(404).json({
                status: "error",
                message: "data not found",
              });
            }
          })
          .catch((error) => {
            res.status(400).json({
              status: "error",
              message: error.message,
            });
          });
      } else {
        res.status(404).json({
          status: "error",
          message: "data not found",
        });
      }
    });
  }
);

app.get("/search/:nama_tipe_kamar", auth, async (req, res) => {
  tipe_kamar
    .findAll({
      where: {
        [Op.or]: [
          {
            nama_tipe_kamar: {
              [Op.between]: "%" + req.params.nama_tipe_kamar + "%",
            },
          },
        ],
      },
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "result of " + req.params.nama_tipe_kamar + "",
        data: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

module.exports = app;
