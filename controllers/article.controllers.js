const {
  selectArticleById,
  selectArticles,
} = require("../models/article.model");

exports.getArticleById = (req, res, next) => {
  const { article_id } = req.params;

  selectArticleById(article_id)
    .then((article) => {
      if (article) {
        res.status(200).send({ article });
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.getArticles = (req, res, next) => {
    const { sort_by } = req.query;
    selectArticles(sort_by)
      .then((articles) => {
        res.status(200).send({ articles });
      })
      .catch(next);
};
