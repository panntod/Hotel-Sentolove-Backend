-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Oct 24, 2024 at 11:09 AM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hotel`
--

-- --------------------------------------------------------

--
-- Table structure for table `detail_pemesanan`
--

CREATE TABLE `detail_pemesanan` (
  `id_detail_pemesanan` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `id_pemesanan` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `id_kamar` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `tgl_akses` datetime DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `kamar`
--

CREATE TABLE `kamar` (
  `id_kamar` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nomor_kamar` int(5) DEFAULT NULL,
  `id_tipe_kamar` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kamar`
--

INSERT INTO `kamar` (`id_kamar`, `nomor_kamar`, `id_tipe_kamar`, `createdAt`, `updatedAt`) VALUES
('0ed7411e-6f8d-4671-8973-538a52850e88', 1, '9e149573-4fcc-4e10-89e9-5ea8f275207e', '2024-10-24 03:40:17', '2024-10-24 03:40:17'),
('13170f4a-a714-4698-9fe9-7b6f9a4b8459', 22, '46b3405f-28d0-421e-a1b2-2fc1bf6ede5b', '2024-10-24 03:43:21', '2024-10-24 03:43:21'),
('261d5d1e-5c9f-48b5-8912-2e3865922891', 3, '9e149573-4fcc-4e10-89e9-5ea8f275207e', '2024-10-24 03:40:27', '2024-10-24 03:40:27'),
('26b7a838-b0c4-4258-b140-83f41868a1c0', 21, '46b3405f-28d0-421e-a1b2-2fc1bf6ede5b', '2024-10-24 03:43:15', '2024-10-24 03:43:15'),
('2a566c4a-5c1f-4123-9f22-66eca4504e13', 13, 'e26ef6aa-2d22-4c02-b485-70fbe15ede68', '2024-10-24 03:43:10', '2024-10-24 03:43:10'),
('64e63b34-35e6-49a8-b442-ff4daee9d0f5', 11, 'e26ef6aa-2d22-4c02-b485-70fbe15ede68', '2024-10-24 03:43:00', '2024-10-24 03:43:00'),
('6889e445-a6c5-4708-8574-220fca44ecfd', 23, '46b3405f-28d0-421e-a1b2-2fc1bf6ede5b', '2024-10-24 03:43:26', '2024-10-24 03:43:26'),
('b7127959-7bec-4ac9-8b7f-623a23df8499', 12, 'e26ef6aa-2d22-4c02-b485-70fbe15ede68', '2024-10-24 03:43:04', '2024-10-24 03:43:04'),
('be508dde-8020-4a53-ae30-cea991f4c2c0', 2, '9e149573-4fcc-4e10-89e9-5ea8f275207e', '2024-10-24 03:40:22', '2024-10-24 03:40:22');

-- --------------------------------------------------------

--
-- Table structure for table `pemesanan`
--

CREATE TABLE `pemesanan` (
  `id_pemesanan` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nomor_pemesanan` varchar(50) DEFAULT NULL,
  `nama_pemesan` varchar(100) DEFAULT NULL,
  `email_pemesan` varchar(100) DEFAULT NULL,
  `tgl_pemesanan` timestamp NOT NULL DEFAULT current_timestamp(),
  `tgl_check_in` datetime DEFAULT NULL,
  `tgl_check_out` datetime DEFAULT NULL,
  `nama_tamu` varchar(100) DEFAULT NULL,
  `jumlah_kamar` int(11) DEFAULT NULL,
  `id_tipe_kamar` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL,
  `status_pemesanan` enum('baru','check_in','check_out') DEFAULT NULL,
  `id_user` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `sequelizemeta`
--

CREATE TABLE `sequelizemeta` (
  `name` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8 COLLATE=utf8_unicode_ci;

--
-- Dumping data for table `sequelizemeta`
--

INSERT INTO `sequelizemeta` (`name`) VALUES
('20230116111226-create-user.js'),
('20230116111801-create-tipe-kamar.js'),
('20230116111946-create-kamar.js'),
('20230116112106-create-pemesanan.js'),
('20230116112844-create-detail-pemesanan.js');

-- --------------------------------------------------------

--
-- Table structure for table `tipe_kamar`
--

CREATE TABLE `tipe_kamar` (
  `id_tipe_kamar` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nama_tipe_kamar` varchar(100) DEFAULT NULL,
  `harga` int(11) DEFAULT NULL,
  `deskripsi` text DEFAULT NULL,
  `foto` text DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tipe_kamar`
--

INSERT INTO `tipe_kamar` (`id_tipe_kamar`, `nama_tipe_kamar`, `harga`, `deskripsi`, `foto`, `createdAt`, `updatedAt`) VALUES
('46b3405f-28d0-421e-a1b2-2fc1bf6ede5b', 'Standard Room', 600000, 'Kamar tipe ini dibanderol dengan harga yang relatif murah. Fasilitas yang ditawarkan pun standar seperti kasur ukuran king size atau dua queen size. Namun, penawaran yang diberikan tergantung pada masing-masing hotel.', 'img-1729741119859.jpg', '2024-10-24 03:38:39', '2024-10-24 03:38:39'),
('9e149573-4fcc-4e10-89e9-5ea8f275207e', 'Deluxe Room', 900000, 'Kamar ini tentu memiliki kamar yang lebih besar. Tersedia pilihan kasur yang bisa kamu pilih, double bed atau twin bed. Biasanya, dari segi interior kamar ini terkesan lebih mewah.', 'img-1729741163407.webp', '2024-10-24 03:39:23', '2024-10-24 03:39:23'),
('e26ef6aa-2d22-4c02-b485-70fbe15ede68', 'Suite Room', 700000, 'Ruang tamu di kamar hotel ini terpisah dari kamar tidur. Dari segi fasilitas, tentu berbeda dari junior suite room. Selain ruang tamu, biasanya tipe kamar hotel ini dilengkapi dengan dapur.', 'img-1729741204308.jpg', '2024-10-24 03:40:04', '2024-10-24 03:40:04');

-- --------------------------------------------------------

--
-- Table structure for table `user`
--

CREATE TABLE `user` (
  `id_user` char(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_bin NOT NULL,
  `nama_user` varchar(100) DEFAULT NULL,
  `foto` text DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `password` text DEFAULT NULL,
  `role` enum('admin','resepsionis','tamu') DEFAULT NULL,
  `createdAt` datetime NOT NULL,
  `updatedAt` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `user`
--

INSERT INTO `user` (`id_user`, `nama_user`, `foto`, `email`, `password`, `role`, `createdAt`, `updatedAt`) VALUES
('10577da7-7f53-4b0d-9d94-ec1e4436e7e6', 'customer', 'img-1729740995333.png', 'customer@gmail.com', '$2b$10$ryMOO/cEgHNE2tjzZDFw8eAgLHn4GwEXz3Wwo..1kFsRPY/nWPV/K', 'tamu', '2024-10-24 02:24:52', '2024-10-24 03:36:35'),
('cb60b791-cb92-4544-bed5-33123e02324a', 'admin', 'img-1729740988589.png', 'admin@gmail.com', '$2b$10$qEScPibkpEUsiKiNUmSTCuMelgLLAoNfYRpPsuAmryRGYvbaR/ACu', 'admin', '2024-10-24 02:23:28', '2024-10-24 03:36:28'),
('f8f522b6-3d47-404c-92a4-f3571d6fe826', 'resepsionis', 'img-1729741002977.png', 'resepsionis@gmail.com', '$2b$10$RlGPSduz9KWU4f8fPPK0O.uY3LzAU0qNHRPS0qht73RajJERD7wie', 'resepsionis', '2024-10-24 03:03:05', '2024-10-24 03:36:42');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `detail_pemesanan`
--
ALTER TABLE `detail_pemesanan`
  ADD PRIMARY KEY (`id_detail_pemesanan`),
  ADD KEY `id_pemesanan` (`id_pemesanan`),
  ADD KEY `id_kamar` (`id_kamar`);

--
-- Indexes for table `kamar`
--
ALTER TABLE `kamar`
  ADD PRIMARY KEY (`id_kamar`),
  ADD KEY `id_tipe_kamar` (`id_tipe_kamar`);

--
-- Indexes for table `pemesanan`
--
ALTER TABLE `pemesanan`
  ADD PRIMARY KEY (`id_pemesanan`),
  ADD KEY `id_tipe_kamar` (`id_tipe_kamar`),
  ADD KEY `id_user` (`id_user`);

--
-- Indexes for table `sequelizemeta`
--
ALTER TABLE `sequelizemeta`
  ADD PRIMARY KEY (`name`),
  ADD UNIQUE KEY `name` (`name`);

--
-- Indexes for table `tipe_kamar`
--
ALTER TABLE `tipe_kamar`
  ADD PRIMARY KEY (`id_tipe_kamar`);

--
-- Indexes for table `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`id_user`);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `detail_pemesanan`
--
ALTER TABLE `detail_pemesanan`
  ADD CONSTRAINT `detail_pemesanan_ibfk_1` FOREIGN KEY (`id_pemesanan`) REFERENCES `pemesanan` (`id_pemesanan`),
  ADD CONSTRAINT `detail_pemesanan_ibfk_2` FOREIGN KEY (`id_kamar`) REFERENCES `kamar` (`id_kamar`);

--
-- Constraints for table `kamar`
--
ALTER TABLE `kamar`
  ADD CONSTRAINT `kamar_ibfk_1` FOREIGN KEY (`id_tipe_kamar`) REFERENCES `tipe_kamar` (`id_tipe_kamar`);

--
-- Constraints for table `pemesanan`
--
ALTER TABLE `pemesanan`
  ADD CONSTRAINT `pemesanan_ibfk_1` FOREIGN KEY (`id_tipe_kamar`) REFERENCES `tipe_kamar` (`id_tipe_kamar`),
  ADD CONSTRAINT `pemesanan_ibfk_2` FOREIGN KEY (`id_user`) REFERENCES `user` (`id_user`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
