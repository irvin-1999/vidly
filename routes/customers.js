const { Customer, validateCustomer } = require("../models/customer.model");
const express = require("express");

const router = express.Router();

router.get("/", async (req, res) => {
  const customers = await Customer.find({}).sort("name");
  res.send(customers);
});

router.get("/:id", async (req, res) => {
  const customer = await Customer.findById(req.params.id);

  if (!customer)
    return res.status(404).send("The Customer with the given id was not found");

  res.send(customer);
});

router.post("/", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) return res.status(400).send(error.details[0].message);

  let customer = new Customer({
    name: req.body.name,
    phone: req.body.phone,
    isGold: req.body.isGold,
  });

  customer = await genre.save();
  res.send(customer);
});

router.put("/:id", async (req, res) => {
  const { error } = validateCustomer(req.body);
  if (error) {
    return res.status(400).send(error.details[0].message);
  }

  const genre = await Customer.findByIdAndUpdate(
    req.params.id,
    { name: reg.body.name },
    {
      new: true,
    }
  );

  if (!genre)
    return res.status(404).send("The Customer with the given id was not found");

  return res.send(genre);
});

router.delete("/:id", async (req, res) => {
  const genre = await Customer.findByIdAndRemove(req.params.id);

  if (!genre) {
    return res.status(404).send("The Customer with the given id was not found");
  }

  res.send(genre);
});

module.exports = router;
