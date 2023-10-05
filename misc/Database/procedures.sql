DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getKelurahan`()
BEGIN
  SELECT idKelurahan, namaKelurahan, isDesa
  from kelurahan;
END$$
DELIMITER ;

DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getLuas`(IN `idKelurahan` INT)
SELECT tahun, luas
FROM areahijau
WHERE areahijau.idKelurahan = idKelurahan
ORDER BY tahun ASC$$
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
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_getYears`(IN `idKelurahan` INT)
SELECT tahun
FROM areahijau
WHERE areahijau.idKelurahan = idKelurahan
ORDER BY tahun ASC$$
DELIMITER ;

/*
DELIMITER $$
CREATE DEFINER=`root`@`localhost` PROCEDURE `sp_perubahan`(
	IN idKel INT,
    IN tahun1 INT,
    IN tahun2 INT
)
BEGIN
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
DELIMITER ; */
