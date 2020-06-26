const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

module.exports.getUrlAndTitle = () => {
    return db.query(`SELECT url, title FROM images`);
};

module.exports.addImage = (url, title, description, username) => {
    return db.query(
        `INSERT INTO images (url, title, description, username) VALUES ($1, $2, $3, $4) RETURNING *`,
        [url, title, description, username]
    );
};
