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
    const sortedColumns = ["created_at"];

    if (sort_by && !sortedColumns.includes(sort_by)) {
      return Promise.reject({ status: 400, msg: "Invalid input" });
    }
    let query = `SELECT articles.article_id,
    articles.title,
    articles.author,
    articles.topic,
    articles.created_at,
    articles.votes,
    articles.article_img_url,
   COUNT(comments.article_id) AS comment_count
   FROM articles LEFT JOIN comments ON articles.article_id =comments.article_id
   GROUP BY articles.article_id
  `;
    query += `ORDER BY ${sort_by || "created_at"} DESC`;

    return db.query(query).then(({ rows }) => {
      return rows;
    });
};
