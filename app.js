const express = require("express");
const app = express();
const { getApi, getApiTopics } = require("./controllers/api.controllers");
const {
  getArticleById,
  getArticles,
} = require("./controllers/article.controllers");
const {
  getArticleComments,
  postComment,
} = require("./controllers/comments-controller");
const {
  psqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/handle-error");

app.use(express.json());

app.get("/api", getApi);
app.get("/api/topics", getApiTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);
app.post("/api/articles/:article_id/comments", postComment);

app.all("*", (_, res) => {
  res.status(404).send({ msg: "not found" });
});
app.use(psqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
