const moment = require("moment");
const { Rental } = require("../models/rental.model");
const { Movie } = require("../models/movies.model");
const auth = require("../middleware/auth");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/returns", auth, async (req, res, next) => {
  if (!req.body.customerId)
    return res.status(400).send("CustmoerId not provided");

  if (!req.body.movieId) return res.status(400).send("Movie not provided");

  const rental = Rental.findOne({
    "customer._id": req.body.customerId,
    "movie._id": req.body.movieId,
  });

  if (!rental) return res.status(404).send("Rental Not found");
  if (rental.dateReturned)
    return res.status(400).send("Rental Already Processed");

  rental.dateReturned = new Date();
  const rentalDays = moment().diff(rental.dateOut, "days");
  rental.rentalFee = rentalDays * rental.movie.dailyRentalRate;

  await rental.save();

  await Movie.update(
    {
      _id: rental.movie._id,
    },
    {
      $inc: {
        numberInStock: 1,
      },
    }
  );

  return res.status(200).send();
});

module.exports = router;
