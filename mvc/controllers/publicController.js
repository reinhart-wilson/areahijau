import { resolve } from 'path';
import { runPython } from "../models/childProcessExecutor.js";
import areaHijauDatabase from '../models/areaHijauDatabase.js';

/**
 * @param {Express} app
 * @param {areaHijauDatabase} db
 */
export default (app, db) => {
    app.route("/")
        .get(async (req, res) => {
            const provinsis = await db.getProvinsis();
            res.render("perbandingan", {
                provinsis: provinsis
            });
        });

    app.route("/ajaxMap")
        .get(async (req, res) => {
            // Retrieve query string
            const idKelurahan = req.query.idKelurahan;
            const tahun1 = req.query.tahun1;
            const tahun2 = req.query.tahun2;

            // Retrieve alamat file
            const data1 = await db.getMapFilePath(idKelurahan, tahun1);
            const data2 = await db.getMapFilePath(idKelurahan, tahun2);
            const csvFilePath1 = 'public/' + data1[0].pathPeta;
            const csvFilePath2 = 'public/' + data2[0].pathPeta;

            // Proses csv dengan child process 
            const processedCsv = await runPython(resolve("mvc/models/python/csvprocess.py"), [
                resolve(csvFilePath1),
                resolve(csvFilePath2)
            ]);

            // Set header untuk mengindikasikan bahwa respons adalah file CSV
            res.setHeader('Content-Type', 'text/csv');
            res.setHeader('Content-Disposition', 'attachment; filename="res.csv"');

            // Kirimkan hasil perhitungan
            res.send(processedCsv.trim());
        });

    app.route('/ajaxTahun')
        .get(async (req, res) => {
            const idKelurahan = req.query.idKelurahan;

            const years = await db.getYears(idKelurahan);
            // Kirim ke klien
            res.json(years);
        });

    app.route('/ajaxLuas')
        .get(async (req, res) => {
            const idKelurahan = req.query.idKelurahan;

            const data = await db.getLuas(idKelurahan);

            // Buat list untuk dikirim ke klien
            const luases = []
            for (const row of data) {
                luases.push(row.luas);
            }

            // Kirim ke klien
            res.json(luases);
        });

    app.route('/ajaxKota')
        .get(async (req, res) => {
            const id = req.query.idProvinsi;

            const data = await db.getKotasByProvinsi(id);

            // Kirim ke klien
            res.json(data);
        });

    app.route('/ajaxKecamatan')
        .get(async (req, res) => {
            const id = req.query.idKota;

            const data = await db.getKecamatansByKota(id);

            // Kirim ke klien
            res.json(data);
        });

    app.route('/ajaxKelurahan')
        .get(async (req, res) => {
            const id = req.query.idKecamatan;

            const data = await db.getKelurahansByKecamatan(id);

            // Kirim ke klien
            res.json(data);
        });


}