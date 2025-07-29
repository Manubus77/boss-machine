const express = require("express");
const apiRouter = express.Router();
const minionsRouter = require("./minions");
const ideasRouter = require("./ideas.js");
const meetingsRouter = require("./meetings.js");

apiRouter.use("/minions", minionsRouter);
apiRouter.use("/ideas", ideasRouter);
apiRouter.use("/meetings", meetingsRouter);

// Api test
apiRouter.get("/hello", (req, res) => {
  res.send("Hello from API Router!");
});

module.exports = apiRouter;
