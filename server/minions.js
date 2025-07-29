const express = require("express");
const minionsRouter = express.Router();

const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
  isValidMinion,
  createWork,
  isValidWork,
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

//Middleware for checking if the req body of for PUT/POST request are valid
const minionValidation = (req, res, next) => {
  try {
    isValidMinion(req.body);
    next();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

// POST a new minion
minionsRouter.post("/", minionValidation, (req, res, next) => {
  const newMinion = addToDatabase("minions", req.body);
  res.status(201).send(newMinion);
});

// PUT a minion by ID
minionsRouter.put("/:minionId", minionValidation, (req, res, next) => {
  req.body.id = req.params.minionId;
  const updatedMinion = updateInstanceInDatabase("minions", req.body);
  if (updatedMinion) {
    res.status(200).send(updatedMinion);
  } else {
    res.status(404).send({ error: "Minion not found or invalid" });
  }
});

// DELETE a minion by ID
minionsRouter.delete("/:minionId", (req, res, next) => {
  const deleted = deleteFromDatabasebyId("minions", req.params.minionId);
  if (deleted) {
    res.status(204).send();
  } else {
    res.status(404).send({ error: "Minion not found" });
  }
});

//ROUTES FOR HANDLING MINIONS BACKLOGS

// GET all backlog from a minion by ID
minionsRouter.get("/:minionId/work", (req, res, next) => {
  const minionId = req.params.minionId;
  const allWorkItems = getAllFromDatabase("work").filter(
    (work) => work.minionId === minionId
  );
  res.status(200).send(allWorkItems);
});

// POST new work in backlog for a minion by ID
minionsRouter.post("/:minionId/work", (req, res, next) => {
  const minionId = req.params.minionId;
  const newWork = { ...req.body, minionId };

  if (!isValidWork(newWork)) {
    return res.status(400).send({ message: "Invalid work" });
  }

  const addedWork = addToDatabase("work", newWork);
  res.status(201).send(addedWork);
});

module.exports = minionsRouter;
