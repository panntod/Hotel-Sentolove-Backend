const express = require("express");
const { Op, literal } = require("sequelize");
const auth = require("../auth");

const app = express();

const model = require("../models/index");
const moment = require("moment");

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
      order: [["id_pemesanan", "DESC"]],
    });

    if (result.length === 0) {
      return res.status(404).json({
        status: "error",
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
      order: [["id_pemesanan", "DESC"]],
    });

    if (result.length === 0) {
      return res.status(404).json({
        status: "error",
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
      order: [["id_pemesanan", "DESC"]],
    });

    if (result.length === 0) {
      return res.json({
        status: "success",
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
        message: "User yang anda inputkan tidak ada",
      });
    }

    const tgl_pemesanan = moment().format("YYYY-MM-DD");
    const date1 = moment(check_in);
    const date2 = moment(check_out);

    if (date2.isBefore(date1)) {
      return res.status(400).json({
        status: "error",
        message: "Masukkan tanggal yang benar",
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
        message: `Tidak ada tipe kamar dengan nama itu`,
      });
    }

    const availableRooms = await model.kamar.findAll({
      where: {
        id_tipe_kamar: tipeRoomCheck.id_tipe_kamar,
        id_kamar: {
          [Op.notIn]: literal(
            `(SELECT id_kamar from detail_pemesanan as dp
            JOIN pemesanan as p ON p.id_pemesanan = dp.id_pemesanan
            WHERE p.status_pemesanan != 'check_out'
            AND dp.tgl_akses BETWEEN '${check_in}' AND '${check_out}')`,
          ),
        },
      },
      attributes: ["nomor_kamar", "id_kamar", "id_tipe_kamar"],
    });

    if (availableRooms.length === 0) {
      return res.status(400).json({
        status: "error",
        message: `Kamar dengan tipe itu dan di tanggal itu sudah terbooking`,
      });
    }

    if (availableRooms.length < jumlah_kamar) {
      return res.status(400).json({
        status: "error",
        message: `Hanya ada ${availableRooms.length} kamar tersedia`,
      });
    }

    let randomRoom = availableRooms.map((room) => ({
      nomor_kamar: room.nomor_kamar,
      id_kamar: room.id_kamar,
    }));

    let selectedRooms = randomRoom.slice(0, jumlah_kamar);

    const checkType = await model.tipe_kamar.findOne({
      where: { id_tipe_kamar: availableRooms[0].id_tipe_kamar },
      attributes: [
        "id_tipe_kamar",
        "nama_tipe_kamar",
        "harga",
        "deskripsi",
        "foto",
      ],
    });

    const newData = {
      nomor_pemesanan: "PMS-" + Date.now(),
      nama_pemesan,
      email_pemesan,
      tgl_pemesanan,
      tgl_check_in: check_in,
      tgl_check_out: check_out,
      nama_tamu,
      jumlah_kamar,
      id_tipe_kamar: checkType.id_tipe_kamar,
      status_pemesanan: "baru",
      id_user: userData.id_user,
    };

    const nights = moment
      .duration(moment(check_out).diff(moment(check_in)))
      .asDays();

    const totalHarga = nights * checkType.harga * jumlah_kamar;
    const pemesanan = await model.pemesanan.create(newData);
    const pemesananID = pemesanan.id_pemesanan;

    for (let m = moment(check_in); m.isBefore(check_out); m.add(1, "days")) {
      const date = m.format("YYYY-MM-DD");

      const newDetail = selectedRooms.map((select) => ({
        id_pemesanan: pemesananID,
        id_kamar: select.id_kamar,
        tgl_akses: date,
        harga: totalHarga,
      }));

      await model.detail_pemesanan.bulkCreate(newDetail);
    }

    return res.json({
      status: "success",
      data: pemesanan,
      message: "Berhasil membuat transaksi",
    });
  } catch (error) {
    return res.status(400).json({
      status: "error",
      message: error.message,
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
        message: "Hasil berdasarkan nama tamu: " + req.params.nama_tamu,
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
      order: [["id_pemesanan", "DESC"]],
    });

    if (result.length === 0) {
      return res.status(404).json({
        status: "error",
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
        message: "result of tgl check in " + req.params.tgl_check_in + "",
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

app.patch("/edit/:id_pemesanan", auth, async (req, res) => {
  const param = { id_pemesanan: req.params.id_pemesanan };
  const { status_pemesanan } = req.body;

  model.pemesanan
    .update({ status_pemesanan: status_pemesanan }, { where: param })
    .then((result) => {
      res.status(200).json({
        status: "success",
        message: "Berhasil update data",
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
