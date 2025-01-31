const endpointsJson = require("../endpoints.json");
/* Set up your test imports here */
const app = require("../app");
const request = require("supertest");
const testData = require("../db/data/test-data");
const seed = require("../db/seeds/seed");
const db = require("../db/connection");
require("jest-sorted");

/* Set up your beforeEach & afterAll functions here */
beforeEach(() => {
  return seed(testData);
});

afterAll(() => {
  return db.end();
});

describe("GET /api", () => {
  test("200: Responds with an object detailing the documentation for each endpoint", () => {
    return request(app)
      .get("/api")
      .expect(200)
      .then(({ body: { endpoints } }) => {
        expect(endpoints).toEqual(endpointsJson);
      });
  });
});

describe("GET /api/topics", () => {
  test("200: an array of topic object with 2 properties slug and descriptions", () => {
    return request(app)
      .get("/api/topics")
      .expect(200)
      .then(({ body }) => {
        const topics = body.topics;

        expect(topics).toHaveLength(3);
        topics.forEach((topic) => {
          expect(topic).toMatchObject({
            slug: expect.any(String),
            description: expect.any(String),
          });
        });
      });
  });
});

describe("GET /api/articles/:article_id", () => {
  test("200: Response with an an article object", () => {
    const article_id = 1;
    return request(app)
      .get(`/api/articles/${article_id}`)
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toMatchObject({
          article_id: 1,
          title: "Living in the shadow of a great man",
          topic: "mitch",
          author: "butter_bridge",
          body: "I find this existence challenging",
          created_at: expect.any(String),
          votes: 100,
          article_img_url: expect.any(String),
        });
      });
  });
  test("400: return 400 status for invalid article_id", () => {
    return request(app)
      .get(`/api/articles/invalid_id`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("404: return 404 status if article_id does not exit ", () => {
    return request(app)
      .get(`/api/articles/10000`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET: /api/articles", () => {
  test("respond with an articles array of article objects", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeInstanceOf(Array);
        expect(body.articles).toHaveLength(13);
        body.articles.forEach((article) => {
          expect(article).toMatchObject({
            author: expect.any(String),
            title: expect.any(String),
            article_id: expect.any(Number),
            topic: expect.any(String),
            created_at: expect.any(String),
            votes: expect.any(Number),
            article_img_url: expect.any(String),
            comment_count: expect.any(String),
          });
          expect(article.body).toBeUndefined();
        });
      });
  });
  test("respond with article sorted by date in descending order", () => {
    return request(app)
      .get("/api/articles")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("200: respond with articles sorted by existing sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=created_at")
      .expect(200)
      .then(({ body }) => {
        expect(body.articles).toBeSortedBy("created_at", { descending: true });
      });
  });
  test("400: respond 400 status for invalid sort_by column", () => {
    return request(app)
      .get("/api/articles?sort_by=invalid_id")
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("404: return 404 status if sort_by does not exit ", () => {
    return request(app)
      .get(`/api/articles/10000`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});

describe("GET: /api/articles/:article_id/comments", () => {
  test("200: respond with an array of comments for the given article_id", () => {
    const article_id = 9;

    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(200)
      .then(({ body }) => {
        expect(body.comments).toBeInstanceOf(Array);
        expect(body.comments).toHaveLength(2);
        body.comments.forEach((comment) => {
          expect(comment).toMatchObject({
            comment_id: expect.any(Number),
            votes: expect.any(Number),
            created_at: expect.any(String),
            author: expect.any(String),
            body: expect.any(String),
            article_id: expect.any(Number),
          });
        });
      });
  });
  test("400: respond 400 status for invalid id", () => {
    const article_id = "banana";

    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("404: return 404 status if id not exit ", () => {
    const article_id = 100001;
    return request(app)
      .get(`/api/articles/${article_id}/comments`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
});
describe("POST /api/articles/:article_id/comments", () => {
  test("status: 201 - should respond with the posted comment", () => {
    const testComment = {
      username: "butter_bridge",
      body: "a new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(201)
      .then(({ body }) => {
        const { comment } = body;

        expect(typeof comment).toBe("object");
        expect(Object.keys(comment)).toHaveLength(6);
        expect(comment).toMatchObject({
          comment_id: 19,
          body: expect.any(String),
          article_id: expect.any(Number),
          author: expect.any(String),
          votes: expect.any(Number),
          created_at: expect.any(String),
        });
      });
  });
  test("status: 201 - should ignore unnecessary properties given", () => {
    const testComment = {
      username: "butter_bridge",
      body: "a new comment",
      unnecessaryProperty: "unnecessary",
    };
    return request(app)
      .post("/api/articles/11/comments")
      .send(testComment)
      .expect(201);
  });
  test("status: 400 - should respond with bad request when article_id is an invalid type", () => {
    const testComment = {
      username: "butter_bridge",
      body: "a new comment",
    };
    return request(app)
      .post("/api/articles/NaN/comments")
      .send(testComment)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("status 404 - should respond with not found when username is an a non existent user", () => {
    const testComment = {
      username: "obi",
      body: "a new comment",
    };
    return request(app)
      .post("/api/articles/1/comments")
      .send(testComment)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("not found");
      });
  });
});

describe("PATCH /api/articles/:article_id", () => {
  test("200: responds with", () => {
    const article_id = 1;
    const newVotes = 8;

    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send({ inc_votes: newVotes })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: expect.any(Number),
          title: expect.any(String),
          body: expect.any(String),
          votes: expect.any(Number),
          topic: expect.any(String),
          author: expect.any(String),
          created_at: expect.any(String),
          article_img_url: expect.any(String),
        });
      });
  });
  test("QUERY: article_id; invalid id. status 400 and returns an error message", () => {
    const article_id = "invalid_url";
    const newVotes = 8;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send({ inc_votes: newVotes })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("QUERY: article_id; not existing. status 404 and returns an error message", () => {
    const article_id = 10000;
    const newVotes = 8;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send({ inc_votes: newVotes })
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Not found");
      });
  });
  test("Status 400, invalid inc_votes type", () => {
    const article_id = 7;
    const newVotes = "for";
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send({ inc_votes: newVotes })
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
  test("Status 200, missing `inc_votes` key. No effect to article.", () => {
    const article_id = 1;
    const newVotes = 0;
    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send({ inc_votes: newVotes })
      .expect(200)
      .then(({ body }) => {
        expect(body.article).toEqual({
          article_id: 1,
          title: "Living in the shadow of a great man",
          body: "I find this existence challenging",
          votes: 100,
          topic: "mitch",
          author: "butter_bridge",
          created_at: expect.any(String),
          article_img_url: expect.any(String),
        });
      });
  });
  test("Status 400, missing `inc_votes` key", () => {
    const article_id = 1;

    return request(app)
      .patch(`/api/articles/${article_id}`)
      .send({})
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("DELETE /api/comments/:comment_id", () => {
  test("204: deletes the given comment and responds with no content", () => {
    const comment_id = 1;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({});
      });
  });

  test("404: responds with an error if comment_id does not exist", () => {
    const comment_id = 99999;
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Comment not found");
      });
  });

  test("400: responds with an error for invalid comment_id", () => {
    const comment_id = "invalid";
    return request(app)
      .delete(`/api/comments/${comment_id}`)
      .expect(400)
      .then(({ body }) => {
        expect(body.msg).toBe("Invalid input");
      });
  });
});

describe("GET /api/users", () => {
  test("200: Responds with all users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(body.users.length).toBe(4);

        body.users.forEach((user) => {
          expect(typeof user.username).toBe("string");
          expect(typeof user.name).toBe("string");
          expect(typeof user.avatar_url).toBe("string");
        });
      });
  });
  test("200: Responds with a non-empty array of users", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then(({ body }) => {
        expect(Array.isArray(body.users)).toBe(true);
        expect(body.users.length).toBeGreaterThan(0);
      });
  });
  test("404: Responds with an error for invalid route", () => {
    return request(app)
      .get("/api/user")
      .expect(404)
      .then(({ body }) => {
        expect(body.msg).toBe("Route not found");
      });
  });
});
