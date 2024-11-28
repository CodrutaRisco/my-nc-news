const { selectArticleComments } = require("../models/comments-model");
const {
  selectArticleById,
  selectArticles,
} = require("../models/article.model");

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      if (article) {
        next;
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .catch((err) => {
      next(err);
    });

  selectArticleComments(article_id)
    .then((comments) => {
      if (comments.length >= 0) {
        res.status(200).send({ comments });
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .catch((err) => {
      next(err);
    });
};
