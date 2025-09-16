const express = require("express");
const usersRouter = require("./Routes/users");

const app = express();
const PORT = 5000;

app.use(express.json()); // middleware for JSON

// Base route
app.get("/", (req, res) => {
  res.send("🚀 Task 4: User REST API is running...");
});

// Users route
app.use("/users", usersRouter);

app.listen(PORT, () => {
  console.log(`✅ Server is running on http://localhost:${PORT}`);
});
