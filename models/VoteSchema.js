const mongoose = require("mongoose");

const votesSchema = new mongoose.Schema({
  voter: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // User casting the votes
  selectedNFTs: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "NFT",
      required: true,
      validate: {
        validator: function (value) {
          // Ensure that no more than 3 NFTs are selected
          return value.length <= 3;
        },
        message: "You can select up to 3 NFTs only.",
      },
    },
  ],
  createdAt: { type: Date, default: Date.now }, // Timestamp of when the vote was cast
});

module.exports = mongoose.model("Votes", votesSchema);
