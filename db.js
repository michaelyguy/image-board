const spicedPg = require("spiced-pg");
const db = spicedPg(
    process.env.DATABASE_URL ||
        `postgres:postgres:postgres@localhost:5432/imageboard`
);

module.exports.showMore = (id) => {
    return db.query(
        `SELECT *,(
    SELECT id FROM images
    ORDER BY id ASC
    LIMIT 1
) AS "lowestId" FROM images
                    WHERE id < $1
                    ORDER BY id DESC
                    LIMIT 9`,
        [id]
    );
};

module.exports.getUrlAndTitle = () => {
    return db.query(`SELECT * FROM images ORDER BY id DESC LIMIT 9`);
};

module.exports.addImage = (url, title, description, username) => {
    return db.query(
        `INSERT INTO images (url, title, description, username) VALUES ($1, $2, $3, $4) 
        RETURNING *`,
        [url, title, description, username]
    );
};

module.exports.getImageById = (id) => {
    return db.query(`SELECT * FROM images WHERE id = $1`, [id]);
};

module.exports.addComent = (comment, username, imageId) => {
    return db.query(
        `INSERT INTO comments (comment, username, image_id) VALUES ($1, $2, $3) RETURNING *
        , TO_CHAR(created_at, 'DD. Month YYYY at HH:MI') AS created_at`,
        [comment, username, imageId]
    );
};

module.exports.getCommentById = (id) => {
    return db.query(`SELECT * FROM comments WHERE image_id = $1`, [id]);
};
