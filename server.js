const express = require("express");
const app = express();
const cors = require("cors");
const bodyParser = require("body-parser");

/* Do not change the following line! It is required for testing and allowing
 *  the frontend application to interact as planned with the api server
 */
const PORT = process.env.PORT || 4001;

// Add middleware for handling CORS requests from index.html
app.use(cors());

// Add middware for parsing request bodies here:
app.use(bodyParser.json());

// Test API
app.get("/api/test", (req, res) => {
  res.send("API is working!");
});

// Mount your existing apiRouter below at the '/api' path.
const apiRouter = require("./server/api");

app.use("/api", apiRouter);

// This conditional is here for testing purposes:
if (!module.parent) {
  app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });
}

module.exports = app;
