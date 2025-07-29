const express = require("express");
const backlogsRouter = express.Router();

const {
  getAllFromDatabase,
  getFromDatabaseById,
  addToDatabase,
  updateInstanceInDatabase,
  deleteFromDatabasebyId,
  isValidMinion,
} = require("./db");

module.exports = backlogsRouter;
