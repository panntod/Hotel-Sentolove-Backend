const Joi = require("joi");
const model = require("../../models");
const bcrypt = require("bcrypt");

const userSchema = Joi.object({
  nama_user: Joi.string().required().messages({
    "string.empty": "Nama user tidak boleh kosong",
    "any.required": "Nama user wajib diisi",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Format email tidak valid",
    "string.empty": "Email tidak boleh kosong",
    "any.required": "Email wajib diisi",
  }),
  password: Joi.string().min(6).required().messages({
    "string.empty": "Password tidak boleh kosong",
    "string.min": "Password harus memiliki minimal 6 karakter",
    "any.required": "Password wajib diisi",
  }),
  role: Joi.string().valid("admin", "resepsionis", "tamu").required().messages({
    "any.only":
      "Role harus salah satu dari 'admin', 'resepsionis', atau 'tamu'",
    "any.required": "Role wajib diisi",
  }),
});

exports.validateUser = async (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const message = error.details.message;
    return res.status(400).json({ status: "error", message });
  }

  const isNewEmail = await model.user.findOne({
    where: { email: req.body.email },
  });

  if (isNewEmail) {
    return res
      .status(400)
      .json({ status: "error", message: "Email sudah digunakan" });
  }

  next();
};

const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Format email tidak valid",
    "string.empty": "Email tidak boleh kosong",
    "any.required": "Email wajib diisi",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Password tidak boleh kosong",
    "any.required": "Password wajib diisi",
  }),
});

exports.validateUserLogin = async (req, res, next) => {
  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    const message = error.details.message;
    return res.status(400).json({ status: "error", message });
  }

  const validUser = await model.user.findOne({
    where: { email: req.body.email },
  });

  if (!validUser) {
    return res
      .status(400)
      .json({ status: "error", message: "Kesalahan email atau password" });
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    validUser.password,
  );

  if (!validPassword) {
    return res
      .status(400)
      .json({ status: "error", message: "Kesalahan email atau password" });
  }

  next();
};
