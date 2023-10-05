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
    getProvinsi = async () => {
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
    getKota = async (idProvinsi) => {
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
    getKecamatan = async (idKota) => {
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
    getKelurahan = async (idKecamatan) => {
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
     * Tentative. Method untuk mengambil data lokasi penyimpanan file CSV untuk
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
}
