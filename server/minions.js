const express = require("express");
const minionsRouter = express.Router();

const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
} = require("./db");

// GET all minions

minionsRouter.get("/", (req, res, next) => {
  const allMinions = getAllFromDatabase("minions");
  res.status(200).send(allMinions);
});

// GET a single minion by id
minionsRouter.get("/minionId", (req, res, next) => {});

module.exports = minionsRouter;
