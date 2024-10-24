const Joi = require("joi");

const pemesananSchema = Joi.object({
  nama_pemesan: Joi.string().required().messages({
    "string.base": "Ooooops! Nama pemesan harus berupa teks",
    "string.empty": "Ooooops! Nama pemesan tidak boleh kosong",
    "any.required": "Ooooops! Nama pemesan wajib diisi",
  }),
  email_pemesan: Joi.string().email().required().messages({
    "string.email": "Ooooops! Format email pemesan tidak valid",
    "string.empty": "Ooooops! Email pemesan tidak boleh kosong",
    "any.required": "Ooooops! Email pemesan wajib diisi",
  }),
  check_in: Joi.date().required().messages({
    "date.base": "Ooooops! Tanggal check-in harus berupa tanggal yang valid",
    "date.empty": "Ooooops! Tanggal check-in tidak boleh kosong",
    "any.required": "Ooooops! Tanggal check-in wajib diisi",
  }),
  check_out: Joi.date().required().messages({
    "date.base": "Ooooops! Tanggal check-out harus berupa tanggal yang valid",
    "date.empty": "Ooooops! Tanggal check-out tidak boleh kosong",
    "any.required": "Ooooops! Tanggal check-out wajib diisi",
  }),
  nama_tamu: Joi.string().required().messages({
    "string.base": "Ooooops! Nama tamu harus berupa teks",
    "string.empty": "Ooooops! Nama tamu tidak boleh kosong",
    "any.required": "Ooooops! Nama tamu wajib diisi",
  }),
  jumlah_kamar: Joi.number().integer().min(0).required().messages({
    "number.base": "Ooooops! Jumlah kamar harus berupa angka",
    "number.min": "Ooooops! Jumlah kamar tidak boleh kurang dari 0",
    "number.empty": "Ooooops! Jumlah kamar tidak boleh kosong",
    "any.required": "Ooooops! Jumlah kamar wajib diisi",
  }),
  tipe_kamar: Joi.string().required().messages({
    "string.base": "Ooooops! Nama tipe kamar harus berupa angka",
    "string.empty": "Ooooops! Nama tipe kamar tidak boleh kosong",
    "any.required": "Ooooops! Nama tipe kamar wajib diisi",
  }),
  status_pemesanan: Joi.string()
    .valid("baru", "check_in", "check_out")
    .required()
    .messages({
      "any.only":
        "Ooooops! Status pemesanan harus salah satu dari 'baru', 'check_in', atau 'check_out'",
      "any.required": "Ooooops! Status pemesanan wajib diisi",
    }),
  selectedDate: Joi.array(),
});

exports.validatePemesanan = async (req, res, next) => {
  const { error } = pemesananSchema.validate(req.body);
  if (error) {
    const message = error.details.map((item) => item.message).join(" ");
    return res.status(400).json({ status: "error", message: message });
  }

  next();
};
