const { selectArticleComments } = require("../models/comments-model");
const {
  selectArticleById,
  selectArticles,
} = require("../models/article.model");
const { addCommentByArticleId } = require("../models/comments-model");
const { removeCommentById } = require("../models/comments-model");

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
  const { author, body } = req.body;

  if (
    !author ||
    !body ||
    typeof body !== "string" ||
    author.trim() === "" ||
    body.trim() === ""
  ) {
    return res.status(400).send({ msg: "Bad Request - Missing fields" });
  }
  if (isNaN(article_id)) {
    return res.status(400).send({ msg: "Bad Request - Invalid article_id" });
  }

  addCommentByArticleId(article_id, author, body)
    .then((comment) => {
      res.status(201).send({ comment });
    })
    .catch(next);
};

exports.deleteCommentById = (req, res, next) => {
  const { comment_id } = req.params;
if (!comment_id) {
  return res.status(400).send({ msg: "Missing comment_id" });
}
  removeCommentById(comment_id)
    .then(() => {
      res.status(204).send();
    })
    .catch((err) => {
      next(err);
    });
};