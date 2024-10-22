const express = require("express");
const {
  Op,
  ForeignKeyConstraintError,
  literal,
  fn,
  col,
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
        message: error.message,
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
          message: "Berhasil menambahkan data",
          data: result,
        });
      })
      .catch((error) => {
        res.status(400).json({
          status: "error",
          message: error.message,
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
            message: "room has been deleted",
            data: param,
          });
        }
      })
      .catch((error) => {
        if (error instanceof ForeignKeyConstraintError) {
          res.status(400).json({
            status: "error",
            message:
              "Tidak bisa menghapus data ini, karena masih terdapat relasi dengan data lain",
          });
        }

        res.status(400).json({
          status: "error",
          message: error.message,
        });
      });
  },
);

app.patch("/edit/:id_kamar", auth, checkRole(["admin"]), async (req, res) => {
  const param = { id_kamar: req.params.id_kamar };
  const data = {
    nomor_kamar: req.body.nomor_kamar,
    id_tipe_kamar: req.body.id_tipe_kamar,
  };

  kamar.findOne({ where: param }).then((result) => {
    if (result) {
      if (data.nomor_kamar != null) {
        kamar
          .findOne({ where: { nomor_kamar: data.nomor_kamar } })
          .then((result) => {
            if (result) {
              res.status(400).json({
                status: "error",
                message: "Nomor kamar sudah terpakai",
              });
            } else {
              kamar
                .update(data, { where: param })
                .then((result) => {
                  res.status(200).json({
                    status: "success",
                    message: "Berhasil mengubah data",
                    data: {
                      id_kamar: param.id_kamar,
                      nomor_kamar: data.nomor_kamar,
                      id_tipe_kamar: data.id_tipe_kamar,
                    },
                  });
                })
                .catch((error) => {
                  res.status(400).json({
                    status: "error",
                    message: error.message,
                  });
                });
            }
          });
      } else {
        kamar
          .update(data, { where: param })
          .then((result) => {
            res.status(200).json({
              status: "success",
              message: "data has been updated",
              data: {
                id_kamar: param.id_kamar,
                nomor_kamar: data.nomor_kamar,
                id_tipe_kamar: data.id_tipe_kamar,
              },
            });
          })
          .catch((error) => {
            res.status(400).json({
              status: "error",
              message: error.message,
            });
          });
      }
    } else {
      res.status(404).json({
        status: "error",
        message: "Data tidak ditemukan",
      });
    }
  });
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
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "result of nomor kamar " + req.params.nomor_kamar,
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
        message: "result of tipe kamar " + req.params.id_tipe_kamar,
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
            AND dp.tgl_akses BETWEEN '${tgl1}' AND '${tgl2}')`,
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
        message: "Tidak ada kamar yang tersedia di antara tanggal itu",
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
      data: responseData,
      message: "Berhasil mendapatkan data tipe kamar yang tersedia",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
    });
  }
});

module.exports = app;
