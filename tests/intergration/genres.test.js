const request = require("supertest");

let server;

describe("/Genres", () => {
  beforeEach(() => {
    server = require("../../index");
  });
  // afterEach(() => {
  //   server.close();
  // });

  describe("GET /", () => {
    test("Should return all genres", async () => {
      const res = await request(server).get("/genres");

      expect(res.status).toBe(200);
    });
  });
});
