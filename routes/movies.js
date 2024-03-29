const { Movie, validateMovie } = require("../models/movies.model");
const { Genre } = require("../models/genres.model");
const express = require("express");
const router = express.Router();

router.get("/", async (req, res) => {
  const movies = await Movie.find({}).sort("name");
  res.send(movies);
});

router.get("/:id", async (req, res) => {
  const movies = await Movie.findById(req.params.id);

  if (!movies)
    return res.status(404).send("The movie with the given id was not found");

  res.send(movies);
});

router.post("/", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let genre = await Genre.findById(req.body.genreId);
  if (!genre) return res.status(400).send("Invalid genre");

  const movie = new Movie({
    title: req.body.title,
    genre: {
      _id: genre._id,
      name: genre.name,
    },
    numberInStock: reg.body.numberInStock,
    dailyRentalRate: req.body.dailyRentalRate,
  });

  await movie.save();
  res.send(movie);
});

router.put("/:id", async (req, res) => {
  const { error } = validateMovie(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const movie = await Movie.findByIdAndUpdate(
    req.params.id,
    { name: reg.body.name },
    {
      new: true,
    }
  );

  if (!movie)
    return res.status(404).send("The movie with the given id was not found");

  return res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const movie = await Movie.findByIdAndRemove(req.params.id);

  if (!movie) {
    return res.status(404).send("The movie with the given id was not found");
  }

  res.send(movie);
});

module.exports = router;
