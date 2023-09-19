import bodyparser from "body-parser";
import express from "express";
import path, { dirname } from "path";
import areaHijauDatabase from "./mvc/models/areaHijauDatabase.js";
import publicController from "./mvc/controllers/publicController.js";
// import * as dfd from "danfojs-node"
// import Papa from 'papaparse';
// import fs from 'fs'
// import csv from 'csv-parser'

const app = express();
const PORT = 8080;

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.use(express.static(path.resolve("public")));

app.use(express.json());
app.use(bodyparser.urlencoded({ extended: true }));

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
    database: "areahijau",
};

const ahdb = new areaHijauDatabase(dbConnectOptions);

publicController(app, ahdb)

// ++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

app.listen(PORT, () => {
    console.log("Server ready");
});