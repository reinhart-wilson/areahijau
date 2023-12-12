DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_addAdmin`(IN `namaIn` VARCHAR(255), IN `emailIn` VARCHAR(320), IN `usernameIn` VARCHAR(255), IN `passwordIn` VARCHAR(128), IN `saltIn` CHAR(32))
INSERT INTO admin (nama, email, username, `password`, salt)
VALUES (namaIn, emailIn, usernameIn, passwordIn, saltIn)$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getAdminCredentials`(IN `usernameIn` VARCHAR(255))
SELECT `password`, salt, idAdmin, admin.nama
FROM admin
WHERE username = usernameIn$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getKecamatan`(IN `idKecamatan` INT)
SELECT idKecamatan, namaKecamatan, idKota
FROM kecamatan
WHERE kecamatan.idKecamatan=idKecamatan$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getKecamatansByKota`(IN `idKota` INT)
SELECT idKecamatan, namaKecamatan, idKota
FROM kecamatan
WHERE kecamatan.idKota=idKota
ORDER BY namakecamatan ASC$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getKelurahan`(IN `idKelurahan` INT)
SELECT idKelurahan, namaKelurahan, isDesa, idKecamatan
FROM kelurahan
WHERE kelurahan.idKelurahan = idKelurahan$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getKelurahansByKecamatan`(IN `idKecamatan` INT)
SELECT idKelurahan, namaKelurahan, isDesa, idKecamatan
FROM kelurahan
WHERE kelurahan.idKecamatan = idKecamatan
ORDER BY namaKelurahan asc, isDesa asc$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getKota`(IN `idKota` INT)
SELECT idKota, namaKota, isKabupaten, idProvinsi
FROM kota
WHERE kota.idKota = idKota$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getKotasByProvinsi`(IN `idProvinsi` INT)
SELECT idKota, namaKota, isKabupaten, idProvinsi
FROM kota
WHERE kota.idProvinsi = idProvinsi
ORDER BY namaKota asc, isKabupaten asc$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getLuas`(IN `idKelurahan` INT)
SELECT tahun, luas
FROM areahijau
WHERE areahijau.idKelurahan = idKelurahan
ORDER BY tahun asc$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getMapFile`(IN `idKelurahan` INT, IN `tahun` INT)
SELECT tahun, pathPeta 
FROM areahijau
WHERE 
	areahijau.idKelurahan = idKelurahan
	AND areahijau.tahun = tahun$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getProvinsi`(IN `idProvinsi` INT)
SELECT *
FROM provinsi
WHERE provinsi.idProvinsi = idProvinsi$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getProvinsis`()
SELECT idProvinsi, namaProvinsi, idNegara
FROM provinsi
ORDER BY namaProvinsi ASC$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getYears`(IN `idKelurahan` INT)
SELECT tahun 
FROM areahijau
WHERE areahijau.idKelurahan = idKelurahan
ORDER by tahun ASC$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_updAreaHijau`(IN `idKelurahanIn` INT, IN `tahunIn` INT, IN `luasIn` INT, IN `pathIn` VARCHAR(255))
INSERT INTO areahijau (idKelurahan, tahun, luas, pathPeta) 
VALUES (idKelurahanIn, tahunIn, luasIn, pathIn) 
ON DUPLICATE KEY UPDATE 
	luas = luasIn,
    pathPeta = pathIn$$
DELIMITER ;
