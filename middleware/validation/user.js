const Joi = require("joi");
const model = require("../../models");
const bcrypt = require("bcrypt");

const userSchema = Joi.object({
  nama_user: Joi.string().required().messages({
    "string.empty": "Ooooops! Nama user tidak boleh kosong",
    "any.required": "Ooooops! Nama user wajib diisi",
  }),
  email: Joi.string().email().required().messages({
    "string.email": "Ooooops! Format email tidak valid",
    "string.empty": "Ooooops! Email tidak boleh kosong",
    "any.required": "Ooooops! Email wajib diisi",
  }),
  password: Joi.string().min(8).required().messages({
    "string.empty": "Ooooops! Password tidak boleh kosong",
    "string.min": "Ooooops! Password harus memiliki minimal 8 karakter",
    "any.required": "Ooooops! Password wajib diisi",
  }),
  role: Joi.string().valid("admin", "resepsionis", "tamu").required().messages({
    "any.only":
      "Ooooops! Role harus salah satu dari 'admin', 'resepsionis', atau 'tamu'",
    "any.required": "Ooooops! Role wajib diisi",
  }),
});

exports.validateUser = async (req, res, next) => {
  const { error } = userSchema.validate(req.body);
  if (error) {
    const message = error.details.map((item) => item.message).join("");
    return res.status(400).json({ status: "error", message: message });
  }

  const isNewEmail = await model.user.findOne({
    where: { email: req.body.email },
  });

  if (isNewEmail) {
    return res
      .status(400)
      .json({ status: "error", message: "Ooooops! Email sudah terdaftar" });
  }

  next();
};

const userLoginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    "string.email": "Ooooops! Format email tidak valid",
    "string.empty": "Ooooops! Email tidak boleh kosong",
    "any.required": "Ooooops! Email wajib diisi",
  }),
  password: Joi.string().required().messages({
    "string.empty": "Ooooops! Password tidak boleh kosong",
    "any.required": "Ooooops! Password wajib diisi",
  }),
});

exports.validateUserLogin = async (req, res, next) => {
  const { error } = userLoginSchema.validate(req.body);
  if (error) {
    const message = error.details.map((item) => item.message).join(" ");
    return res.status(400).json({ status: "error", message: message });
  }

  const validUser = await model.user.findOne({
    where: { email: req.body.email },
  });

  if (!validUser) {
    return res
      .status(400)
      .json({ status: "error", message: "Ooooops! Email atau password salah" });
  }

  const validPassword = await bcrypt.compare(
    req.body.password,
    validUser.password,
  );

  if (!validPassword) {
    return res
      .status(400)
      .json({ status: "error", message: "Ooooops! Email atau password salah" });
  }

  req.validUser = validUser;
  next();
};
