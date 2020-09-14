const express = require("express");
const app = express();
const s3 = require("./s3.js");
const { s3Url } = require("./config.json");

app.use(express.static("public"));
const {
    getUrlAndTitle,
    addImage,
    getImageById,
    showMore,
    addComent,
    getCommentById,
} = require("./db.js");

///// DEALING WITH THE /COMMENT POST ///////
app.use(express.json());

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
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("error in get/images: ", err);
        });
});

//// CHECK FOR SHOW MORE ////
app.get("/showMore/:id", (req, res) => {
    showMore(req.params.id)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("error in get/showmore", err);
        });
});

app.get("/image/:id", (req, res) => {
    getImageById(req.params.id)
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("error in get /image/:id", err);
        });
});

app.get("/comments/:id", (req, res) => {
    getCommentById(req.params.id)
        .then((result) => {
            res.json(result.rows);
        })
        .catch((err) => {
            console.log("error in get /comments/:id", err);
        });
});

app.post("/comment/:id", (req, res) => {
    addComent(req.body.comment, req.body.comment_username, req.params.id)
        .then((result) => {
            res.json(result.rows[0]);
        })
        .catch((err) => {
            console.log("error in post /comment/:id", err);
        });
});

app.post("/upload", uploader.single("file"), s3.upload, (req, res) => {
    const { filename } = req.file;
    const imageUrl = `${s3Url}${filename}`;

    if (filename) {
        addImage(imageUrl, req.body.title, req.body.description, req.body.user)
            .then((result) => {
                res.json(result.rows[0]);
            })
            .catch((err) => {
                console.log("error in post /upload", err);
            });
    } else {
        console.log("SOMETHING WENT WRONG!");
    }
});

app.listen(8080, () => {
    console.log("IMAGEBOARD IS RUNNING");
});
