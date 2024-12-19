const { selectArticleComments } = require("../models/comments-model");
const {
  selectArticleById,
  selectArticles,
} = require("../models/article.model");
const { addCommentByArticleId } = require("../models/comments-model");

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

exports.postComment = (req, res, next) => {
  const { article_id } = req.params;
  const { username, body } = req.body;

  if (!username || !body) {
    return res.status(400).send({ msg: "Bad Request - Missing fields" });
  }
  addCommentByArticleId(article_id, username, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};