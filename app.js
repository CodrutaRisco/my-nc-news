const express = require("express");
const app = express();
const { getApi, getApiTopics } = require("./controllers/api.controllers");
const { getArticleById } = require("./controllers/article.controllers");

app.get("/api", getApi);
app.get("/api/topics", getApiTopics);
app.get("/api/articles/:article_id", getArticleById);

app.use((err, req, res, next) => {
  console.log(err, "------>err");
  res.status(500).send({ msg: "******hello" });
});

module.exports = app;
