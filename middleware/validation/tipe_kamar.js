const Joi = require("joi");
const model = require("../../models");

const tipeKamarSchema = Joi.object({
  nama_tipe_kamar: Joi.string().required().messages({
    "string.base": "Nama tipe kamar harus berupa teks",
    "string.empty": "Nama tipe kamar tidak boleh kosong",
    "any.required": "Nama tipe kamar wajib diisi",
  }),
  tipe_kamar: Joi.string().required().messages({
    "string.base": "Tipe kamar harus berupa teks",
    "string.empty": "Tipe kamar tidak boleh kosong",
    "any.required": "Tipe kamar wajib diisi",
  }),
  harga: Joi.number().required().messages({
    "number.base": "Harga harus berupa angka",
    "number.empty": "Harga tidak boleh kosong",
    "any.required": "Harga wajib diisi",
  }),
  deskripsi: Joi.string().required().messages({
    "string.base": "Deskripsi harus berupa teks",
    "string.empty": "Deskripsi tidak boleh kosong",
    "any.required": "Deskripsi wajib diisi",
  }),
});

exports.validateTipeKamar = async (req, res, next) => {
  const { error } = tipeKamarSchema.validate(req.body);
  if (error) {
    const message = error.details.message;
    return res.status(400).json({ status: "error", message });
  }

  const isNewName = await model.tipe_kamar.findOne({
    where: { nama_tipe_kamar: req.body.nama_tipe_kamar },
  });

  if (isNewName) {
    return res
      .status(400)
      .json({ status: "error", message: "Nama tipe kamar sudah digunakan" });
  }

  next();
};
