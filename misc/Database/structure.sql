-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Dec 07, 2023 at 05:52 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";

--
-- Database: `areahijaudb`
--

-- --------------------------------------------------------

--
-- Table structure for table `admin`
--

CREATE TABLE `admin` (
  `idAdmin` int(11) NOT NULL,
  `nama` varchar(255) NOT NULL,
  `password` varchar(128) NOT NULL,
  `salt` char(32) NOT NULL,
  `username` varchar(255) NOT NULL,
  `email` varchar(320) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `areahijau`
--

CREATE TABLE `areahijau` (
  `id` int(11) NOT NULL,
  `tahun` year(4) NOT NULL,
  `pathPeta` text NOT NULL,
  `luas` float NOT NULL,
  `idKelurahan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `kecamatan`
--

CREATE TABLE `kecamatan` (
  `idKecamatan` int(11) NOT NULL,
  `namaKecamatan` varchar(255) NOT NULL,
  `idKota` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `kelurahan`
--

CREATE TABLE `kelurahan` (
  `idKelurahan` int(11) NOT NULL,
  `namaKelurahan` varchar(255) NOT NULL,
  `isDesa` tinyint(4) NOT NULL,
  `idKecamatan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `kota`
--

CREATE TABLE `kota` (
  `idKota` int(11) NOT NULL,
  `namaKota` varchar(255) NOT NULL,
  `isKabupaten` tinyint(4) NOT NULL,
  `idProvinsi` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `negara`
--

CREATE TABLE `negara` (
  `idNegara` int(11) NOT NULL,
  `namaNegara` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `provinsi`
--

CREATE TABLE `provinsi` (
  `idProvinsi` int(11) NOT NULL,
  `namaProvinsi` varchar(255) NOT NULL,
  `idNegara` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `admin`
--
ALTER TABLE `admin`
  ADD PRIMARY KEY (`idAdmin`),
  ADD UNIQUE KEY `idx_uname` (`username`),
  ADD UNIQUE KEY `idx_email` (`email`),
  ADD UNIQUE KEY `uk_admin_username` (`username`),
  ADD UNIQUE KEY `uk_admin_email` (`email`);

--
-- Indexes for table `areahijau`
--
ALTER TABLE `areahijau`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `idx_tahun_idKelurahan` (`tahun`,`idKelurahan`),
  ADD KEY `areahijau_ibfk_1` (`idKelurahan`);

--
-- Indexes for table `kecamatan`
--
ALTER TABLE `kecamatan`
  ADD PRIMARY KEY (`idKecamatan`),
  ADD KEY `kecamatan_ibfk_1` (`idKota`);

--
-- Indexes for table `kelurahan`
--
ALTER TABLE `kelurahan`
  ADD PRIMARY KEY (`idKelurahan`),
  ADD KEY `kelurahan_ibfk_1` (`idKecamatan`);

--
-- Indexes for table `kota`
--
ALTER TABLE `kota`
  ADD PRIMARY KEY (`idKota`),
  ADD KEY `kota_ibfk_1` (`idProvinsi`);

--
-- Indexes for table `negara`
--
ALTER TABLE `negara`
  ADD PRIMARY KEY (`idNegara`);

--
-- Indexes for table `provinsi`
--
ALTER TABLE `provinsi`
  ADD PRIMARY KEY (`idProvinsi`),
  ADD KEY `provinsi_ibfk_1` (`idNegara`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `admin`
--
ALTER TABLE `admin`
  MODIFY `idAdmin` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `areahijau`
--
ALTER TABLE `areahijau`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kecamatan`
--
ALTER TABLE `kecamatan`
  MODIFY `idKecamatan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kelurahan`
--
ALTER TABLE `kelurahan`
  MODIFY `idKelurahan` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `kota`
--
ALTER TABLE `kota`
  MODIFY `idKota` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `negara`
--
ALTER TABLE `negara`
  MODIFY `idNegara` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `provinsi`
--
ALTER TABLE `provinsi`
  MODIFY `idProvinsi` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `areahijau`
--
ALTER TABLE `areahijau`
  ADD CONSTRAINT `areahijau_ibfk_1` FOREIGN KEY (`idKelurahan`) REFERENCES `kelurahan` (`idKelurahan`);

--
-- Constraints for table `kecamatan`
--
ALTER TABLE `kecamatan`
  ADD CONSTRAINT `kecamatan_ibfk_1` FOREIGN KEY (`idKota`) REFERENCES `kota` (`idKota`);

--
-- Constraints for table `kelurahan`
--
ALTER TABLE `kelurahan`
  ADD CONSTRAINT `kelurahan_ibfk_1` FOREIGN KEY (`idKecamatan`) REFERENCES `kecamatan` (`idKecamatan`);

--
-- Constraints for table `kota`
--
ALTER TABLE `kota`
  ADD CONSTRAINT `kota_ibfk_1` FOREIGN KEY (`idProvinsi`) REFERENCES `provinsi` (`idProvinsi`);

--
-- Constraints for table `provinsi`
--
ALTER TABLE `provinsi`
  ADD CONSTRAINT `provinsi_ibfk_1` FOREIGN KEY (`idNegara`) REFERENCES `negara` (`idNegara`);
COMMIT;
