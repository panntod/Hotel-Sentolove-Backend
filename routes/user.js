const express = require("express");
const bcrypt = require("bcrypt");
const app = express();
const user = require("../models/index").user;

const { Op, ForeignKeyConstraintError } = require("sequelize");
const auth = require("../middleware/auth");
const jwt = require("jsonwebtoken");

const multer = require("multer");
const path = require("path");
const fs = require("fs").promises;

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
    .findAll({
      order: [["createdAt", "ASC"]],
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "Yeaayyy! Berhasil mendapatkan semua data user",
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

app.get("/getById/:id", auth, async (req, res) => {
  await user
    .findByPk(req.params.id)
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "Yeaayyy! Berhasil mendapatkan data",
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

app.post("/register", upload.single("foto"), validateUser, async (req, res) => {
  if (!req.file)
    return res.status(400).json({
      status: "error",
      message: "Oooops! Pastikan format image sesuai",
    });

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
        message: "Yeaayyy! Berhasil mendaftar",
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

  res.cookie("sentolove/token", token, {
    httpOnly: true,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({
    status: "success",
    message: "Yeaayyy! Berhasil login",
    token: token,
    data: data,
  });
});

app.delete("/delete/:id_user", auth, checkRole(["admin"]), async (req, res) => {
  const params = { id_user: req.params.id_user };

  try {
    const dataUser = await user.findOne({ where: params });

    if (!dataUser) {
      return res.status(404).json({
        status: "error",
        message: "Oooops! Data user tidak ditemukan",
      });
    }

    await user.destroy({ where: params });

    let oldFileName = dataUser.foto;
    let pathImage = path.join(__dirname, "../public/user/", oldFileName);

    try {
      await fs.access(pathImage);
      await fs.unlink(pathImage);
    } catch (err) {
      console.error(`Oooops! Gagal menghapus file gambar ${pathImage}: ${err}`);
    }

    res.json({
      status: "success",
      message: "Yeaayyy! Berhasil menghapus data",
    });
  } catch (error) {
    if (error instanceof ForeignKeyConstraintError) {
      return res.status(400).json({
        status: "error",
        message: "Oooops! Data user tidak bisa dihapus karena sedang digunakan",
      });
    }

    return res.status(500).json({
      status: "error",
      message: "Ooooops! Terjadi kesalahan pada server",
      error: error.message,
    });
  }
});

app.patch("/edit/:id_user", auth, upload.single("foto"), async (req, res) => {
  const param = { id_user: req.params.id_user };
  const data = {
    nama_user: req.body?.nama_user,
    email: req.body?.email,
    role: req.body?.role,
  };

  try {
    const dataUser = await user.findOne({ where: param });

    if (req.file) {
      let oldFileName = dataUser.foto;
      let pathImage = path.join(__dirname, "../public/user/", oldFileName);
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

    if (req.body.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(req.body.password, salt);
    }

    if (data.email) {
      const checkEmail = await user.findOne({ where: { email: data.email } });
      if (checkEmail) {
        return res.status(400).json({
          status: "error",
          message: "Oooops! Email sudah terdaftar",
        });
      }
    }

    await user.update(data, { where: param });
    res.status(201).json({
      status: "success",
      message: "Yeayyy! Berhasil mengubah data user",
      data: data,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Oooops! Terjadi kesalahan pada server",
      error: error.message,
    });
  }
});

app.get("/search/:nama_user", auth, async (req, res) => {
  user
    .findAll({
      where: { nama_user: { [Op.substring]: req.params.nama_user } },
      order: [["createdAt", "ASC"]],
    })
    .then((result) => {
      if (result.length === 0) {
        return res.status(404).json({
          status: "error",
          message: "Oooops! Data user tidak ditemukan",
        });
      }

      res.status(200).json({
        status: "success",
        message: "Yeaayyy! Berhasil mendapatkan data",
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
