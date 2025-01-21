const mongoose = require("mongoose");

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  nftHoldCount: { type: Number, default: 0 },
  currentBalance: { type: Number, default: 0 },
  totalInvestment: { type: Number, default: 0 },
});

const Team = mongoose.model("Team", teamSchema);
module.exports = Team;
