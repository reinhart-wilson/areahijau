import { resolve } from 'path';
import { runPython } from "../models/childProcessExecutor.js";

export default (app, db) => {
    app.route("/admin")
        .get(async (req, res) => {
            const provinsis = await db.getProvinsi();
            res.render("admin", {
                provinsis: provinsis
            });
        });

    
}