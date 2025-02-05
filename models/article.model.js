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
  filterBy
) => {
  let queryString = `
  SELECT articles.author, articles.title, articles.article_id, topic, articles.created_at, articles.votes, article_img_url, COUNT(comments) AS comment_count
  FROM articles
  LEFT JOIN comments
  ON articles.article_id = comments.article_id`;

  if (filterBy) {
    const validFilterQueries = [];
    const allTopics = await db.query("SELECT slug FROM topics");
    allTopics.rows.forEach((topic) => validFilterQueries.push(topic.slug));
    if (!validFilterQueries.includes(filterBy)) {
      return Promise.reject({
        status: 400,
        msg: "Invalid Filter Query",
      });
    }
    queryString += ` WHERE topic = '${filterBy}'`;
  }

  const validSortQueries = [];
  const allColumns = await db.query(`
    SELECT column_name
    FROM information_schema.columns
    WHERE table_name = 'articles';
  `);
  allColumns.rows.forEach((column) =>
    validSortQueries.push(column.column_name)
  );
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
      msg: "Invalid Order Query",
    });
  }
  queryString += ` GROUP BY articles.article_id ORDER BY ${sortBy} ${order}`;

  return db.query(queryString).then(({ rows }) => {
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