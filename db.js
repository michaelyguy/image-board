const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

module.exports.getUrlAndTitle = () => {
    return db.query(`SELECT url, title FROM images`);
};

module.exports.addImage = (url, title, description, username) => {
    return db.query(`SELECT url, title, description, username FROM images`);
};
