const Joi = require("joi");
const model = require("../../models");

const kamarSchema = Joi.object({
  nomor_kamar: Joi.number().required().messages({
    "number.base": "Ooooops! Nomor kamar harus berupa teks",
    "number.empty": "Ooooops! Nomor kamar tidak boleh kosong",
    "any.required": "Ooooops! Nomor kamar wajib diisi",
  }),
  id_tipe_kamar: Joi.string().guid({ version: "uuidv4" }).required().messages({
    "string.base": "Ooooops! Id tipe kamar harus sesuai",
    "string.empty": "Ooooops! Id tipe kamar tidak boleh kosong",
    "any.required": "Ooooops! Id tipe kamar wajib diisi",
    "string.guid": "Ooooops! Id tipe kamar harus berupa UUID",
  }),
});

exports.validateKamar = async (req, res, next) => {
  const { error } = kamarSchema.validate(req.body);

  if (error) {
    const message = error.details.map((item) => item.message).join(" ");
    return res.status(400).json({ status: "error", message: message });
  }

  const validTipeKamar = await model.tipe_kamar.findOne({
    where: { id_tipe_kamar: req.body.id_tipe_kamar },
  });

  if (!validTipeKamar) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "Ooooops! Tipe kamar tidak ditemukan",
      });
  }

  const isNewNomor = await model.kamar.findOne({
    where: { nomor_kamar: req.body.nomor_kamar },
  });

  if (isNewNomor) {
    return res
      .status(400)
      .json({
        status: "error",
        message: "Ooooops! Nomor kamar sudah digunakan",
      });
  }

  next();
};
