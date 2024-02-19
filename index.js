const mongoose = require("mongoose");

const genres = require("./routes/genres");
const customers = require("./routes/customers");
const express = require("express");
const app = express();

mongoose
  .connect("mongodb://localhost/vidly")
  .then(() => console.log("Connected to MongoDB..."))
  .catch((err) => console.error("Couldn't connect to MongoDb", err));

const PORT = 3000;

app.use(express.json());
app.use("/genres", genres);
app.use("/customers", customers);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
