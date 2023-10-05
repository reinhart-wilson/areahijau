-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 25, 2023 at 03:08 PM
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
-- Table structure for table `kecamatan`
--

CREATE TABLE `kecamatan` (
  `idKecamatan` int(11) PRIMARY KEY AUTO_INCREMENT,
  `namaKecamatan` varchar(255) NOT NULL,
  `idKota` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `kelurahan`
--

CREATE TABLE `kelurahan` (
  `idKelurahan` int(11) PRIMARY KEY AUTO_INCREMENT,
  `namaKelurahan` varchar(255) NOT NULL,
  `isDesa` tinyint(4) NOT NULL,
  `idKecamatan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `kota`
--

CREATE TABLE `kota` (
  `idKota` int(11) PRIMARY KEY AUTO_INCREMENT,
  `namaKota` varchar(255) NOT NULL,
  `isKabupaten` tinyint(4) NOT NULL,
  `idProvinsi` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `negara`
--

CREATE TABLE `negara` (
  `idNegara` int(11) PRIMARY KEY AUTO_INCREMENT,
  `namaNegara` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- --------------------------------------------------------

--
-- Table structure for table `provinsi`
--

CREATE TABLE `provinsi` (
  `idProvinsi` int(11) PRIMARY KEY AUTO_INCREMENT,
  `namaProvinsi` varchar(255) NOT NULL,
  `idNegara` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

CREATE TABLE `areahijau` (
  `id` int(11) PRIMARY KEY AUTO_INCREMENT,
  `tahun` year(4) NOT NULL,
  `pathPeta` int(11) NOT NULL,
  `luas` float NOT NULL,
  `idKelurahan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Constraints for dumped tables
--

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

ALTER TABLE `areahijau`
  ADD CONSTRAINT `areahijau_ibfk_1` FOREIGN KEY (`idKelurahan`) REFERENCES `kelurahan` (`idKelurahan`);
COMMIT;