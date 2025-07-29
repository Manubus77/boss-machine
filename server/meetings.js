const express = require("express");
const meetingsRouter = express.Router();

const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
} = require("./db");

//GET all meetings
meetingsRouter.get("/", (req, res, next) => {
  const allMeetings = getAllFromDatabase("meetings");
  res.status(200).send(allMeetings);
});

module.exports = meetingsRouter;
