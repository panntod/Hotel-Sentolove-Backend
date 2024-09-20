require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");

const PORT = process.env.PORT;

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true,
    credentials: true,
    allowedHeaders: "Content-Type, Authorization",
  })
);

const tipe_kamar = require("./routes/tipe_kamar");
const user = require("./routes/user");
const kamar = require("./routes/kamar");
const pemesanan = require("./routes/pemesanan");
const detail_pemesanan = require("./routes/detail_pemesanan");

app.use("/user", user);
app.use("/tipe_kamar", tipe_kamar);
app.use("/kamar", kamar);
app.use("/pemesanan", pemesanan);
app.use("/detail_pemesanan", detail_pemesanan);
app.use("/public", express.static(path.join(__dirname, "public")));

app.use("*", (req, res) => {
  res.status(404).json({ success: false, message: "Api tidak ditemukan" });
});

app.listen(PORT, () => {
  console.log("🚀 Server run on port http://localhost:" + PORT);
});

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error.message);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error.message);
});
