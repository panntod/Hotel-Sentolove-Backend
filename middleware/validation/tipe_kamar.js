const Joi = require("joi");
const model = require("../../models");

const tipeKamarSchema = Joi.object({
  nama_tipe_kamar: Joi.string().required().messages({
    "string.base": "Ooooops! Nama tipe kamar harus berupa teks",
    "string.empty": "Ooooops! Nama tipe kamar tidak boleh kosong",
    "any.required": "Ooooops! Nama tipe kamar wajib diisi",
  }),
  harga: Joi.number().min(0).required().messages({
    "number.base": "Ooooops! Harga harus berupa angka",
    "number.min": "Ooooops! Harga tidak boleh kurang dari 0",
    "number.empty": "Ooooops! Harga tidak boleh kosong",
    "any.required": "Ooooops! Harga wajib diisi",
  }),
  deskripsi: Joi.string().required().messages({
    "string.base": "Ooooops! Deskripsi harus berupa teks",
    "string.empty": "Ooooops! Deskripsi tidak boleh kosong",
    "any.required": "Ooooops! Deskripsi wajib diisi",
  }),
});

exports.validateTipeKamar = async (req, res, next) => {
  const { error } = tipeKamarSchema.validate(req.body);
  if (error) {
    const message = error.details.map((item) => item.message).join(" ");
    return res.status(400).json({ status: "error", message: message });
  }

  const isNewName = await model.tipe_kamar.findOne({
    where: { nama_tipe_kamar: req.body.nama_tipe_kamar },
  });

  if (isNewName) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "Ooooops! Nama tipe kamar sudah digunakan",
      });
  }

  next();
};
