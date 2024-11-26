const express = require("express");
const app = express();
const { getApi, getApiTopics } = require("./controllers/api.controllers");
const { getArticleById } = require("./controllers/article.controllers");
const { psqlErrors, handleCustomErrors } = require("./errors/handle-error");

app.get("/api", getApi);
app.get("/api/topics", getApiTopics);
app.get("/api/articles/:article_id", getArticleById);

app.use(psqlErrors);
app.use(handleCustomErrors);


module.exports = app;
