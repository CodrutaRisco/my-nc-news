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

exports.addCommentByArticleId = (article_id, username, body) => {
  const query = `
    INSERT INTO comments (author, body, article_id)
    VALUES ($1, $2, $3)
    RETURNING *;
  `;

  return db.query(query, [username, body, article_id]).then(({ rows }) => {
    return rows[0];
  });
};