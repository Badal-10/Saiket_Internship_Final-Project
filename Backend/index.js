const express = require("express");
const cors = require("cors");
const usersRouter = require("./Routes/users");
const authRouter = require("./Routes/auths")
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

app.use(cors());

// Routes
app.use("/auths", authRouter);
app.use("/users", usersRouter);

app.get('/', (req, res) => {
  res.status(200).send('API is online and running!');
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Something went wrong!", details: err.message });
});


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server running on port http://localhost:${PORT}`);
});