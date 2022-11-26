const express = require('express');
const api = express.Router()

///-------------------------------------------------------------------------------
/*const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database("./datas.sqlite", (err) => {
    if (err){
        return console.log("Impossible de se connecter à la database");
    }
    console.log("Connection à la base de données OK");
})*/

const mysql = require('mysql');
const database = mysql.createConnection({
    host : '10.8.0.1',
    user : 'portfolio',
    password : 'folioport',
    database : 'portfolio'
});

database.connect((err) => {
    if (err) {
        console.log(err);
        return;
    }
    console.log("Connecté à portfolio mysql");
})

///-------------------------------------------------------------------------------
const logMiddle = require('./log.js')(database);
const fileUpload = require('express-fileupload')();


///-------------------------------------------------------------------------------
const msgApi = express.Router();
const antiSpam = new (require("./antiSpam.js"))(4, 360000);
msgApi.put("/send", (req, res) => {
    console.log("from " + req.headers['x-forwarded-for'] + " un message est arrivé");
    let ip = req.headers['x-forwarded-for'];
    if (antiSpam.verifyIP(ip)){
        antiSpam.addCount(ip);
        if (req.body.name !== "" && req.body.contact.includes("@") && req.body.message !== ""){
            let sql = "INSERT INTO messages (name, contact, message, ip) VALUES (?, ?, ?, ?)";
            database.query(sql, [req.body.name, req.body.contact, req.body.message, req.headers['x-forwarded-for']], function(error, results, fields){
                if (error){
                    res.status(503);
                    res.send("error");
                } else {
                    res.send("ok");
                }
            })
        } else {
            res.status(400);
            res.send("Bad arguments");
        }
    } else {
        res.status(400).send("Too many message. Try later");
    }
})

msgApi.get("/admin/all", (req, res) => {
    let sql = "SELECT * FROM messages WHERE deleted IS NULL ORDER BY time DESC";
    database.query(sql, [], function(error, results, fields){
        if (error){
            res.status(500).send("error");
            console.log(error);
        } else {
            res.json(results);
        }
    });
})

msgApi.get("/admin/detail/:id", (req, res) => {
    if (!isNaN(req.params.id)){
        let sql = "SELECT * FROM messages WHERE id = ? AND deleted IS NULL";
        database.query(sql, [req.params.id], function(error, results, fields){
            if (error){
                res.status(500).send("error");
                console.log(error);
            } else if (results.length > 0){
                res.json(results);
            } else {
                res.status(404).send("Not found")
            }
        });
    } else {
        res.status(400).send("Invalid parameters")
    }
})

const update_message = (sql, id, res) => {
    database.query(sql, [id], function(error, results, fields){
        if (error){
            res.status(500).end();
            console.log(error);
        } else if (results.changedRows > 0){
            res.send("ok");
        } else {
            res.status(404).send("Not found");
        }
    });
}
msgApi.post("/admin/setviewed/:id", (req, res) => {
    if (!isNaN(req.params.id)){
        let sql = "UPDATE messages SET viewed = 'true' WHERE id = ?";
        update_message(sql, req.params.id, res);
    } else {
        res.status(400).send("Invalid parameters")
    }
});

msgApi.delete("/admin/delete/:id", (req, res) => {
    if (!isNaN(req.params.id)){
        let sql = "UPDATE messages SET deleted = 'true' WHERE id = ?";
        update_message(sql, req.params.id, res);
    } else {
        res.status(400).send("Invalid parameters")
    }
})

///-------------------------------------------------------------------------------
const worksApi = express.Router();
const works_get_all = (sql, res) => {
    try {
        database.query(sql, [], function(error, results, fields){
            if (error) { throw error }
            if (results.length > 0 ) {
                let works  = results;
                let index = 0;
                const sql_img = "SELECT id FROM works_img WHERE ref = ?";
                const callback = function(error, results, fields){
                    if (error) {throw error}
                    works[index].images = [];
                    results.forEach(elt => {
                        works[index].images.push(elt.id);
                    })
                    index++;
                    if (index < works.length){
                        database.query(sql_img, [works[index].id], callback);
                    } else {
                        res.json(works);
                    }
                }
                database.query(sql_img, [works[index].id], callback);
            } else {
                res.status(200).json([]);
            }

        })
    } catch (e) {
        console.log(e);
        res.status(500).end();
    }
}
worksApi.get("/all", (req, res) => {
    const sql = "SELECT * FROM works WHERE visible = 1 ORDER BY date_create";
    works_get_all(sql, res);
});
worksApi.get("/admin/all", (req, res) => {
    const sql = "SELECT * FROM works";
    works_get_all(sql, res);
});

const works_get_image = (sql, id, res) => {
    if (isNaN(id)){
        res.status(400).send("Incorrect id");
    } else {
        database.query(sql, [id], function(error, results, fields){
            if (error){
                console.log(error);
                res.status(500).end();
            } else {
                if (results.length > 0){
                    res.end(results[0].data);
                } else {
                    res.status(400).send("Incorrect id");
                }
            }
        })
    }
}
worksApi.get("/image/:id", (req, res) => {
    const sql = "SELECT data FROM works_img WHERE id = ?";
    works_get_image(sql, req.params.id, res);
})


worksApi.post("/admin/image/upload/:work_id", (req, res) => {
    if (isNaN(req.params.work_id) || !("image" in req.files)){
        res.status(400).send("Incorrect id");
    } else {
        const sql = "SELECT * FROM works WHERE id = ?";
        database.query(sql, [req.params.work_id], function(error, results, fields){
            if (error) {
                console.log(error);
                res.status(500).send("Error");
            } else {
                if (results.length > 0){
                    const sql = "INSERT INTO works_img (ref, data) VALUES (?, ?)";
                    database.query(sql, [req.params.work_id, req.files.image.data], function(error, results, fields){
                        if (error){
                            console.log(error);
                            res.status(500).send("Error");
                        } else {
                            res.status(200).send("ok");
                        }
                    })
                }
            }
        })
    }
})

const works_delete = (sql, id, res) => {
    if (isNaN(id)){
        res.status(400).send("Incorrect id");
    } else {
        database.query(sql, [id], function(error, results, fields){
            if (error) {
                console.log(err);
                res.status(500).send("Error")
            } else {
                if (results.affectedRows  >= 1) {
                    res.status(200).send("Deleted");
                } else {
                    res.status(400).send("Incorrect id")
                }
            }
        })
    }
}
worksApi.delete("/admin/delete/:id", (req, res) => {
    const sql = "DELETE FROM works WHERE id = ?";
    works_delete(sql, req.params.id, res);

})
worksApi.delete("/admin/image/delete/:id", (req, res) => {
    const sql = "DELETE FROM works_img WHERE id = ?";
    works_delete(sql, req.params.id, res);
})

worksApi.post("/admin/new", (req, res) => {
    if (req.body.name){
        let sql = "INSERT INTO works (name) VALUES (?)";
        database.query(sql, [req.body.name], function(error, results, fields){
            if (error){
                res.status(500).send(error.message);
            } else {
                res.send("Ok");
            }
        })
    }
});

worksApi.put("/admin/update", (req, res) => {
    if (isNaN(req.body.id) || !(('description' in req.body) && ('link' in req.body) && ('visible' in req.body) && ('video_path' in req.body) && ('fav' in req.body))){
        res.status(400).send("Incorrect Request");
    } else {
        let show = req.body.visible;
        if (show !== false && show !== true && show !== 1 && show !== 0){
            show = false
        }

        let fav = req.body.fav;
        if (fav !== false && fav !== true && fav !== 1 && fav !== 0){
            fav = false
        }

        let video = req.body.video_path;
        if (video === ""){
            video = null;
        }
        let sql_update = "UPDATE works SET description = ?, link = ?, visible = ?, video_path = ?, fav = ? WHERE id = ?";
        database.query(sql_update, [req.body.description, req.body.link, show, video, fav, req.body.id], function(error, results, fields){
            if (error){
                console.log(error)
            } else if (results.affectedRows > 0){
                res.status(200).send("Updated");
            } else {
                res.status(400).send("Id not found");
            }
        });
    }
});

///-------------------------------------------------------------------------------
const skillsApi = express.Router();
skillsApi.get("/all", (req, res) => {
    let sql = "SELECT * FROM skills ORDER BY prio ASC, level DESC"
    database.query(sql, [], function(error, results, fields){
        if (error){
            console.log(error);
            res.status(500).end();
        } else {
            let datas = {}
            results.forEach((elt) => {
                if (!datas[elt.type]){
                    datas[elt.type] = []
                }
                datas[elt.type].push(elt);
            });
            res.json(datas);
        }
    })
})


///-------------------------------------------------------------------------------
api.use(logMiddle);
api.use(fileUpload);
api.use("/works/", worksApi);
api.use("/msg/", msgApi);
api.use("/skills/", skillsApi);

module.exports = api;