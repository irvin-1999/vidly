const { User } = require("../../models/user.model");
const { Genre } = require("../../models/genres.model");
const request = require("supertest");
const server = require("../../index");

describe("auth middleware", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  afterEach(async () => {
    await Genre.removeAllListeners({});
    server.close();
  });

  let token;
  const exec = () => {
    return request(server)
      .post("/genres")
      .set("x-auth-token", token)
      .send({ name: "genre1" });
  };

  beforeEach(() => {
    token = new User().generateAuthToken();
  });
  Test("should return 401 if no token is provided", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });
  Test("should return 400 if no token is provided", async () => {
    token = "a";
    const res = await exec();
    expect(res.status).toBe(400);
  });
  Test("should return 200 if no token is provided", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
});
