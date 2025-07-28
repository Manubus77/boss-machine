const express = require("express");
const minionsRouter = express.Router();

const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
} = require("./db");

// Validating Minion ID and saving it to the mininonId param of the req object
minionsRouter.param("minionId", (req, res, next, id) => {
  const minion = getFromDatabaseById("minions", id);
  if (minion) {
    req.minion = minion;
    next();
  } else {
    res.status(404).send({ error: "Minion not found" });
  }
});

// GET all minions
minionsRouter.get("/", (req, res, next) => {
  const allMinions = getAllFromDatabase("minions");
  res.status(200).send(allMinions);
});

// GET a single minion by id
minionsRouter.get("/:minionId", (req, res, next) => {
  res.status(200).send(req.minion);
});

module.exports = minionsRouter;
