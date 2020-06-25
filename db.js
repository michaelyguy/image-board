const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

module.exports.getUrlAndTitle = () => {
    return db.query(`SELECT url, title FROM images`);
};
