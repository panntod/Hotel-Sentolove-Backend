const express = require("express");
const { Op } = require("sequelize");
const auth = require("../auth");

const app = express();

const model = require("../models/index");
const detail_pemesanan = model.detail_pemesanan;

app.get("/getAllData", auth, async (req, res) => {
  await detail_pemesanan
    .findAll({
      include: [
        {
          model: model.kamar,
          as: "kamar",
        },
        {
          model: model.pemesanan,
          as: "pemesanan",
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
  await detail_pemesanan
    .findByPk(req.params.id, {
      include: [
        {
          model: model.kamar,
          as: "kamar",
        },
        {
          model: model.pemesanan,
          as: "pemesanan",
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
    id_pemesanan: req.body.id_pemesanan,
    id_kamar: req.body.id_kamar,
    tgl_akses: req.body.tgl_akses,
    harga: req.body.harga,
    check_in: req.body.check_in,
    check_out: req.body.check_out,
  };
  await detail_pemesanan
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

app.delete("/delete/:id_detail_pemesanan", auth, async (req, res) => {
  const param = { id_detail_pemesanan: req.params.id_detail_pemesanan };
  detail_pemesanan
    .destroy({ where: param })
    .then((result) => {
      if (result) {
        res.status(200).json({
          status: "success",
          message: "detail pemesanan has been deleted",
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

app.patch("/edit/:id_detail_pemesanan", auth, async (req, res) => {
  const param = { id_detail_pemesanan: req.params.id_detail_pemesanan };
  const data = {
    id_pemesanan: req.body.id_pemesanan,
    id_kamar: req.body.id_kamar,
    tgl_akses: req.body.tgl_akses,
    harga: req.body.harga,
  };

  detail_pemesanan.findOne({ where: param }).then((result) => {
    if (result) {
      detail_pemesanan
        .update(data, { where: param })
        .then((result) => {
          res.status(200).json({
            status: "success",
            message: "data has been updated",
            data: {
              id_detail_pemesanan: param.id_detail_pemesanan,
              id_pemesanan: data.id_pemesanan,
              id_kamar: data.id_kamar,
              tgl_akses: data.tgl_akses,
              harga: data.harga,
            },
          });
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
});

app.get("/search/:id_kamar", auth, async (req, res) => {
  detail_pemesanan
    .findAll({
      where: {
        id_kamar: {
          [Op.like]: "%" + req.params.id_kamar + "%",
        },
      },
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "result of nomor kamar " + req.params.id_kamar + "",
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
