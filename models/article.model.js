const db = require("../db/connection");

exports.selectArticleById = (article_id) => {
  const query = `SELECT articles.*
                 FROM articles
                 WHERE article_id = $1`;

  return db.query(query, [article_id]).then(({ rows }) => {
    return rows[0];
  });
};

exports.selectArticles = async (
  sortBy = "created_at",
  order = "DESC",
  topic
) => {
  let queryString = `
  SELECT articles.author, articles.title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, CAST(COUNT(comments.comment_id) AS INTEGER) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id`;

  const queryParams = [];

  if (topic) {
    const validFilterQueries = [];
    const allTopics = await db.query("SELECT slug FROM topics");
    allTopics.rows.forEach((topic) => validFilterQueries.push(topic.slug));
    if (!validFilterQueries.includes(topic)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid input",
      });
    }
    queryString += ` WHERE articles.topic = $1`;
    queryParams.push(topic);
  }

  const validSortQueries = [
    "author",
    "title",
    "article_id",
    "topic",
    "created_at",
    "votes",
    "article_img_url",
    "comment_count",
  ];

  if (!validSortQueries.includes(sortBy)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input",
    });
  }

  const validOrderQueries = ["asc", "desc", "ASC", "DESC"];
  if (!validOrderQueries.includes(order)) {
    return Promise.reject({
      status: 400,
      msg: "Invalid input",
    });
  }
  queryString += ` GROUP BY articles.article_id,articles.author, articles.title, articles.topic, articles.created_at, articles.votes, articles.article_img_url ORDER BY ${sortBy} ${order}`;

  return db.query(queryString, queryParams).then(({ rows }) => {
    return rows;
  });
};

exports.updateArticleById = (inc_votes, article_id) => {
  return db
    .query(
      `UPDATE articles SET votes= votes+$1 WHERE article_id=$2 RETURNING *;`,
      [inc_votes, article_id]
    )
    .then((result) => {
      return result.rows[0];
    });
};

exports.updateVotesByArticle = async (newVotes, articleId) => {
  const { rows } = await db.query(
    `
  UPDATE articles
  SET
    votes = votes + $1
  WHERE article_id = $2
  RETURNING *;`,
    [newVotes, articleId]
  );
  const updatedArticle = rows;
  if (!updatedArticle.length) {
    return Promise.reject({
      status: 404,
      msg: `No article found for article_id: ${articleId}`,
    });
  }
  return updatedArticle[0];
};