const { Rental, validateRentals } = require("../models/rental.model");
const { Movie } = require("../models/movies.model");
const { Customer } = require("../models/customer.model");
const Fawn = require("fawn");
const express = require("express");

const router = express.Router();

Fawn.init("mongodb://localhost:27017/vidly");

router.get("/", async (req, res) => {
  const rentals = await Customer.find({}).sort("-dateOut");
  res.send(rentals);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res.status(404).send("The Customer with the given id was not found");

  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validateRentals(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const customer = await Customer.findById(req.body.customerId);
  if (!customer) return res.status(400).send("Invalid customer");

  const movie = await Movie.findById(req.body.movieId);
  if (!movie) return res.status(400).send("Invalid movie");

  if (movie.numberInStock === 0)
    return res.status(400).send("Movie not in Stock");

  let rental = new Rental({
    customer: {
      _id: customer._id,
      name: customer.name,
      phone: customer.phone,
    },
    movie: {
      _id: movie._id,
      title: movie.title,
      dailyRentalRate: movie.dailyRentalRate,
    },
  });

  try {
    new Fawn.Task()
      .save("rentals", rental)
      .update(
        "movies",
        { _id: movie._id },
        {
          $inc: { numberInStock: -1 },
        }
      )
      .run();

    res.send(rental);
  } catch (er) {
    res.status(500).send("Something Failed");
  }
});

module.exports = router;
