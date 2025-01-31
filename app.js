const express = require("express");
const app = express();
const { getApi, getApiTopics } = require("./controllers/api.controllers");
const {
  getArticleById,
  getArticles,
  patchArticleById,
} = require("./controllers/article.controllers");
const {
  getArticleComments,
  postComment,
  deleteCommentById,
} = require("./controllers/comments-controller");
const {
  psqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/handle-error");
const { fetchUsers } = require("./controllers/users-controllers");
const cors = require("cors");

app.use(express.json());

app.use(cors());
app.get("/api", getApi);
app.get("/api/topics", getApiTopics);
app.get("/api/articles/:article_id", getArticleById);

app.patch("/api/articles/:article_id", patchArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postComment);
app.delete("/api/comments/:comment_id", deleteCommentById);
app.get("/api/users", fetchUsers);

app.all("*", (req, res, next) => {
  res.status(404).send({ msg: "Route not found" });
});

app.use(psqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
