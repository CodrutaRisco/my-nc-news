const {
  selectArticleById,
  selectArticles,
  updateArticleById,
  updateVotesByArticle,
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
  const { sort_by, order, filter_by } = req.query;
  selectArticles(sort_by, order, filter_by)
    .then((result) => {
      res.status(200).send({ articles: result });
    })
    .catch(next);
};

exports.patchArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;

  if (!Number(article_id)) {
    return next({ status: 400, msg: "Invalid input" });
  }
  if (typeof inc_votes !== "number") {
    return next({ status: 400, msg: "Invalid input" });
  }

  updateArticleById(inc_votes, article_id)
    .then((article) => {
      if (!article) {
        return next({ status: 404, msg: "Not found" });
      }
      res.status(200).send({ article });
    })
    .catch((err) => {
      next(err);
    });
};

exports.updateArticleById = (req, res, next) => {
  const { article_id } = req.params;
  const { inc_votes } = req.body;
  updateVotesByArticle(inc_votes, article_id)
    .then((updatedArticle) => {
      res.status(200).send({ updatedArticle });
    })
    .catch(next);
};
