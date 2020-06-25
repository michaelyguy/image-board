const express = require("express");
const app = express();

app.use(express.static("public"));
const { getUrlAndTitle } = require("./db.js");

app.get("/images", (req, res) => {
    getUrlAndTitle().then((result) => {
        console.log("------RESULT IN /IMAGES------");
        console.log(result);
        res.json(result.rows);
    });
});

app.listen(8080, () => {
    console.log("IMAGEBOARD IS RUNNING");
});
