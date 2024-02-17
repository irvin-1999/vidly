const Joi = require("joi");
const express = require("express");
const app = express();

const PORT = 3000;

app.use(express.json());

const genres = [
  {
    id: 1,
    name: "Horror",
  },
  {
    id: 2,
    name: "Action",
  },
  {
    id: 3,
    name: "Comedy",
  },
];
function validateGenre(genre) {
  const schema = {
    name: Joi.string().min(3).required(),
  };

  return Joi.validate(genre, schema);
}

app.get("/", (req, res) => {
  res.send(genres);
});

app.get("/genres/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));

  if (!genre)
    return res.status(404).send("The course with the given id was not found");

  res.send(genre);
});

app.post("/genres", (req, res) => {
  const { error } = validateGenre(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  const genre = {
    id: genres.length + 1,
    name: req.body.name,
  };

  genres.push(genre);
  res.send(genre);
});

app.put("/genres/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));

  if (!genre) {
    return res.status(404).send("The course with the given id was not found");
  }

  const { error } = validateGenre(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }
  genre.name = req.body.name;
  return res.send(genre);
});

app.get("/genres/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));

  if (!genre) {
    return res.status(404).send("The genre with the given id was not found");
  }

  res.send(genre);
});

app.delete("/genres/:id", (req, res) => {
  const genre = genres.find((c) => c.id === parseInt(req.params.id));

  if (!genre) {
    return res.status(404).send("The genre with the given id was not found");
  }

  const index = genres.indexOf(genre);
  genres.splice(index, 1);
  res.send(genre);
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
