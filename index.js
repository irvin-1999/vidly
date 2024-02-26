const winston = require("winston");
const express = require("express");
const app = express();
require("./startup/logging")();
require("./startup/routes")(app);
require("./startup/db")();
require("./startup/confiq")();
require("./startup/validation")();

const PORT = 3000;

const server = app.listen(PORT, () => {
  winston.info(`Listening on port ${PORT}`);
});

module.exports = server;
