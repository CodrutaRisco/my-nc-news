const { selectArticleComments } = require("../models/comments-model");
const { selectArticleById } = require("../models/article.model");
const { updateArticleComments } = require("../models/comments-model");

exports.getArticleComments = (req, res, next) => {
  const { article_id } = req.params;
  selectArticleById(article_id)
    .then((article) => {
      if (article) {
        return selectArticleComments(article_id).then((comments) => {
          res.status(200).send({ comments });
        });
      } else {
        return Promise.reject({ status: 404, msg: "Not found" });
      }
    })
    .catch((err) => {
      next(err);
    });
};

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!req.body || !username || !body) {
    return next({ status: 400, msg: "Bad Request" });
  }

  updateArticleComments(body, username, article_id)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch((err) => {
      next(err);
    });
};


