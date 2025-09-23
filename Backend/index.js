const express = require("express");
const usersRouter = require("./Routes/users");
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

// Routes
app.use("/users", usersRouter);

const PORT = 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running at http://localhost:${PORT}`)
);
