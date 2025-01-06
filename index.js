const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const nftRoutes = require("./routes/nftRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api", nftRoutes);

// MongoDB connection setup
const connectDB = require("./config/db");

connectDB();
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
