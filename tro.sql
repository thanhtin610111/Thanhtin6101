-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 29, 2024 at 12:00 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `tro`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `user_admin` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `tenadmin` varchar(255) NOT NULL,
  `id_admin` int(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `admin`
--

INSERT INTO `admin` (`user_admin`, `password`, `tenadmin`, `id_admin`) VALUES
('admin', '123a456s', 'Anh Long', 1);

-- --------------------------------------------------------

--
-- Table structure for table `danhgia`
--

CREATE TABLE `danhgia` (
  `dg_id` int(11) NOT NULL,
  `danhgia` int(11) NOT NULL,
  `binhluan` text DEFAULT NULL,
  `thoigiandanhgia` datetime NOT NULL,
  `user_id` int(11) NOT NULL,
  `maphongtro` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `diachi`
--

CREATE TABLE `diachi` (
  `diachi_id` varchar(10) NOT NULL,
  `tendiachi` varchar(255) NOT NULL,
  `vm_id` varchar(10) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `diachi`
--

INSERT INTO `diachi` (`diachi_id`, `tendiachi`, `vm_id`) VALUES
('BD', 'Bình Dương', 'nam'),
('BN', 'Bắc Ninh', 'bac'),
('BT', 'Bến Tre', 'nam'),
('DN', 'Đà Nẵng', 'trung'),
('DNA', 'Đồng Nai', 'nam'),
('HCM', 'Thành phố Hồ Chí Minh', 'nam'),
('HN', 'Hà Nội', 'bac'),
('HY', 'Hưng Yên', 'bac'),
('KH', 'Khánh Hòa', 'trung'),
('NA', 'Nghệ An', 'trung'),
('TN', 'Thái Nguyên', 'bac'),
('TTH', 'Thừa Thiên Huế', 'trung');

-- --------------------------------------------------------

--
-- Table structure for table `hinhanh_phongtro`
--

CREATE TABLE `hinhanh_phongtro` (
  `id_hinhanh` int(11) NOT NULL,
  `ten_hinhanh` varchar(255) DEFAULT NULL,
  `maphongtro` int(11) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `phongtro`
--

CREATE TABLE `phongtro` (
  `maphongtro` int(11) NOT NULL,
  `tenphongtro` varchar(255) NOT NULL,
  `mota` text DEFAULT NULL,
  `diachicuthe` varchar(255) NOT NULL,
  `gia` float NOT NULL,
  `loaiphong` varchar(255) NOT NULL,
  `tienich` text NOT NULL,
  `soluong` int(11) NOT NULL,
  `thoigiandang` date NOT NULL,
  `user_id` int(11) NOT NULL,
  `diachi_id` varchar(10) NOT NULL,
  `vm_id` varchar(10) NOT NULL,
  `AnhBia` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `phongtro`
--

INSERT INTO `phongtro` (`maphongtro`, `tenphongtro`, `mota`, `diachicuthe`, `gia`, `loaiphong`, `tienich`, `soluong`, `thoigiandang`, `user_id`, `diachi_id`, `vm_id`, `AnhBia`) VALUES
(18, 'Phòng trọ An Nam', 'Cho thuê phòng giá rẻ cho sinh viên từ 2 - 4 người', '42/60 Vườn Lài , P.Phú Thọ Hòa , Q.Tân phú , TP.HCM', 2000000, 'Ghép', 'có sẵn máy lạnh , máy giặt', 4, '2021-12-24', 1, 'HCM', 'bac', '1735028403670.jpg'),
(20, 'Phòng trọ Bình An', 'Cho thuê phòng giá rẻ cho sinh viên từ 2 - 4 người', '29 Trường Sa, Quận Tân Bình , TP.HCM', 1500000, 'Ghép', 'có sẵn máy lạnh , máy giặt', 3, '2024-12-28', 1, 'HCM', 'bac', '1735365459026.jpg'),
(22, 'Nhà Trọ Hoàng Lan', 'Cho thuê phòng giá rẻ ', '30 Lạc Long Quân,  Q.Hoàn Kiếm , Hà Nội', 3000000, 'Đơn', 'có sẵn máy lạnh , máy giặt', 1, '2024-12-28', 1, 'HN', 'bac', '1735365630542.jpg'),
(24, 'Nhà Trọ Bình Minh', 'Cho thuê phòng giá rẻ ', '265 Hồ Học Lãm , Q8 , TPHCM', 1200000, 'Ghép', 'có sẵn máy lạnh , máy giặt', 6, '2024-12-28', 1, 'HCM', 'nam', '1735365983544.jpg'),
(25, 'Nhà Trọ Thăng Long', 'Cho thuê phòng giá rẻ ', '531 Trường Chinh , Q.Tân Bình , TPHCM', 2500000, 'Ghép', 'có sẵn máy lạnh , máy giặt', 2, '2024-12-28', 1, 'HCM', 'nam', '1735366117510.jpg'),
(26, 'Nhà Trọ Minh Tâm', 'Cho thuê phòng giá rẻ ', '85 Lê Văn Lương , Q.7, TPHCM', 3000000, 'Ghép', 'có sẵn máy lạnh , máy giặt', 4, '2024-12-28', 1, 'HCM', 'nam', '1735366192320.jpg');

-- --------------------------------------------------------

--
-- Table structure for table `taikhoan`
--

CREATE TABLE `taikhoan` (
  `user_id` int(11) NOT NULL,
  `hoten` varchar(255) NOT NULL,
  `username` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `sdt` varchar(15) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `taikhoan`
--

INSERT INTO `taikhoan` (`user_id`, `hoten`, `username`, `password`, `email`, `sdt`) VALUES
(1, 'Thanh Tín', 'bi123', '123a456s', 'shynitom1@gmail.com', '03954986'),
(2, 'sadf', 'aq', 'sdffs', 'shynitom20@gmail.com', 'sadf');

-- --------------------------------------------------------

--
-- Table structure for table `vungmien`
--

CREATE TABLE `vungmien` (
  `vm_id` varchar(10) NOT NULL,
  `tenvungmien` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `vungmien`
--

INSERT INTO `vungmien` (`vm_id`, `tenvungmien`) VALUES
('bac', 'Miền Bắc'),
('nam', 'Miền Nam'),
('trung', 'Miền Trung');

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`id_admin`);

--
-- Indexes for table `danhgia`
--
ALTER TABLE `danhgia`
  ADD PRIMARY KEY (`dg_id`),
  ADD KEY `fk_dg_tksv` (`user_id`),
  ADD KEY `fk_dg_pt` (`maphongtro`);

--
-- Indexes for table `diachi`
--
ALTER TABLE `diachi`
  ADD PRIMARY KEY (`diachi_id`),
  ADD KEY `fk_dc_vm` (`vm_id`);

--
-- Indexes for table `hinhanh_phongtro`
--
ALTER TABLE `hinhanh_phongtro`
  ADD PRIMARY KEY (`id_hinhanh`),
  ADD KEY `maphongtro` (`maphongtro`);

--
-- Indexes for table `phongtro`
--
ALTER TABLE `phongtro`
  ADD PRIMARY KEY (`maphongtro`),
  ADD KEY `fk_pt_tk` (`user_id`),
  ADD KEY `fk_pt_dc` (`diachi_id`),
  ADD KEY `fk_pt_vm` (`vm_id`);

--
-- Indexes for table `taikhoan`
--
ALTER TABLE `taikhoan`
  ADD PRIMARY KEY (`user_id`);

--
-- Indexes for table `vungmien`
--
ALTER TABLE `vungmien`
  ADD PRIMARY KEY (`vm_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `id_admin` int(255) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `danhgia`
--
ALTER TABLE `danhgia`
  MODIFY `dg_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `hinhanh_phongtro`
--
ALTER TABLE `hinhanh_phongtro`
  MODIFY `id_hinhanh` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `phongtro`
--
ALTER TABLE `phongtro`
  MODIFY `maphongtro` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=27;

--
-- AUTO_INCREMENT for table `taikhoan`
--
ALTER TABLE `taikhoan`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `danhgia`
--
ALTER TABLE `danhgia`
  ADD CONSTRAINT `fk_dg_pt` FOREIGN KEY (`maphongtro`) REFERENCES `phongtro` (`maphongtro`),
  ADD CONSTRAINT `fk_dg_tksv` FOREIGN KEY (`user_id`) REFERENCES `taikhoan` (`user_id`);

--
-- Constraints for table `diachi`
--
ALTER TABLE `diachi`
  ADD CONSTRAINT `fk_dc_vm` FOREIGN KEY (`vm_id`) REFERENCES `vungmien` (`vm_id`);

--
-- Constraints for table `hinhanh_phongtro`
--
ALTER TABLE `hinhanh_phongtro`
  ADD CONSTRAINT `hinhanh_phongtro_ibfk_1` FOREIGN KEY (`maphongtro`) REFERENCES `phongtro` (`maphongtro`);

--
-- Constraints for table `phongtro`
--
ALTER TABLE `phongtro`
  ADD CONSTRAINT `fk_pt_dc` FOREIGN KEY (`diachi_id`) REFERENCES `diachi` (`diachi_id`),
  ADD CONSTRAINT `fk_pt_tk` FOREIGN KEY (`user_id`) REFERENCES `taikhoan` (`user_id`),
  ADD CONSTRAINT `fk_pt_vm` FOREIGN KEY (`vm_id`) REFERENCES `vungmien` (`vm_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
