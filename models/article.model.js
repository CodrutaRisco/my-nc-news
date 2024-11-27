const db = require("../db/connection");
exports.selectArticleById = (article_id) => {
  const query = `SELECT articles.*
                 FROM articles
                 WHERE article_id = $1`;

  return db.query(query, [article_id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.selectArticles = (sort_by) => {
  let query = `SELECT articles.*,
   COUNT(comments.article_id) AS comment_count
   FROM articles LEFT JOIN comments ON articles.article_id =comments.article_id
   GROUP BY articles.article_id
  `;
  if (sort_by) {
    query += ` ORDER BY $(sort_by) DESC`;
  } else {
    query += ` ORDER BY created_at DESC`;
  }

  return db.query(query).then(({ rows }) => {
    console.log(rows);
    return rows;
  });
};
