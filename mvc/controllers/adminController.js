import path, { resolve } from "path";
import fs from "fs";
import { runPython } from "../models/childProcessExecutor.js";
import multer from "multer";
import areaHijauDatabase from "../models/areaHijauDatabase.js";
import crypto from "crypto"
import argon2 from "argon2";

/**
 * @param {Express} app
 * @param {areaHijauDatabase} db
 */
export default (app, db) => {

    const mapPath = resolve("./public/maps/")
    const mapPathRel = "./public/maps/"
    const mapTempPath = resolve("./tempmap");

    // Setting tempat penyimpanan multer
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

    // Setting upload multer
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

    const upload = multer({
        storage: storage,
        fileFilter: fileFilter
    });

    //Fungsi autorisasi untuk akses halaman admin
    const auth = () => {
        return (req, res, next) => {
            if (!req.session.uid) {
                res.status(403).send("<h1>403 Forbidden</h1>Access denied.");
            } else {
                next();
            }
        };
    };

    // Fungsi untuk menghasilkan salt acak
    function generateRandomSalt() {
        return crypto.randomBytes(16).toString('hex'); // Menghasilkan salt 16 byte (128 bit)
    }

    // Fungsi untuk enkripsi password dengan argon2
    async function encryptPassword(password, salt) {
        try {
            // Menggabungkan salt dengan password
            const saltedPassword = password + salt;

            // Menghasilkan hash dengan Argon2id
            const hash = await argon2.hash(saltedPassword);
            return hash;
        } catch (error) {
            throw error;
        }
    }

    async function matchPassword(password, salt, hashedPass) {
        try {
            if (await argon2.verify(hashedPass, password + salt)) {
                return true;
            } else {
                return false;
            }
        } catch (err) {
            console.log(err);
            return err;
        }
    }

    const emailIsValid = (email) => {
        return email.match(
            /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
        );
    }

    const is8Chars = (st) => {
        if (st.length >= 8) {
            return true;
        }
        return false;
    }

    // ========================================================================
    function extractYear(inputString) {
        const yearRegex = /(?:20|19)\d{2}/;
        const match = inputString.match(yearRegex);

        return match ? match[0] : null;
    }

    // ========================================================================

    app.route("/admin")
        .all(auth())
        .get(async (req, res) => {
            const provinsis = await db.getProvinsis();
            res.render("admin", {
                provinsis: provinsis
            });
        });

    app.route("/admin/mapUploadMultiple")
        .all(auth())
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
                const pyPath = resolve('mvc/models/python/csvpreprocess.py');
                console.log(pyPath);

                const uploadedFiles = []
                for (const uploadedFile of req.files) {
                    const filePath = uploadedFile.path;
                    const greenPx = await runPython(pyPath, [ //Hasil dari child process ini adalah int jika kolom valid, dan string 'INVALID' jika kolom tak sesuai
                        filePath
                    ]);

                    // Jika file valid, pindahkan ke penyimpanan permanen.
                    if (greenPx !== "INVALID") {
                        const year = extractYear(uploadedFile.originalname);
                        const destinationFilePath = path.join(destinationDir, (year + ".csv"));
                        fs.rename(filePath, destinationFilePath, async (err) => {
                            if (err) {
                                console.error('Error:', err);
                            } else {
                                const storPath = path.join(mapPathRel, namaNegara, namaProvinsi,
                                    namaKota, namaKecamatan, namaKelurahan, (year + ".csv"))


                                // Update database
                                try {
                                    await db.updateAreaHijau(idKelurahan, year, greenPx * 100,
                                        storPath);
                                    uploadedFiles.push(uploadedFile.originalname);
                                    console.log('File telah dipindahkan!');
                                } catch (error) {
                                    console.log(error);
                                }
                            }
                        });
                    }
                }
                res.status(200).json({
                    message: 'File berhasil diupload',
                    files: uploadedFiles
                });
            } else {
                res.status(500).json({ error: 'Internal Server Error' });
            }

        });

    app.route("/admin/buatAkun")
        .all(auth())
        .get((req, res) => {
            res.render('adminBuatAkun');
        })
        .post(upload.none(), async (req, res) => {
            const nama = req.body.nama ? req.body.nama : undefined;
            const username = is8Chars(req.body.username) ? req.body.username : undefined;
            const password = is8Chars(req.body.password) ? req.body.password : undefined;
            const email = emailIsValid(req.body.email) ? req.body.email : undefined;

            if (nama && username && password && email) {
                const salt = generateRandomSalt();
                const hashedPass = await encryptPassword(password, salt);

                try {
                    await db.addAdmin(nama, email, username, hashedPass, salt);
                    return res
                        .status(201)
                        .send("Akun berhasil ditambahkan.");
                } catch (error) {
                    if (error.code === 'ER_DUP_ENTRY') {
                        return res
                            .status(409)
                            .send("Email atau username sudah ada.");
                    }
                    return res
                        .status(500)
                        .send("Terjadi kesalahan pada server.");
                }
            }

            return res
                .status(400)
                .send("Kesalahan pada input.");
        });

    app.route("/login")
        .get((req, res) => {
            res.render("adminLogin", { validationError: null });
        })
        .post(upload.none(), async (req, res) => {
            const username = is8Chars(req.body.username) ? req.body.username : undefined;
            const password = is8Chars(req.body.password) ? req.body.password : undefined;

            if (username && password) {
                const result = await db.getAdminCredentials(username);

                // user tidak ditemukan
                if (result.length !== 1) {
                    return res
                        .status(401)
                        .send("Username tidak ditemukan!")
                }

                // Cek password
                const storedPassword = result[0].password;
                const storedSalt = result[0].salt;
                if (await matchPassword(password, storedSalt, storedPassword)) {
                    req.session.uid = result[0].idAdmin;
                    return res
                        .status(200)
                        .send("Login berhasil.")
                }

                return res
                    .status(401)
                    .send("Password salah!")
            }

            return res
                .status(400)
                .send("Terdapat kesalahan input. Silahkan periksa kembali masukan username dan password Anda.")
        });

    app.get("/logout", (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                console.error('Gagal menghapus sesi: ' + err);
            } else {
                console.log('Data pengguna telah dihapus dari sesi.');
            }
            // Redirect ke halaman log in
            res.redirect('/login');
        });
    }
    )


}