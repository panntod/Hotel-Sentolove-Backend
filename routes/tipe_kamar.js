const express = require("express");
const { Op, ForeignKeyConstraintError } = require("sequelize");
const auth = require("../middleware/auth");
const app = express();

const model = require("../models/index");
const tipe_kamar = model.tipe_kamar;

const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;
const { validateTipeKamar } = require("../middleware/validation/tipe_kamar");
const { checkRole } = require("../middleware/check_role");

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "./public/tipe_kamar");
  },
  filename: (_, file, cb) => {
    cb(null, "img-" + Date.now() + path.extname(file.originalname));
  },
});

let upload = multer({ storage: storage });

app.get("/getAllData", async (req, res) => {
  await tipe_kamar
    .findAll({
      order: [["createdAt", "ASC"]],
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "Yeaayyy! Berhasil mendapatkan semua data tipe kamar",
        data: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: "Ooooops! Terjadi kesalahan pada server",
        error: error.message,
      });
    });
});

app.get("/getById/:id", async (req, res) => {
  await tipe_kamar
    .findByPk(req.params.id)
    .then((result) => {
      if (result) {
        res.status(200).json({
          status: "success",
          message: "Yeaayyy! Berhasil mendapatkan data",
          data: result,
        });
      } else {
        res.status(404).json({
          status: "error",
          message: "Ooooops! Data tidak ditemukan",
        });
      }
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: "Ooooops! Terjadi kesalahan pada server",
        error: error.message,
      });
    });
});

app.post(
  "/create",
  auth,
  checkRole(["admin"]),
  upload.single("foto"),
  validateTipeKamar,
  async (req, res) => {
    if (!req.file) {
      return res.status(400).json({
        status: "error",
        message: "Oooops! Pastikan mengupload file foto dengan benar",
      });
    }
    const data = {
      nama_tipe_kamar: req.body.nama_tipe_kamar,
      harga: req.body.harga,
      deskripsi: req.body.deskripsi,
      foto: req.file.filename,
    };
    await tipe_kamar
      .create(data)
      .then((result) => {
        res.status(200).json({
          status: "success",
          message: "Yeayyy! Berhasil menambahkan data tipe kamar",
          data: result,
        });
      })
      .catch((error) => {
        res.status(400).json({
          status: "error",
          message: "Oooops! Terjadi kesalahan pada server",
          error: error.message,
        });
      });
  },
);

app.delete(
  "/delete/:id_tipe_kamar",
  auth,
  checkRole(["admin"]),
  async (req, res) => {
    const param = { id_tipe_kamar: req.params.id_tipe_kamar };

    try {
      const dataTipeKamar = await tipe_kamar.findOne({ where: param });

      if (!dataTipeKamar) {
        return res.status(404).json({
          status: "error",
          message: "Oooops! Data tidak ditemukan",
        });
      }

      await tipe_kamar.destroy({ where: param });

      let oldFileName = dataTipeKamar.foto;
      let pathImage = path.join(
        __dirname,
        "../public/tipe_kamar/",
        oldFileName,
      );

      try {
        await fs.access(pathImage);
        await fs.unlink(pathImage);
      } catch (err) {
        console.error(
          `Oooops! Gagal menghapus file gambar ${pathImage}: ${err}`,
        );
      }

      return res.status(200).json({
        status: "success",
        message: "Yeayyy! Berhasil menghapus data",
        data: param,
      });
    } catch (error) {
      if (error instanceof ForeignKeyConstraintError) {
        return res.status(400).json({
          status: "error",
          message:
            "Oooops! Data ini tidak bisa dihapus karena sedang digunakan",
        });
      }

      res.status(500).json({
        status: "error",
        message: "Ooooops! Terjadi kesalahan pada server",
        error: error.message,
      });
    }
  },
);

app.patch(
  "/edit/:id_tipe_kamar",
  auth,
  checkRole(["admin"]),
  upload.single("foto"),
  async (req, res) => {
    const param = { id_tipe_kamar: req.params.id_tipe_kamar };
    const data = {
      nama_tipe_kamar: req.body.nama_tipe_kamar,
      harga: req.body.harga,
      deskripsi: req.body.deskripsi,
    };

    try {
      const dataTipeKamar = await tipe_kamar.findOne({ where: param });

      if (req.file) {
        let oldFileName = dataTipeKamar.foto;
        let pathImage = path.join(
          __dirname,
          "../public/tipe_kamar/",
          oldFileName,
        );
        try {
          await fs.access(pathImage);
          await fs.unlink(pathImage);
        } catch (err) {
          console.error(
            `Oooops! Gagal menghapus file gambar ${pathImage}: ${err}`,
          );
        }
        data.foto = req.file.filename;
      }

      await tipe_kamar.update(data, { where: param });
      return res.status(201).json({
        status: "success",
        message: "Yeayyy! Berhasil mengubah data tipe kamar",
        data: data,
      });
    } catch (error) {
      return res.status(500).json({
        status: "error",
        message: "Oooops! Terjadi kesalahan pada server",
        error: error.message,
      });
    }
  },
);

app.get("/search/:nama_tipe_kamar", async (req, res) => {
  tipe_kamar
    .findAll({
      where: {
        nama_tipe_kamar: {
          [Op.substring]: req.params.nama_tipe_kamar,
        },
      },
      order: [["createdAt", "ASC"]],
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message:
          "Yeaayyy! Berhasil mendapatkan tipe dengan nama: " +
          req.params.nama_tipe_kamar,
        data: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: "Ooooops! Terjadi kesalahan pada server",
        error: error.message,
      });
    });
});

module.exports = app;
