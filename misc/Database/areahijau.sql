-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Sep 21, 2023 at 06:08 AM
-- Server version: 10.4.24-MariaDB
-- PHP Version: 8.0.19

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `areahijau`
--

DELIMITER $$
--
-- Procedures
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `exampleProcedure` ()   BEGIN
    DECLARE someVariable INT;
    SET someVariable = 10;

    IF someVariable > 5 THEN
        SELECT 'Greater than 5';
    ELSE
        SELECT 'Less than or equal to 5';
    END IF;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `getKelurahan` ()   BEGIN
	SELECT idKelurahan, namaKelurahan  
    FROM kelurahan;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getKelurahan` ()   BEGIN
  SELECT idKelurahan, namaKelurahan
  from kelurahan;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getLuas` (IN `idKelurahan` INT)   SELECT tahun, luas
FROM luasareahijau
WHERE luasareahijau.idKelurahan = idKelurahan
ORDER BY tahun ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getMapFile` (IN `idKelurahan` INT, IN `tahun` INT)   SELECT tahun, pathLokasi 
FROM petaareahijau
WHERE 
	petaareahijau.idKelurahan = idKelurahan
	AND petaareahijau.tahun = tahun$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getYears` (IN `idKelurahan` INT)   SELECT tahun
FROM petaareahijau
WHERE petaareahijau.idKelurahan = idKelurahan
ORDER BY tahun ASC$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_perubahan` (IN `idKel` INT, IN `tahun1` INT, IN `tahun2` INT)   BEGIN
    CREATE TEMPORARY TABLE tabelHasil(
        x INT,
        y INT,
        idLabel1 INT,
        idLabel2 INT
    );
    
    INSERT INTO tabelHasil
    SELECT Tabel1.x, Tabel1.y, Tabel1.idLabel, Tabel2.idLabel
    FROM (
        SELECT x,y,idLabel
        FROM `petaareahijau` 
        WHERE tahun = tahun1 AND idKelurahan = idKel) AS Tabel1
        JOIN (
            SELECT x,y,idLabel
            FROM `petaareahijau` 
            WHERE tahun = tahun2 AND idKelurahan = idKel) AS Tabel2
        ON Tabel1.x = Tabel2.x AND Tabel1.y = Tabel2.y;
    
	DROP TEMPORARY TABLE tabelHasil;
END$$

CREATE DEFINER=`root`@`localhost` PROCEDURE `your_procedure_name` ()   BEGIN
    CREATE TEMPORARY TABLE temp_table (
        id INT,
        name VARCHAR(255)
    );
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Table structure for table `kelurahan`
--

CREATE TABLE `kelurahan` (
  `idKelurahan` int(11) NOT NULL,
  `namaKelurahan` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `kelurahan`
--

INSERT INTO `kelurahan` (`idKelurahan`, `namaKelurahan`) VALUES
(1, 'LEBAKWANGI'),
(2, 'ANCOLMEKAR');

-- --------------------------------------------------------

--
-- Table structure for table `luasareahijau`
--

CREATE TABLE `luasareahijau` (
  `idLuas` int(11) NOT NULL,
  `tahun` year(4) NOT NULL,
  `luas` float NOT NULL,
  `idKelurahan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `luasareahijau`
--

INSERT INTO `areahijau` (`tahun`, `luas`, `idKelurahan`, `pathPeta`) VALUES
(2015, 903900, 285, 'maps/INDONESIA/JAWA BARAT/BANDUNG KABUPATEN/LEBAKWANGI/2015.csv'),
(2016, 803200, 285, 'maps/INDONESIA/JAWA BARAT/BANDUNG KABUPATEN/LEBAKWANGI/2016.csv'),
(2017, 815000, 285, 'maps/INDONESIA/JAWA BARAT/BANDUNG KABUPATEN/LEBAKWANGI/2017.csv'),
(2018, 886800, 285, 'maps/INDONESIA/JAWA BARAT/BANDUNG KABUPATEN/LEBAKWANGI/2018.csv'),
(2019, 852900, 285, 'maps/INDONESIA/JAWA BARAT/BANDUNG KABUPATEN/LEBAKWANGI/2019.csv'),
(2020, 859400, 285, 'maps/INDONESIA/JAWA BARAT/BANDUNG KABUPATEN/LEBAKWANGI/2020.csv'),
(2021, 830900, 285, 'maps/INDONESIA/JAWA BARAT/BANDUNG KABUPATEN/LEBAKWANGI/2021.csv'),
(2022, 811500, 285, 'maps/INDONESIA/JAWA BARAT/BANDUNG KABUPATEN/LEBAKWANGI/2022.csv');

-- --------------------------------------------------------

--
-- Table structure for table `petaareahijau`
--

CREATE TABLE `petaareahijau` (
  `idPeta` int(11) NOT NULL,
  `tahun` year(4) NOT NULL,
  `pathLokasi` text NOT NULL,
  `idKelurahan` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- Dumping data for table `petaareahijau`
--

INSERT INTO `petaareahijau` (`idPeta`, `tahun`, `pathLokasi`, `idKelurahan`) VALUES
(1, 2016, 'maps/LEBAKWANGI/2016.csv', 1),
(2, 2017, 'maps/LEBAKWANGI/2017.csv', 1),
(3, 2018, 'maps/LEBAKWANGI/2018.csv', 1),
(4, 2019, 'maps/LEBAKWANGI/2019.csv', 1),
(5, 2020, 'maps/LEBAKWANGI/2020.csv', 1),
(6, 2021, 'maps/LEBAKWANGI/2021.csv', 1),
(7, 2022, 'maps/LEBAKWANGI/2022.csv', 1);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `kelurahan`
--
ALTER TABLE `kelurahan`
  ADD PRIMARY KEY (`idKelurahan`);

--
-- Indexes for table `luasareahijau`
--
ALTER TABLE `luasareahijau`
  ADD PRIMARY KEY (`idLuas`);

--
-- Indexes for table `petaareahijau`
--
ALTER TABLE `petaareahijau`
  ADD PRIMARY KEY (`idPeta`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `kelurahan`
--
ALTER TABLE `kelurahan`
  MODIFY `idKelurahan` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `luasareahijau`
--
ALTER TABLE `luasareahijau`
  MODIFY `idLuas` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `petaareahijau`
--
ALTER TABLE `petaareahijau`
  MODIFY `idPeta` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
