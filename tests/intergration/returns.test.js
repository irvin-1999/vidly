const moment = require("moment");
const request = require("supertest");
const { Rental } = require("../../models/rental.model");
const { User } = require("../../models/user.model");
const { Movie } = require("../../models/movies.model");

const mongoose = require("mongoose");

describe("/returns", () => {
  let server;
  let customerId;
  let movieId;
  let movie;
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

    movie = new Movie({
      _id: movieId,
      title: "12345",
      dailyRentalRate: 2,
      genre: {
        name: "12345",
      },
      numberInStock: 10,
    });

    await movie.save();

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
    Movie.removeAllListeners({});
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

  test("return 200 if we have valid request", async () => {
    const res = await exec();
    expect(res.status).toBe(200);
  });
  test("Should set returnDate if input is valid", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;

    expect(diff).toBeLessThan(10 * 1000);
  });

  test("Should set returnDate if input is valid", async () => {
    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);
    const diff = new Date() - rentalInDb.dateReturned;

    expect(diff).toBeLessThan(10 * 1000);
  });

  test("Should set rental fee input is valid", async () => {
    rental.dateOut = moment().add(-7, "days").toDate();
    await rental.save();

    const res = await exec();

    const rentalInDb = await Rental.findById(rental._id);

    expect(rentalInDb.rentalFee).toBe(14);
  });
  test("should increase the movie stock if input is valid", async () => {
    const res = await exec();

    const movieInDb = await Movie.findById(movieId);
    expect(movieInDb.numberInStock).toBe(movie.numberInStock + 1);
  });

  test("should return the rental if input is valid", async () => {
    const res = await exec();
    const rentalInDb = await Rental.findById(rental._id);

    expect(Object.keys(res.body)).toEqual(
      expect.arrayContaining([
        "dateOut",
        "dateReturned",
        "rentalFee",
        "customer",
        "movie",
      ])
    );
  });
});
