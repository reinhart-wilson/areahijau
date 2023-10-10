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

    const mapPath = resolve("./public/maps/")

    const storage = multer.diskStorage({
        destination: async (req, file, cb) => {
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

            // Path di mana peta akan disimpan
            const destinationPath = path.join(mapPath, namaNegara, namaProvinsi,
                namaKota, namaKecamatan, namaKelurahan);

            // Buat direktori jika belum ada
            if (!fs.existsSync(destinationPath)) {
                fs.mkdirSync(destinationPath, { recursive: true });
            }

            cb(null, destinationPath);
        },
        filename: (req, file, cb) => {
            console.log(file.originalname)
            cb(null, file.originalname);
        }
    })

    const upload = multer({ storage: storage });

    app.route("/admin")
        .get(async (req, res) => {
            const provinsis = await db.getProvinsis();
            res.render("admin", {
                provinsis: provinsis
            });
        });

    app.route("/admin/mapUploadMultiple")
        .post(upload.any(), async (req, res) => {
            
        });


}