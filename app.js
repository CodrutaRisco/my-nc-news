const express = require("express");
const app = express();
const { getApi, getApiTopics } = require("./controllers/api.controllers");

app.get("/api", getApi);
app.get("/api/topics", getApiTopics);


module.exports = app;
