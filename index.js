const express = require("express");
const app = express();

app.use(express.static("public"));
const { getUrlAndTitle } = require("./db.js");

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
    getUrlAndTitle().then((result) => {
        console.log("------RESULT IN /IMAGES------");
        console.log(result);
        res.json(result.rows);
    });
});

app.post("/upload", uploader.single("file"), (req, res) => {
    //// REQ.FILE IS THE FILE WE JUST UPLOADED
    console.log("file: ", req.file);
    //// REQ.BODY IS THE REST OF THE INPUT FIELD -username , description
    console.log("input: ", req.body);

    if (req.file) {
        /// MAKE DB INSERT FOR ALL THE INFO ////
        res.json({
            success: true,
        });
    } else {
        res.json({
            success: false,
        });
    }
});

app.listen(8080, () => {
    console.log("IMAGEBOARD IS RUNNING");
});
