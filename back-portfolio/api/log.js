const express = require("express");
const session = require("express-session");
const crypto = require("crypto");

module.exports =  function(db){
    const logMiddle = express.Router();
    const antiSpam = new (require("./antiSpam.js"))(4, 360000);
    function getHashedPassword(password){
        const sha256 = crypto.createHash('sha256');
        return sha256.update(password).digest('base64');
    }

    logMiddle.use(session( {secret: 'hahalolmdrr',
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false , maxAge : 3600000}
    }));

    logMiddle.put("/login/", (req, res) => {
        let ip = req.headers['x-forwarded-for'];
        if (antiSpam.verifyIP(ip)){
            if (req.body.disconnect){
                if (req.session.log){
                    req.session.log = false;
                    res.send("You're no longer logged");
                } else {
                    res.status(403);
                    res.send("You're not logged");
                }
            } else {
                let sql = "SELECT * FROM login WHERE id = ?";
                db.query(sql, [req.body.userName], function (error, results, fields){
                    if (error){
                        throw error;
                    }
                    if (results.length > 0 && results[0].password === getHashedPassword(req.body.pswd)){
                        req.session.log = true;
                        res.status(200).send("You're logged now");
                    } else {
                        antiSpam.addCount(ip);
                        res.status(403).send("Incorrect password or login");
                    }
                })
            }
        } else {
            res.status(400).send("Too many try. Try later");
        }
    })

    logMiddle.use("*/admin/", (req, res, next) => {
        if (req.session.log){
            next();
        } else {
            res.status(403);
            res.send("Forbidden");
        }
    })

    logMiddle.get("/admin/", (req, res) => {
        res.send("Connected");
    });

    return logMiddle;
}
