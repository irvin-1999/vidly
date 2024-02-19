const mongoose = require("mongoose");
const Joi = require("joi");

function validateCustomer(customer) {
  const schema = {
    name: Joi.string().min(5).max(50).required(),
    phone: Joi.string().min(5).max(50).required(),
    isGold: Joi.Boolean(),
  };

  return Joi.validate(customer, schema);
}

const customerSchema = new mongoose.schema({
  name: {
    type: String,
    required: true,
    minLength: 5,
    maxLength: 50,
  },
  isGold: {
    type: Boolean,
    default: false,
  },
  phone: { type: String, required: true, minLength: 5, maxLength: 50 },
});

const Customer = mongoose.model("Customer", customerSchema);

module.exports = {
  Customer,
  validateCustomer,
};
