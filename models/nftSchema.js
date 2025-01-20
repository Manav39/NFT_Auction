const mongoose = require("mongoose");

const nftSchema = new mongoose.Schema({
  contractAddress: { type: String, required: true },
  tokenId: { type: String, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  tokenUri: { type: String, required: true },
  timeLastUpdated: { type: Date, required: true },
  votes: { type: Number, default: 0 },
});

const Nft = mongoose.model("Nft", nftSchema);
module.exports = Nft;
