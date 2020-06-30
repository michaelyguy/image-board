const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

//// WHEN A USER SCROLL OR CLICK THE MORE BTN //////
module.exports.showMore = (id) => {
    return db.query(
        `SELECT * FROM images
                    WHERE id < $1
                    ORFER BY id DESC
                    LIMIT 20`,
        [id]
    );
};

module.exports.getUrlAndTitle = () => {
    return db.query(`SELECT * FROM images`);
};

module.exports.addImage = (url, title, description, username) => {
    return db.query(
        `INSERT INTO images (url, title, description, username) VALUES ($1, $2, $3, $4) RETURNING *`,
        [url, title, description, username]
    );
};

module.exports.getImageById = (id) => {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

module.exports.addComent = (comment, username, imageId) => {
    return db.query(
        `INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3) RETURNING *`,
        [comment, username, imageId]
    );
};

module.exports.getCommentById = (id) => {
    return db.query(`SELECT * FROM comments WHERE image_id = $1`, [id]);
};
