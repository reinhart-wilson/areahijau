import bodyparser from "body-parser";
import express from "express";
import path from "path";
import areaHijauDatabase from "./mvc/models/areaHijauDatabase.js";
import publicController from "./mvc/controllers/publicController.js";
import adminController from "./mvc/controllers/adminController.js";
import session from "express-session";

const app = express();
const PORT = 8080;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.use(express.static(path.resolve("public")));
app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));
app.use(
    session({
        cookie: {
            httpOnly: false,
            samesite: "strict",
            maxAge: 2 * 60 * 60 * 1000,
        },
        // store: sessionStore,
        name: "SID",
        secret: "topsecret",
        resave: false,
        saveUninitialized: false,
    })
);

app.set("view engine", "ejs");

app.set("views", [
    "./mvc/views",
    "./mvc/views/adminViews",
    "./mvc/views/publicViews",
]);

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

const dbConnectOptions = {
    host: "localhost",
    port: 3306,
    user: "root",
    password: "",
    database: "areahijaudb",
};

const ahdb = new areaHijauDatabase(dbConnectOptions);

publicController(app, ahdb)
adminController(app, ahdb)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.listen(PORT, () => {
    console.log("Server ready");
});


