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

//Middleware for checking when a work is valid or not
const workValidation = (req, res, next) => {
  try {
    const work = req.body;
    if (work.minionId && work.minionId !== String(req.minion.id)) {
      throw new Error("minionId in body does not match URL param");
    }
    isValidWork(work);
    next();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

// GET all backlog from a minion by ID
minionsRouter.get("/:minionId/work", (req, res, next) => {
  const minionId = req.params.minionId;
  const allWorkItems = getAllFromDatabase("work").filter(
    (work) => work.minionId === minionId
  );
  res.status(200).send(allWorkItems);
});

// POST new work in backlog for a minion by ID
minionsRouter.post("/:minionId/work", workValidation, (req, res, next) => {
  const newWork = { ...req.body, minionId: req.minion.id };
  const addedWork = addToDatabase("work", newWork);
  res.status(201).send(addedWork);
});

// PUT existing work in backlog for a minion by ID
minionsRouter.put(
  "/:minionId/work/:workId",
  workValidation,
  (req, res, next) => {
    const { minionId, workId } = req.params;
    const existingWork = getFromDatabaseById("work", workId);

    if (!existingWork || existingWork.minionId !== minionId) {
      return res.status(404).send({ error: "Work not found for this minion" });
    }

    const updatedWork = { ...req.body, id: workId, minionId };
    const result = updateInstanceInDatabase("work", updatedWork);

    if (result) {
      res.status(200).send(result);
    } else {
      res.status(400).send({ error: "Invalid update data" });
    }
  }
);

// DELETE a single work in backlog for a minion by ID
minionsRouter.delete("/:minionId/work/:workId", (req, res, next) => {
  const { minionId, workId } = req.params;
  const work = getFromDatabaseById("work", workId);

  if (!work || work.minionId !== minionId) {
    return res.status(404).send({ error: "Work not found for this minion" });
  }

  const deleted = deleteFromDatabasebyId("work", workId);
  if (deleted) {
    res.status(204).send();
  } else {
    res.status(500).send({ error: "Failed to delete work" });
  }
});

module.exports = minionsRouter;
