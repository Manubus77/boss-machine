const express = require("express");
const apiRouter = express.Router();
const minionsRouter = require("./minions");

apiRouter.use("/minions", minionsRouter);

module.exports = apiRouter;

// Api test
apiRouter.get("/hello", (req, res) => {
  res.send("Hello from API Router!");
});

// Error handling middleware
