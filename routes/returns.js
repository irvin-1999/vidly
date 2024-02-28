const { Rental } = require("../models/rental.model");
const express = require("express");
const mongoose = require("mongoose");
const router = express.Router();

router.post("/returns", async (req, res, next) => {
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

  res.status(401).send("Unauthorized");
});

module.exports = router;
