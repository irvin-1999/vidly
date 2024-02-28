const request = require("supertest");
const { Genre } = require("../../models/genres.model");
const { User } = require("../../models/user.model");
const mongoose = require("mongoose");

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
      expect(res.body).toHaveProperty("name", genre.name);
    });

    test("should return 404 if a valid id is passed", async () => {
      const res = await request(server).get("/genres/1");
      expect(res.status).toBe(404);
    });
    test("should return 404 if no genre with the given id exists", async () => {
      const id = mongoose.Types.ObjectId();
      const res = await request(server).get("/genres/" + id);
      expect(res.status).toBe(404);
    });
    // test("should return 404 if no genre with the given id exists", async () => {
    //   const id = mongoose.Types.ObjectId();
    //   const res = await request(server).get("/api/genres/" + id);

    //   expect(res.status).toBe(404);
    // });
  });

  describe("POST /", () => {
    let token;
    let name;
    const exec = async () => {
      return await request(server)
        .post("/genres")
        .set({ "x-auth-token": token })
        .send({ name });
    };

    beforeEach(() => {
      token = new User().generateAuthToken();
      name = "genre1";
    });

    test("should return 401 if client is not logged in", async () => {
      token = "";
      const res = await exec();
      expect(res.status).toBe(401);
    });
    test("should return 400 if genre is invalid/5 characters less", async () => {
      name = "1234";
      const res = await exec();
      expect(res.status).toBe(400);
    });
    test("should return 400 if genre is invalid/50 characters less", async () => {
      name = new Array(52).join("w");

      const res = await exec();
      expect(res.status).toBe(400);
    });
    test("should save genre if is valid", async () => {
      await exec();
      const genre = await Genre.find({ name: "genre1" });
      expect(genre).not.toBeNull();
    });
    test("should return genre if is valid", async () => {
      const res = await exec();

      expect(res.body).toHaveProperty("_id");
      expect(res.body).toHaveProperty("name", "genre1");
    });
  });
});
