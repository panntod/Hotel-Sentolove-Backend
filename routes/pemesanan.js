const express = require("express");
const { Op } = require("sequelize");
const auth = require("../auth");

const app = express();

const model = require("../models/index");
const pemesanan = model.pemesanan;

app.get("/getAllData", auth, async (req, res) => {
  await pemesanan
    .findAll({
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
        },
        {
          model: model.user,
          as: "user",
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

app.get("/getById/:id", auth, async (req, res) => {
  await pemesanan
    .findByPk(req.params.id, {
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
        },
        {
          model: model.user,
          as: "user",
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

app.get("/getByIdUser/:id_user", auth, async (req, res) => {
  await pemesanan
    .findAll({
      where: { id_user: req.params.id_user },
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
        },
        {
          model: model.user,
          as: "user",
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

app.post("/create", async (req, res) => {
  const data = {
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
  await pemesanan
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

app.delete("/delete/:id_pemesanan", auth, async (req, res) => {
  const param = { id_pemesanan: req.params.id_pemesanan };
  pemesanan
    .destroy({ where: param })
    .then((result) => {
      if (result) {
        res.status(200).json({
          status: "success",
          message: "pemesanan has been deleted",
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

app.patch("/edit/:id_pemesanan", auth, async (req, res) => {
  const param = { id_pemesanan: req.params.id_pemesanan };
  const data = {
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

  pemesanan.findOne({ where: param }).then((result) => {
    if (data.status_pemesanan == "check_out") {
      model.detail_pemesanan
        .findAll({
          where: { id_pemesanan: req.params.id_pemesanan },
        })
        .then((result) => {
          model.kamar
            .update(
              {
                check_in: null,
                check_out: null,
              },
              {
                where: {
                  id_kamar: result[0].id_kamar,
                },
              },
            )
            .then((result) => {
              console.log("kamar updated");
            })
            .catch((error) => {
              console.log(error.message);
            });
        });
    }
    pemesanan
      .update(data, { where: param })
      .then((result) => {
        res.status(200).json({
          status: "success",
          message: "pemesanan has been updated",
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
});

app.get("/search/:nama_tamu", auth, async (req, res) => {
  pemesanan
    .findAll({
      where: {
        [Op.or]: [
          {
            nama_tamu: {
              [Op.like]: "%" + req.params.nama_tamu + "%",
            },
          },
        ],
      },
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
        },
        {
          model: model.user,
          as: "user",
        },
      ],
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "result of nama tamu " + req.params.nama_tamu + "",
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

app.post("/searchByEmailAndNumber", auth, async (req, res) => {
  pemesanan
    .findAll({
      where: {
        email_pemesan: req.body.email,
        nomor_pemesanan: req.body.nomor_pemesanan,
      },
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
        },
        {
          model: model.user,
          as: "user",
        },
      ],
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message:
          "result of email pemesan " +
          req.params.email_pemesan +
          " and nomor pemesanan " +
          req.params.nomor_pemesanan +
          "",
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

app.get("/filter/check_in/:tgl_check_in", auth, async (req, res) => {
  const tgl_check_in = req.params.tgl_check_in.slice(0, 10);
  pemesanan
    .findAll({
      where: {
        tgl_check_in: {
          [Op.between]: [
            tgl_check_in + " 00:00:00",
            tgl_check_in + " 23:59:59",
          ],
        },
      },
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
        },
        {
          model: model.user,
          as: "user",
        },
      ],
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "result of tgl check in " + req.params.tgl_check_in + "",
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
