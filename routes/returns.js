const Joi = require("joi");
const validate = require("../middleware/validate");
const { Rental } = require("../models/rental.model");
const { Movie } = require("../models/movies.model");
const auth = require("../middleware/auth");
const express = require("express");
const router = express.Router();

function validateReturns(req) {
  const schema = {
    customerId: Joi.objectId().required(),
    movieId: Joi.objectId().required(),
  };

  return Joi.validate(req, schema);
}

router.post("/", [auth, validate(validateReturns)], async (req, res, next) => {
  const rental = await Rental.lookup(req.body.customerId, req.body.movieId);

  if (!rental) return res.status(404).send("Rental Not found");
  if (rental.dateReturned)
    return res.status(400).send("Rental Already Processed");

  rental.return();

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

  return res.status(200).send(rental);
});

module.exports = router;
