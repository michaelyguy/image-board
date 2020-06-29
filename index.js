const express = require("express");
const app = express();
const s3 = require("./s3.js");
const { s3Url } = require("./config.json");

app.use(express.static("public"));
const { getUrlAndTitle, addImage, getImageById } = require("./db.js");

////// FILE UPLOAD BOILERPLATE //////
const multer = require("multer");
const uidSafe = require("uid-safe");
const path = require("path");

const diskStorage = multer.diskStorage({
    destination: function (req, file, callback) {
        callback(null, __dirname + "/uploads");
    },
    filename: function (req, file, callback) {
        uidSafe(24).then(function (uid) {
            callback(null, uid + path.extname(file.originalname));
        });
    },
});

const uploader = multer({
    storage: diskStorage,
    limits: {
        fileSize: 2097152,
    },
});
//////////////////////////////////////

app.get("/images", (req, res) => {
    getUrlAndTitle()
        .then((result) => {
            // console.log("------RESULT IN GET /IMAGES------");
            // console.log(result);
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("----ERROR IN GET /IMAGES----", err);
        });
});

app.get("/image/:id", (req, res) => {
    console.log("----THIS. ID IN ID-------");
    console.log(req.params.id);

    getImageById(req.params.id)
        .then((result) => {
            console.log("-----RESULT IN /ID----");
            console.log(result);
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("ERROR IN CATCH /ID", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const imageUrl = `${s3Url}${filename}`;
    console.log("-----REQ.BODY------");

    console.log(req.body);

    if (filename) {
        addImage(imageUrl, req.body.title, req.body.description, req.body.user)
            .then((result) => {
                console.log("------RESULT------");
                console.log(result);
                res.json(result.rows[0]);
            })
            .catch((err) => {
                console.log("----ERROR IN POST /UPLOAD----", err);
            });
    } else {
        console.log("SOMETHING WENT WRONG!");
    }
});

app.listen(8080, () => {
    console.log("IMAGEBOARD IS RUNNING");
});
