const db = require("../db/connection");


exports.selectArticleComments = (article_id) => {
  const query = `SELECT 
    comments.comment_id,
comments.votes,
comments.created_at,
comments.author,
comments.body,
comments.article_id
FROM comments
  INNER JOIN articles ON comments.article_id = articles.article_id
  WHERE articles.article_id = $1 
  ORDER BY comments.created_at DESC`;
  return db.query(query, [article_id]).then((result) => {
    return result.rows;
  });
};

exports.addCommentByArticleId = (article_id, author, body) => {
  return db
    .query("SELECT * FROM articles WHERE article_id = $1", [article_id])
    .then(({ rows }) => {
      if (rows.length === 0) {
        return Promise.reject({
          status: 404,
          msg: "Article not found",
        });
      }

      const query = `
        INSERT INTO comments (author, body, article_id)
        VALUES ($1, $2, $3)
        RETURNING *;
      `;

      return db.query(query, [author, body, article_id]);
    })
    .then(({ rows }) => {
      return rows[0];
    })
    .catch((err) => {
      if (err.code === "23503" && err.constraint.includes("author")) {
        return Promise.reject({
          status: 404,
          msg: "Not found - User does not exist",
        });
      }
      return Promise.reject(err);
    });
};



exports.removeCommentById = (comment_id) => {
  return db
    .query(`DELETE FROM comments WHERE comment_id=$1 RETURNING*`, [comment_id])
    .then((result) => {
      if (result.rowCount === 0) {
        return Promise.reject({ status: 404, msg: "Comment not found" });
      }
    });
};