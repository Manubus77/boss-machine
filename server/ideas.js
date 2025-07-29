const express = require("express");
const ideasRouter = express.Router();

const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
  isValidIdea,
} = require("./db");

// Validating Idea ID and saving it to the ideaId param of the req object
ideasRouter.param("ideaId", (req, res, next, id) => {
  const idea = getFromDatabaseById("ideas", id);
  if (idea) {
    req.idea = idea;
    next();
  } else {
    res.status(404).send({ error: "Idea not found" });
  }
});

// GET all ideas
ideasRouter.get("/", (req, res, next) => {
  const allIdeas = getAllFromDatabase("ideas");
  res.status(200).send(allIdeas);
});

// GET idea by ID
ideasRouter.get("/:ideaId", (req, res, next) => {
  res.status(200).send(req.idea);
});

//Middleware for checking if the req body of for PUT/POST request are valid
const ideaValidation = (req, res, next) => {
  try {
    isValidIdea(req.body);
    next();
  } catch (err) {
    res.status(400).send({ error: err.message });
  }
};

//POST a new idea
ideasRouter.post("/", ideaValidation, (req, res, next) => {
  const newIdea = addToDatabase("ideas", req.body);
  res.status(201).send(newIdea);
});

//PUT an existing idea
ideasRouter.put("/:ideaId", ideaValidation, (req, res, next) => {
  req.body.id = req.params.ideaId;
  const updatedIdea = updateInstanceInDatabase("ideas", req.body);
  if (updatedIdea) {
    res.status(200).send(updatedIdea);
  } else {
    res.status(404).send({ error: "Idea not found or invalid" });
  }
});

//DELETE idea by ID
ideasRouter.delete("/:ideaId", (req, res, next) => {
  const deleted = deleteFromDatabasebyId("ideas", req.params.ideaId);
  if (deleted) {
    res.status(204).send();
  } else {
    res.status(404).send({ error: "Idea not found" });
  }
});

module.exports = ideasRouter;
