import mysql from "mysql2/promise";
import spawn from "child_process";

/* Kelas untuk membuat koneksi ke database dan melakukan operasi pada database.
*/
export default class areaHijauDatabase {
    constructor(poolOptions) {
        this.pool = mysql.createPool(poolOptions);
    }

    //method untuk membuat koneksi ke DB
    connect = async () => {
        try {
            const connection = await this.pool.getConnection()
            return connection;
        } catch (error) {
            console.error('Error connecting to the database:', error.message);
            throw error;
        }
    };

    execQuery = async (queryStr, queryParams) => {
        let conn;
        try {
            conn = await this.connect();
            if (queryParams === 'undefined') queryParams = null;
            const formattedQuery = mysql.format(queryStr, queryParams);
            const [rows] = await conn.query(formattedQuery);
            return rows;
        } catch (error) {
            console.error(error);
            throw error;
        } finally {
            if (conn) {
                conn.release();
            }
        };
    };

    // Mengambil data provinsi-provinsi dari database
    getProvinsis = async () => {
        const queryStr = 'CALL sp_getProvinsis();'
        try {
            const res = await this.execQuery(queryStr);
            return res[0]
        } catch (error) {
            console.error(error);
            throw error;
        };
    };

    // Mengambil data kota-kota dari database
    getKotasByProvinsi = async (idProvinsi) => {
        const queryStr = 'CALL sp_getKotasByProvinsi(?);'
        try {
            const res = await this.execQuery(queryStr, [idProvinsi]);
            return res[0]
        } catch (error) {
            console.error(error);
            throw error;
        };
    };

    // Mengambil data kecamatan-kecamatan dari database
    getKecamatansByKota = async (idKota) => {
        const queryStr = 'CALL sp_getKecamatansByKota(?);'
        try {
            const res = await this.execQuery(queryStr, [idKota]);
            return res[0]
        } catch (error) {
            console.error(error);
            throw error;
        };
    };

    // Mengambil data kelurahan-kelurahan dari database
    getKelurahansByKecamatan = async (idKecamatan) => {
        const queryStr = 'CALL sp_getKelurahansByKecamatan(?);'
        try {
            const res = await this.execQuery(queryStr, [idKecamatan]);
            return res[0]
        } catch (error) {
            console.error(error);
            throw error;
        };
    };

    /**
     * Mengambil data namaProvinsi dari DB berdasarkan id yang 
     * diberikan.
     * 
     * @param {Number} idProvinsi
     * @returns array of objects
     */
    getProvinsi = async (idProvinsi) => {
        const queryStr = 'CALL sp_getProvinsi(?);'
        try {
            const res = await this.execQuery(queryStr, [idProvinsi]);
            return res[0]
        } catch (error) {
            console.error(error);
            throw error;
        };
    }

    /**
     * Mengambil data namaKota dan isKabupaten dari DB berdasarkan id yang 
     * diberikan.
     * 
     * @param {Number} idKota
     * @returns array of objects
     */
    getKota = async (idKota) => {
        const queryStr = 'CALL sp_getKota(?);'
        try {
            const res = await this.execQuery(queryStr, [idKota]);
            return res[0]
        } catch (error) {
            console.error(error);
            throw error;
        };
    }

    /**
     * Mengambil data namaKecamatan dari DB berdasarkan id yang 
     * diberikan.
     * 
     * @param {Number} idKecamatan 
     * @returns array of objects
     */
    getKecamatan = async (idKecamatan) => {
        const queryStr = 'CALL sp_getKecamatan(?);'
        try {
            const res = await this.execQuery(queryStr, [idKecamatan]);
            return res[0]
        } catch (error) {
            console.error(error);
            throw error;
        };
    }

    /**
     * Mengambil data namaKelurahan dan isDesa dari DB berdasarkan id yang 
     * diberikan.
     * 
     * @param {Number} idKelurahan 
     * @returns array of objects
     */
    getKelurahan = async (idKelurahan) => {
        const queryStr = 'CALL sp_getKelurahan(?);'
        try {
            const res = await this.execQuery(queryStr, [idKelurahan]);
            return res[0]
        } catch (error) {
            console.error(error);
            throw error;
        };
    }

    /**
     * Method untuk mengambil data lokasi penyimpanan file CSV untuk
     * daerah dan tahun yang ditentukan. 
     * 
     * @param {*} idKelurahan id kelurahan pada database
     * @param {*} tahun 
     * @returns list of objects berisi hasil query dengan key idKelurahan dan pathLokasi
     */
    getMapFilePath = async (idKelurahan, tahun) => {
        const queryStr = 'CALL sp_getMapFile(?,?);'
        try {
            const result = await this.execQuery(queryStr, [idKelurahan, tahun])
            return result[0];
        } catch (error) {
            console.error(error);
            throw error;
        };
    }

    getYears = async (idKelurahan) => {
        const queryStr = 'CALL sp_getYears(?);'
        try {
            const result = await this.execQuery(queryStr, [idKelurahan])
            return result[0];
        } catch (error) {
            console.error(error);
            throw error;
        };
    }

    getLuas = async (idKelurahan) => {
        const queryStr = 'CALL sp_getLuas(?);'
        try {
            const result = await this.execQuery(queryStr, [idKelurahan])
            return result[0];
        } catch (error) {
            console.error(error);
            throw error;
        };
    }

    /**
     * 
     * @param {Number} idKelurahan 
     * @param {Number} tahun 
     * @param {Number} luas 
     * @param {String} pathPenyimpanan 
     * @returns 
     */
    updateAreaHijau = async (idKelurahan, tahun, luas, pathPenyimpanan) => {
        const queryStr = 'CALL sp_updAreaHijau(?, ?, ?, ?);'
        try {
            const result = await this.execQuery(queryStr, [
                idKelurahan, 
                tahun, 
                luas,
                pathPenyimpanan
            ])
            return result[0];
        } catch (error) {
            console.error(error);
            throw error;
        };
    }
}
