const express = require("express");
const app = express();
const { getApi, getApiTopics } = require("./controllers/api.controllers");
const {
  getArticleById,
  getArticles,
} = require("./controllers/article.controllers");
const { getArticleComments } = require("./controllers/comments-controller");
const {
  psqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/handle-error");
const cors = require("cors");

app.get("/api", getApi);
app.get("/api/topics", getApiTopics);
app.get("/api/articles/:article_id", getArticleById);
app.get("/api/articles", getArticles);
app.get("/api/articles/:article_id/comments", getArticleComments);

app.use(cors());
app.use(psqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
