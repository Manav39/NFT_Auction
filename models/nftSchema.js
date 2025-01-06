const nftSchema = new mongoose.Schema({
  contractAddress: { type: String, required: true }, // Contract address of the NFT
  tokenId: { type: String, required: true }, // Unique token ID of the NFT
  name: { type: String }, // Name of the NFT
  description: { type: String }, // Description of the NFT
  imageUrl: { type: String, required: true }, // URL for the NFT's image
  owner: { type: mongoose.Schema.Types.ObjectId, ref: "User" }, // Reference to the User who owns the NFT
  votes: { type: Number, default: 0 }, // Total number of votes received by the NFT
});

module.exports = mongoose.model("NFT", nftSchema);
