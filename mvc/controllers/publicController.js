import * as reader from "../models/fileReader.js";
import { resolve } from 'path';
import { spawn } from 'child_process';
import { runPython } from "../models/childProcessExecutor.js";

export default (app, db) => {
    app.route("/")
        .get(async (req, res) => {
            const kelurahans = await db.getKelurahan();

            res.render("perbandingan", {
                kelurahans: kelurahans[0]
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
            const csvFilePath1 = 'public/' + data1[0].pathLokasi;
            const csvFilePath2 = 'public/' + data2[0].pathLokasi;

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

            const data = await db.getYears(idKelurahan);

            // Buat list untuk dikirim ke klien
            const years = []
            for (const row of data) {
                years.push(row.tahun);
            }

            // Kirim ke klien
            res.json(years);
        });

    app.route('/ajaxTahun')
        .get(async (req, res) => {
            const idKelurahan = req.query.idKelurahan;

            const data = await db.getYears(idKelurahan);

            // Buat list untuk dikirim ke klien
            const years = []
            for (const row of data) {
                years.push(row.tahun);
            }

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
}