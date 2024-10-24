const express = require("express");
const {
  Op,
  ForeignKeyConstraintError,
  literal,
  fn,
  col,
  or,
} = require("sequelize");
const auth = require("../middleware/auth");

const app = express();

const model = require("../models/index");
const { checkRole } = require("../middleware/check_role");
const { validateKamar } = require("../middleware/validation/kamar");
const kamar = model.kamar;

app.get("/getAllData", async (req, res) => {
  await kamar
    .findAll({
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
        },
      ],
      order: [["createdAt", "ASC"]],
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
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
  await kamar
    .findByPk(req.params.id, {
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
        },
      ],
      order: [["createdAt", "ASC"]],
    })
    .then((result) => {
      if (result) {
        res.status(200).json({
          status: "success",
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
  validateKamar,
  async (req, res) => {
    const data = {
      nomor_kamar: req.body.nomor_kamar,
      id_tipe_kamar: req.body.id_tipe_kamar,
    };

    kamar
      .create(data)
      .then((result) => {
        res.status(200).json({
          status: "success",
          message: "Yeaayyy! Berhasil menambahkan data",
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
  },
);

app.delete(
  "/delete/:id_kamar",
  auth,
  checkRole(["admin"]),
  async (req, res) => {
    const param = { id_kamar: req.params.id_kamar };
    kamar
      .destroy({ where: param })
      .then((result) => {
        if (result) {
          res.status(200).json({
            status: "success",
            message: "Yeaayyy! Berhasil menghapus data",
            data: param,
          });
        }
      })
      .catch((error) => {
        if (error instanceof ForeignKeyConstraintError) {
          res.status(400).json({
            status: "error",
            message:
              "Oooops! Data ini tidak bisa dihapus karena sedang digunakan",
          });
        }

        res.status(400).json({
          status: "error",
          message: "Ooooops! Terjadi kesalahan pada server",
          error: error.message,
        });
      });
  },
);

app.patch("/edit/:id_kamar", auth, checkRole(["admin"]), async (req, res) => {
  const { id_kamar } = req.params;
  const { nomor_kamar, id_tipe_kamar } = req.body;

  try {
    const kamarToUpdate = await kamar.findOne({ where: { id_kamar } });

    if (!kamarToUpdate) {
      return res.status(404).json({
        status: "error",
        message: "Oooops! Data tidak ditemukan",
      });
    }

    if (nomor_kamar) {
      const existingKamar = await kamar.findOne({ where: { nomor_kamar } });

      if (existingKamar && existingKamar.id_tipe_kamar === id_tipe_kamar) {
        return res.status(400).json({
          status: "error",
          message: "Oooops! Nomor kamar sudah digunakan",
        });
      }
    }

    await kamar.update({ nomor_kamar, id_tipe_kamar }, { where: { id_kamar } });

    return res.status(200).json({
      status: "success",
      message: "Yeeayy! Data berhasil diubah",
      data: {
        id_kamar,
        nomor_kamar,
        id_tipe_kamar,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Ooooops! Terjadi kesalahan pada server",
      error: error.message,
    });
  }
});

app.get("/search/:nomor_kamar", async (req, res) => {
  kamar
    .findAll({
      where: {
        nomor_kamar: {
          [Op.substring]: req.params.nomor_kamar,
        },
      },
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
        },
      ],
      order: [["createdAt", "ASC"]],
    })
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "Oooops! Data kamar tidak ditemukan",
        });
      }

      return res.status(200).json({
        status: "success",
        message:
          "Yeaayyy! Berhasil mendapatkan kamar dengan nomor: " +
          req.params.nomor_kamar,
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

app.get("/getByTipeKamar/:id_tipe_kamar", async (req, res) => {
  kamar
    .findAll({
      where: {
        id_tipe_kamar: req.params.id_tipe_kamar,
      },
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
        },
      ],
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message:
          "Yeaayyy! Berhasil mendapatkan data dengan tipe: " +
          req.params.id_tipe_kamar,
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

app.get("/getTipeKamarAvailable/:tgl1/:tgl2", async (req, res) => {
  const { tgl1, tgl2 } = req.params;

  try {
    const result = await kamar.findAll({
      where: {
        id_kamar: {
          [Op.notIn]: literal(
            `(SELECT id_kamar from detail_pemesanan as dp
            JOIN pemesanan as p ON p.id_pemesanan = dp.id_pemesanan
            WHERE p.status_pemesanan != 'check_out'
            AND (
              (p.tgl_check_in BETWEEN '${tgl1}' AND '${tgl2}')
              OR (p.tgl_check_out BETWEEN '${tgl1}' AND '${tgl2}')
            )
            )`,
          ),
        },
      },
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
        },
      ],
      attributes: [
        [fn("DISTINCT", col("tipe_kamar.id_tipe_kamar")), "id_tipe_kamar"],
      ],
      group: ["tipe_kamar.id_tipe_kamar"],
    });

    if (result.length === 0) {
      return res.json({
        status: "success",
        data: [],
        message: "Oooops! Tidak ada kamar yang tersedia",
      });
    }

    const responseData = result.map((item) => ({
      id_tipe_kamar: item.dataValues.id_tipe_kamar,
      nama_tipe_kamar: item.tipe_kamar.nama_tipe_kamar,
      harga: item.tipe_kamar.harga,
      deskripsi: item.tipe_kamar.deskripsi,
      foto: item.tipe_kamar.foto,
    }));

    return res.json({
      status: "success",
      message: "Yeaayyy! Berhasil mendapatkan data",
      data: responseData,
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
});

module.exports = app;
