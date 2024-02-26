const request = require("supertest");
const { Genre } = require("../../models/genres.model");

let server;

describe("/Genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    server.close();
    await Genre.removeAllListeners({});
  });

  describe("GET /", () => {
    test("Should return all genres", async () => {
      // await Genre.collection.insertMany([
      //   { name: "genre1" },
      //   { name: "genre2" },
      // ]);
      const res = await request(server).get("/genres");

      expect(res.status).toBe(200);
      // expect(res.body.length).toBe(2);
      // expect(res.body.some((g) => g.name === "genre1")).toBeTruthy();
      // expect(res.body.some((g) => g.name === "genre2")).toBeTruthy();
    });
  });
  describe("GET /id", () => {
    test("should return genre if a valid id is passed", async () => {
      const genre = new Genre({ name: "genre1" });
      await genre.save();
      const res = await request(server).get("/genres/" + genre._id);
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
