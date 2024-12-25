require("dotenv").config(); // Load environment variables
const express = require("express");
const deployRoute = require("./routes/deployRoute");

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Routes
app.use("/api/deploy", deployRoute);

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
