const express = require("express");
const meetingsRouter = express.Router();

const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
  createMeeting,
} = require("./db");

//GET all meetings
meetingsRouter.get("/", (req, res, next) => {
  const allMeetings = getAllFromDatabase("meetings");
  res.status(200).send(allMeetings);
});

//POST a new meeting
meetingsRouter.post("/", (req, res, next) => {
  const newMeeting = addToDatabase("meetings", createMeeting());
  res.status(201).send(newMeeting);
});

//DELETE all meetings
meetingsRouter.delete("/", (req, res, next) => {
  deleteAllFromDatabase("meetings");
  res.status(204).send();
});

module.exports = meetingsRouter;
