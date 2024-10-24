const express = require("express");
const { Op, literal } = require("sequelize");
const auth = require("../middleware/auth");

const app = express();

const model = require("../models/index");
const moment = require("moment");
const { validatePemesanan } = require("../middleware/validation/pemesanan");

const formatPemesananData = async (result) => {
  const data = await Promise.all(
    result.map(async (pemesanan) => {
      const id_kamar = pemesanan.detail_pemesanan.map(
        (kamar) => kamar.id_kamar,
      );

      const dataKamar = await model.kamar.findAll({
        where: {
          id_kamar: id_kamar,
        },
        attributes: ["nomor_kamar"],
        order: [["nomor_kamar", "ASC"]],
      });

      return {
        id_pemesanan: pemesanan.id_pemesanan,
        nomor_pemesanan: pemesanan.nomor_pemesanan,
        nama_pemesan: pemesanan.nama_pemesan,
        email_pemesan: pemesanan.email_pemesan,
        tgl_pemesanan: pemesanan.tgl_pemesanan,
        tgl_check_in: pemesanan.tgl_check_in,
        tgl_check_out: pemesanan.tgl_check_out,
        nama_tamu: pemesanan.nama_tamu,
        jumlah_kamar: pemesanan.jumlah_kamar,
        harga: pemesanan?.detail_pemesanan[0]?.harga,
        status_pemesanan: pemesanan.status_pemesanan,
        nama_user: pemesanan.user?.nama_user,
        foto: pemesanan?.tipe_kamar?.foto,
        nama_tipe_kamar: pemesanan.tipe_kamar?.nama_tipe_kamar,
        nomor_kamar: dataKamar.map((kamar) => kamar.nomor_kamar).join(", "),
      };
    }),
  );

  return data;
};

app.get("/getAllData", auth, async (req, res) => {
  try {
    const result = await model.pemesanan.findAll({
      attributes: [
        "id_pemesanan",
        "nama_pemesan",
        "nomor_pemesanan",
        "email_pemesan",
        "tgl_pemesanan",
        "tgl_check_in",
        "tgl_check_out",
        "nama_tamu",
        "jumlah_kamar",
        "status_pemesanan",
      ],
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
          attributes: ["nama_tipe_kamar", "foto"],
        },
        {
          model: model.user,
          as: "user",
          attributes: ["nama_user"],
          required: false,
        },
        {
          model: model.detail_pemesanan,
          as: "detail_pemesanan",
          attributes: ["id_kamar", "harga"],
        },
      ],
      order: [["tgl_pemesanan", "DESC"]],
    });

    if (result.length === 0) {
      return res.status(404).json({
        status: "error",
        data: [],
        message: "Data tidak ditemukan",
      });
    }

    const data = await formatPemesananData(result);

    return res.json({
      status: "success",
      data: data,
      message: "Berhasil mendapatkan data",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
});

app.get("/getById/:id", auth, async (req, res) => {
  try {
    const result = await model.pemesanan.findAll({
      where: { id_pemesanan: req.params.id },
      attributes: [
        "id_pemesanan",
        "nama_pemesan",
        "nomor_pemesanan",
        "email_pemesan",
        "tgl_pemesanan",
        "tgl_check_in",
        "tgl_check_out",
        "nama_tamu",
        "jumlah_kamar",
        "status_pemesanan",
      ],
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
          attributes: ["nama_tipe_kamar", "foto"],
        },
        {
          model: model.user,
          as: "user",
          attributes: ["nama_user"],
          required: false,
        },
        {
          model: model.detail_pemesanan,
          as: "detail_pemesanan",
          attributes: ["id_kamar", "harga"],
        },
      ],
      order: [["tgl_pemesanan", "DESC"]],
    });

    if (result.length === 0) {
      return res.status(404).json({
        status: "error",
        data: [],
        message: "Data tidak ditemukan",
      });
    }

    const data = await formatPemesananData(result);

    return res.json({
      status: "success",
      data: data,
      message: "Berhasil mendapatkan data",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Terjadi kesalahan pada server",
      error: error.message,
    });
  }
});

app.get("/getByIdUser/:id_user", auth, async (req, res) => {
  try {
    const result = await model.pemesanan.findAll({
      where: { id_user: req.params.id_user },
      attributes: [
        "id_pemesanan",
        "nama_pemesan",
        "nomor_pemesanan",
        "email_pemesan",
        "tgl_pemesanan",
        "tgl_check_in",
        "tgl_check_out",
        "nama_tamu",
        "jumlah_kamar",
        "status_pemesanan",
      ],
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
          attributes: ["nama_tipe_kamar", "foto"],
        },
        {
          model: model.user,
          as: "user",
          attributes: ["nama_user"],
          required: false,
        },
        {
          model: model.detail_pemesanan,
          as: "detail_pemesanan",
          attributes: ["id_kamar", "harga"],
        },
      ],
      order: [["tgl_pemesanan", "DESC"]],
    });

    if (result.length === 0) {
      return res.json({
        status: "success",
        data: [],
        message: "Oooops! Data masih kosong nih",
      });
    }

    const data = await formatPemesananData(result);

    return res.json({
      status: "success",
      data: data,
      message: "Yeaayyy! Berhasil mendapatkan data",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Ooooops! Terjadi kesalahan pada server",
      error: error.message,
    });
  }
});

app.post("/create", async (req, res) => {
  try {
    const {
      tipe_kamar,
      nama_pemesan,
      check_in,
      check_out,
      email_pemesan,
      nama_tamu,
      jumlah_kamar,
    } = req.body;

    const userData = await model.user.findOne({
      where: { email: email_pemesan },
    });

    if (!userData) {
      return res.status(400).json({
        status: "error",
        message: "Ooooops! Email tidak terdaftar",
      });
    }

    const tgl_pemesanan = moment();
    const date1 = moment(check_in);
    const date2 = moment(check_out);

    if (date2.isBefore(date1)) {
      return res.status(400).json({
        status: "error",
        message: "Ooooops! Masukkan tanggal check out yang benar",
      });
    }

    const tipeRoomCheck = await model.tipe_kamar.findOne({
      where: { nama_tipe_kamar: tipe_kamar },
      attributes: [
        "id_tipe_kamar",
        "nama_tipe_kamar",
        "harga",
        "deskripsi",
        "foto",
      ],
    });

    if (!tipeRoomCheck) {
      return res.status(400).json({
        status: "error",
        message: "Ooooops! Tipe kamar tidak ditemukan nih",
      });
    }

    const availableRooms = await model.kamar.findAll({
      where: {
        id_tipe_kamar: tipeRoomCheck.id_tipe_kamar,
        id_kamar: {
          [Op.notIn]: literal(`(
            SELECT id_kamar FROM detail_pemesanan AS dp
            JOIN pemesanan AS p ON p.id_pemesanan = dp.id_pemesanan
            WHERE p.status_pemesanan != 'check_out'
            AND (
              (p.tgl_check_in BETWEEN '${check_in}' AND '${check_out}')
              OR (p.tgl_check_out BETWEEN '${check_in}' AND '${check_out}')
            )
          )`),
        },
      },
      attributes: ["nomor_kamar", "id_kamar", "id_tipe_kamar"],
    });

    if (availableRooms.length === 0) {
      return res.status(400).json({
        status: "error",
        message: "Ooooops! Kamar tidak tersedia",
      });
    }

    if (availableRooms.length < jumlah_kamar) {
      return res.status(400).json({
        status: "error",
        message: `Ooooops! Hanya ada ${availableRooms.length} kamar yang tersedia`,
      });
    }

    let randomRoom = availableRooms.map((room) => ({
      nomor_kamar: room.nomor_kamar,
      id_kamar: room.id_kamar,
    }));

    let selectedRooms = randomRoom.slice(0, jumlah_kamar);

    const newData = {
      nomor_pemesanan: "PMS-" + Date.now(),
      nama_pemesan,
      email_pemesan,
      tgl_pemesanan,
      tgl_check_in: date1,
      tgl_check_out: date2,
      nama_tamu,
      jumlah_kamar,
      id_tipe_kamar: tipeRoomCheck.id_tipe_kamar,
      status_pemesanan: "baru",
      id_user: userData.id_user,
    };

    const nights = moment
      .duration(moment(check_out).diff(moment(check_in)))
      .asDays();

    const totalHarga = nights * tipeRoomCheck.harga * jumlah_kamar;
    const pemesanan = await model.pemesanan.create(newData);
    const pemesananID = pemesanan.id_pemesanan;

    for (let m = moment(check_in); m.isBefore(check_out); m.add(1, "days")) {
      const newDetail = selectedRooms.map((select) => ({
        id_pemesanan: pemesananID,
        id_kamar: select.id_kamar,
        harga: totalHarga,
      }));

      await model.detail_pemesanan.bulkCreate(newDetail);
    }

    return res.json({
      status: "success",
      data: pemesanan,
      message: "Yeaayyy! Berhasil menambahkan data",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: "Ooooops! Terjadi kesalahan pada server",
      error: error.message,
    });
  }
});

app.get("/search/:nama_tamu", auth, async (req, res) => {
  model.pemesanan
    .findAll({
      where: {
        nama_tamu: {
          [Op.substring]: req.params.nama_tamu,
        },
      },
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
        },
        {
          model: model.user,
          as: "user",
        },
      ],
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message:
          "Yeeaaayy! Berhasil mendapatkan data tamu dengan nama: " +
          req.params.nama_tamu,
        data: result,
      });
    })
    .catch((error) => {
      res.status(400).json({
        status: "error",
        message:
          "Ooooops! Tidak ada data tamu dengan nama: " + req.params.nama_tamu,
        error: error.message,
      });
    });
});

app.post("/searchByEmailAndNumber", auth, async (req, res) => {
  try {
    const result = await model.pemesanan.findAll({
      where: {
        email_pemesan: req.body.email,
        nomor_pemesanan: req.body.nomor_pemesanan,
      },
      attributes: [
        "id_pemesanan",
        "nama_pemesan",
        "nomor_pemesanan",
        "email_pemesan",
        "tgl_pemesanan",
        "tgl_check_in",
        "tgl_check_out",
        "nama_tamu",
        "jumlah_kamar",
        "status_pemesanan",
      ],
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
          attributes: ["nama_tipe_kamar", "foto"],
        },
        {
          model: model.user,
          as: "user",
          attributes: ["nama_user"],
          required: false,
        },
        {
          model: model.detail_pemesanan,
          as: "detail_pemesanan",
          attributes: ["id_kamar", "harga"],
        },
      ],
      order: [["tgl_pemesanan", "DESC"]],
    });

    if (result.length === 0) {
      return res.status(404).json({
        status: "error",
        message: "Ooooops! Data tidak ditemukan",
      });
    }

    const data = await formatPemesananData(result);

    return res.json({
      status: "success",
      data: data,
      message: "Yeaayyy! Berhasil mendapatkan data",
    });
  } catch (error) {
    return res.status(500).json({
      status: "error",
      message: "Ooooops! Terjadi kesalahan pada server",
      error: error.message,
    });
  }
});

app.get("/filter/check_in/:tgl_check_in", auth, async (req, res) => {
  const tgl_check_in = req.params.tgl_check_in.slice(0, 10);
  model.pemesanan
    .findAll({
      where: {
        tgl_check_in: {
          [Op.between]: [
            tgl_check_in + " 00:00:00",
            tgl_check_in + " 23:59:59",
          ],
        },
      },
      include: [
        {
          model: model.tipe_kamar,
          as: "tipe_kamar",
        },
        {
          model: model.user,
          as: "user",
        },
      ],
    })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "Hasil pencarian tangal: " + req.params.tgl_check_in,
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

app.patch("/edit/:id_pemesanan", auth, async (req, res) => {
  const param = { id_pemesanan: req.params.id_pemesanan };
  const { status_pemesanan } = req.body;

  model.pemesanan
    .update({ status_pemesanan: status_pemesanan }, { where: param })
    .then((_) => {
      if (status_pemesanan === "check_in") {
        model.detail_pemesanan.update(
          { tgl_akses: moment().format("YYYY-MM-DD HH:mm:ss") },
          { where: { id_pemesanan: req.params.id_pemesanan } },
        );
      }

      res.status(200).json({
        status: "success",
        message: "Yeaayyy! Berhasil mengubah status pemesanan",
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
