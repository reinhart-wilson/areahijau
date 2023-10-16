import path, { resolve } from "path";
import fs from "fs";
import { runPython } from "../models/childProcessExecutor.js";
import multer from "multer";
import areaHijauDatabase from "../models/areaHijauDatabase.js";


/**
 * @param {Express} app
 * @param {areaHijauDatabase} db
 */
export default (app, db) => {
    // const idProvinsi = req.body.provinsi;
    // const idKota = req.body.kota;
    // const idKecamatan = req.body.kecamatan;
    // const idKelurahan = req.body.kelurahan;

    // // Ambil data-data termasuk nama, isDesa, dan isKabupaten dari DB
    // const dataProvinsi = await db.getProvinsi(idProvinsi);
    // const dataKota = await db.getKota(idKota);
    // const dataKecamatan = await db.getKecamatan(idKecamatan);
    // const dataKelurahan = await db.getKelurahan(idKelurahan);

    // // nama-nama daerah administrasi
    // const namaNegara = "INDONESIA"
    // const namaProvinsi = dataProvinsi[0].namaProvinsi;
    // const isKabupaten = dataKota[0].isKabupaten;
    // const namaKota = (isKabupaten === 0) ? dataKota[0].namaKota :
    //     (dataKota[0].namaKota + " KABUPATEN");
    // const namaKecamatan = dataKecamatan[0].namaKecamatan;
    // const namaKelurahan = dataKelurahan[0].namaKelurahan;

    // // Path di mana peta akan disimpan
    // const destinationPath = path.join(mapPath, namaNegara, namaProvinsi,
    //     namaKota, namaKecamatan, namaKelurahan);

    // // Buat direktori jika belum ada
    // if (!fs.existsSync(destinationPath)) {
    //     fs.mkdirSync(destinationPath, { recursive: true });
    // }

    const mapPath = resolve("./public/maps/")
    const mapPathRel = "./public/maps/"
    const mapTempPath = resolve("./tempmap");

    const storage = multer.diskStorage({
        destination: async (req, file, cb) => {
            // const uniqueSuffix = Date.now() + "" + Math.round(Math.random() * 10000);
            // const destinationPath = path.join(mapTempPath, uniqueSuffix)
            const destinationPath = mapTempPath;

            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true });
            }

            cb(null, destinationPath);
        },
        filename: (req, file, cb) => {
            const idxDot = file.originalname.lastIndexOf(".");
            const ext = file.originalname.substring(idxDot);
            const fileName = file.originalname.substring(0, idxDot);
            const uniqueSuffix = Date.now() + "" + Math.round(Math.random() * 10000);
            cb(null, fileName + "_" + uniqueSuffix + ext);
        }
    })

    const fileFilter = (req, file, cb) => {
        let isValid = false;

        // Periksa ektensi file, jika csv maka valid.
        if (path.extname(file.originalname).toLowerCase() === '.csv') {
            isValid = true;
        }

        if (isValid) {
            cb(null, true);
        } else {
            cb(new Error(''));
        }
    };

    const upload = multer({ storage: storage });

    function extractYear(inputString) {
        const yearRegex = /(?:20|19)\d{2}/;
        const match = inputString.match(yearRegex);

        return match ? match[0] : null;
    }

    app.route("/admin")
        .get(async (req, res) => {
            const provinsis = await db.getProvinsis();
            res.render("admin", {
                provinsis: provinsis
            });
        });

    app.route("/admin/mapUploadMultiple")
        .post(upload.any(), async (req, res) => {
            // ================================================================
            // Membuat Direktori penyimpanan permanen file

            const idProvinsi = req.body.provinsi;
            const idKota = req.body.kota;
            const idKecamatan = req.body.kecamatan;
            const idKelurahan = req.body.kelurahan;

            // Ambil data-data termasuk nama, isDesa, dan isKabupaten dari DB
            const dataProvinsi = await db.getProvinsi(idProvinsi);
            const dataKota = await db.getKota(idKota);
            const dataKecamatan = await db.getKecamatan(idKecamatan);
            const dataKelurahan = await db.getKelurahan(idKelurahan);

            // nama-nama daerah administrasi
            const namaNegara = "INDONESIA"
            const namaProvinsi = dataProvinsi[0].namaProvinsi;
            const isKabupaten = dataKota[0].isKabupaten;
            const namaKota = (isKabupaten === 0) ? dataKota[0].namaKota :
                (dataKota[0].namaKota + " KABUPATEN");
            const namaKecamatan = dataKecamatan[0].namaKecamatan;
            const namaKelurahan = dataKelurahan[0].namaKelurahan;

            // Folder di mana peta akan disimpan
            const destinationDir = path.join(mapPath, namaNegara, namaProvinsi,
                namaKota, namaKecamatan, namaKelurahan);

            // Buat direktori jika belum ada
            if (!fs.existsSync(destinationDir)) {
                fs.mkdirSync(destinationDir, { recursive: true });
            }
            // ================================================================

            // Proses file yang terupload dengan python
            if (req.files || req.files.length > 0) {
                const pyPath = resolve('mvc/models/python/csvpreprocess.py')
                console.log(pyPath);
                for (const uploadedFile of req.files) {
                    const filePath = uploadedFile.path;
                    const greenPx = await runPython(pyPath, [ //Hasil dari child process ini adalah int jika kolom valid, dan string 'INVALID' jika kolom tak sesuai
                        filePath
                    ]);

                    // Jika file valid, pindahkan ke penyimpanan permanen.
                    if (greenPx !== "INVALID") {
                        const year = extractYear(uploadedFile.originalname);
                        const destinationFilePath = path.join(destinationDir, (year + ".csv"));
                        fs.rename(filePath, destinationFilePath, (err) => {
                            if (err) {
                                console.error('Error:', err);
                            } else {
                                console.log('File telah dipindahkan!');
                            }
                        });

                        const storPath = path.join(mapPathRel, namaNegara, namaProvinsi,
                            namaKota, namaKecamatan, namaKelurahan, (year + ".csv"))


                        // Update database
                        await db.updateAreaHijau(idKelurahan, year, greenPx * 100,
                            storPath);
                    }
                }
                res.status(200).json({ message: 'File berhasil diupload' });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }

        });


}