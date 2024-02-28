const request = require("supertest");
const { Rental } = require("../../models/rental.model");
const { User } = require("../../models/user.model");

const mongoose = require("mongoose");

describe("/returns", () => {
  let server;
  let customerId;
  let movieId;
  let rental;
  let token;

  const exec = () => {
    return request(server)
      .post("/returns")
      .set("x-auth-token", token)
      .send({ customerId, movieId });
  };

  beforeEach(async () => {
    server = require("../../index");

    (customerId = mongoose.Types.ObjectId()),
      (movieId = mongoose.Types.ObjectId()),
      (token = new User().generateAuthToken());
    rental = new Rental({
      customer: {
        _id: customerId,
        name: "12345",
        phone: "12345",
      },
      movie: {
        _id: movieId,
        title: "12345",
        dailyRentalRate: 2,
      },
    });

    await rental.save();
  });
  afterEach(async () => {
    await server.close();
    Rental.removeAllListeners({});
  });

  test("return 401 if client is not logged in", async () => {
    token = "";
    const res = await exec();
    expect(res.status).toBe(401);
  });

  test("return 400 if customer id is not provied", async () => {
    customerId = "";

    const res = await exec();

    expect(res.status).toBe(400);
  });

  test("return 400 if movie id is not provied", async () => {
    movieId = "";

    const res = await exec();
    expect(res.status).toBe(400);
  });

  test("return 404 if no rental found for this customer/movie", async () => {
    await Rental.remove({});

    const res = await exec();
    expect(res.status).toBe(404);
  });

  test("return 400 if return already processed", async () => {
    rental.dateReturned = new Date();
    await rental.save();

    const res = await exec();
    expect(res.status).toBe(400);
  });
});
