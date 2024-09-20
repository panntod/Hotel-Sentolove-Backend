const express = require("express");
const { Op } = require("sequelize");
const auth = require("../auth");

const app = express();

const model = require("../models/index");
const kamar = model.kamar;

app.get("/getAllData", auth, async (req, res) => {
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

app.get("/getById/:id", auth, async (req, res) => {
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

app.post("/create", async (req, res) => {
  const data = {
    nomor_kamar: req.body.nomor_kamar,
    id_tipe_kamar: req.body.id_tipe_kamar,
  };
  await kamar
    .findOne({ where: { nomor_kamar: data.nomor_kamar } })
    .then((result) => {
      if (result) {
        res.status(400).json({
          status: "error",
          message: "nomor kamar already exist",
        });
      } else {
        kamar
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
      }
    });
});

app.delete("/delete/:id_kamar", auth, async (req, res) => {
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

app.patch("/edit/:id_kamar", auth, async (req, res) => {
  const param = { id_kamar: req.params.id_kamar };
  const data = {
    nomor_kamar: req.body.nomor_kamar,
    id_tipe_kamar: req.body.id_tipe_kamar,
    check_in: req.body.check_in,
    check_out: req.body.check_out,
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
                message: "nomor kamar already exist",
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
        message: "data not found",
      });
    }
  });
});

app.get("/search/:nomor_kamar", auth, async (req, res) => {
  kamar
    .findAll({
      where: {
        [Op.or]: [
          {
            nomor_kamar: {
              [Op.like]: "%" + req.params.nomor_kamar + "%",
            },
          },
        ],
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
        message: "result of nomor kamar " + req.params.nomor_kamar + "",
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

app.get("/getByTipeKamar/:id_tipe_kamar", auth, async (req, res) => {
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
        message: "result of tipe kamar " + req.params.id_tipe_kamar + "",
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

app.get("/getByTipeKamarAvailable/:id_tipe_kamar", auth, async (req, res) => {
  kamar
    .findAll({
      where: {
        id_tipe_kamar: req.params.id_tipe_kamar,
        check_in: null,
        check_out: null,
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
        message: "result of tipe kamar " + req.params.id_tipe_kamar + "",
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

app.get(
  "/getTipeKamarAvailable/:check_in/:check_out",
  auth,
  async (req, res) => {
    kamar
      .findAll({
        where: {
          check_in: null,
          check_out: null,
        },
        include: [
          {
            model: model.tipe_kamar,
            as: "tipe_kamar",
          },
        ],
      })
      .then((result) => {
        const tipeKamarAvailable = result.map((item) => item.id_tipe_kamar);
        const uniqueTipeKamarAvailable = [...new Set(tipeKamarAvailable)];
        res.status(200).json({
          status: "success",
          message: "result of tipe kamar available",
          data: uniqueTipeKamarAvailable,
        });
      })
      .catch((error) => {
        res.status(400).json({
          status: "error",
          message: error.message,
        });
      });
  }
);

app.get(
  "/getTipeKamarUnavailable/:check_in/:check_out",
  auth,
  async (req, res) => {
    kamar
      .findAll({
        where: {
          check_in: {
            [Op.between]: [req.params.check_in, req.params.check_out],
          },
          check_out: {
            [Op.between]: [req.params.check_in, req.params.check_out],
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
        kamar
          .findAll({
            where: {
              id_tipe_kamar: result.map((item) => item.id_tipe_kamar),
            },
            include: [
              {
                model: model.tipe_kamar,
                as: "tipe_kamar",
              },
            ],
          })
          .then((result) => {
            const tipeKamarAvailable = result.filter(
              (item) => item.check_in === null && item.check_out === null
            );
            const tipeKamarUnavailable = result.filter(
              (item) => item.check_in !== null && item.check_out !== null
            );
            const uniqueTipeKamarAvailable = [
              ...new Set(tipeKamarAvailable.map((item) => item.id_tipe_kamar)),
            ];
            const uniqueTipeKamarUnavailable = [
              ...new Set(
                tipeKamarUnavailable.map((item) => item.id_tipe_kamar)
              ),
            ];

            model.tipe_kamar.findAll().then((result) => {
              const tipeKamar = result.filter(
                (item) =>
                  !uniqueTipeKamarUnavailable.includes(item.id_tipe_kamar)
              );
              tipeKamar.push(
                ...result.filter((item) =>
                  uniqueTipeKamarAvailable.includes(item.id_tipe_kamar)
                )
              );

              res.status(200).json({
                status: "success",
                message: "result of tipe kamar available",
                data: tipeKamar,
              });
            });
          });
      })
      .catch((error) => {
        res.status(400).json({
          status: "error",
          message: error.message,
        });
      });
  }
);

module.exports = app;