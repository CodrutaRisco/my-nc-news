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
} = require("./controllers/comments-controller");
const {
  psqlErrors,
  handleCustomErrors,
  handleServerErrors,
} = require("./errors/handle-error");
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


app.use(psqlErrors);
app.use(handleCustomErrors);
app.use(handleServerErrors);

module.exports = app;
