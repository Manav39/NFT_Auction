const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  walletAddress: { type: String, required: true, unique: true }, // User's wallet address
  name: { type: String, required: true }, // User's name
  ownedNFTs: [{ type: mongoose.Schema.Types.ObjectId, ref: "NFT" }], // Array of NFTs owned by the user
});

module.exports = mongoose.model("User", userSchema);
