const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const user = require("../models/index").user;

const { Op, ForeignKeyConstraintError } = require("sequelize");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const path = require("path");
const fs = require("fs");

const SECRET_KEY = process.env.SECRET_KEY;
const { checkRole } = require("../middleware/check_role");
const {
  validateUser,
  validateUserLogin,
} = require("../middleware/validation/user");

const storage = multer.diskStorage({
  destination: (_, __, cb) => {
    cb(null, "./public/user");
  },
  filename: (_, file, cb) => {
    cb(null, "img-" + Date.now() + path.extname(file.originalname));
  },
});

let upload = multer({ storage: storage });

app.get("/getAllData", auth, checkRole(["admin"]), async (req, res) => {
  await user
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
  await user
    .findByPk(req.params.id)
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

app.post("/register", upload.single("foto"), validateUser, async (req, res) => {
  if (!req.file)
    return res
      .status(400)
      .json({ status: "error", message: "Please select image" });

  const data = {
    nama_user: req.body.nama_user,
    password: bcrypt.hashSync(req.body.password, 10),
    email: req.body.email,
    role: req.body.role,
    foto: req.file.filename,
  };

  user
    .create(data)
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "Berhasil mendaftar",
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

app.post("/login", validateUserLogin, async (req, res) => {
  const data = {
    nama_user: req.validUser.nama_user,
    email: req.validUser.email,
    role: req.validUser.role,
    foto: req.validUser.foto,
    id_user: req.validUser.id_user,
  };
  let payload = JSON.stringify(data);
  let token = jwt.sign(payload, SECRET_KEY);
  res.status(200).json({
    status: "success",
    logged: true,
    message: "Berhasil login",
    token: token,
    data: data,
  });
});

app.delete("/delete/:id_user", auth, checkRole(["admin"]), async (req, res) => {
  try {
    const params = { id_user: req.params.id_user };
    const dataUser = await user.findOne({
      where: params,
    });

    if (!dataUser) {
      return res.status(404).json({
        status: "error",
        message: "User tidak ditemukan",
      });
    }

    await user.destroy({ where: params });

    let oldFileName = dataUser.foto;
    let dir = path.join(__dirname, "../public/images/user/", oldFileName);

    fs.unlink(dir, (err) => {
      if (err) {
        console.error("Gagal menghapus file gambar:", err);
      }
    });

    res.json({
      status: "success",
      message: "Berhasil menghapus data",
    });
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return res.status(400).json({
        status: "error",
        message:
          "Tidak bisa menghapus data ini, karena masih terdapat relasi dengan data lain",
      });
    }

    return res.status(500).json({
      status: "error",
      message: error.message,
    });
  }
});

app.patch("/edit/:id_user", auth, upload.single("foto"), async (req, res) => {
  const param = { id_user: req.params.id_user };
  const data = {
    nama_user: req.body.nama_user,
    password: req.body.password,
    email: req.body.email,
    role: req.body.role,
  };
  if (req.file) {
    user.findOne({ where: param }).then((result) => {
      let oldFileName = result.foto;
      let dir = path.join(__dirname, "../public/images/user/", oldFileName);
      fs.unlink(dir, (err) => err);
    });
    data.foto = req.file.filename;
  }
  if (data.password) {
    const salt = await bcrypt.genSalt(10);
    data.password = await bcrypt.hash(data.password, salt);
  }

  if (data.email) {
    user
      .findAll({
        where: {
          email: data.email,
        },
      })
      .then((result) => {
        if (result.length > 0) {
          res.status(400).json({
            status: "error",
            message: "Email sudah terdaftar",
          });
        }
      });
  }
  user
    .update(data, { where: param })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "Berhasil mengupdate data",
        data: {
          id_user: param.id_user,
          nama_user: data.nama_user,
          email: data.email,
          role: data.role,
          foto: data.foto,
        },
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message: error.message,
      });
    });
});

app.get("/search/:nama_user", auth, async (req, res) => {
  user
    .findAll({
      where: { nama_user: { [Op.substring]: req.params.nama_user } },
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "Berhasil mendapatkan data",
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
