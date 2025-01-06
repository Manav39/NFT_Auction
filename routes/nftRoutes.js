const express = require("express");
const router = express.Router();
const Nft = require("../models/nftSchema");
const { Alchemy, Network } = require("alchemy-sdk");

const config = {
  apiKey: "6-_Vzfb_BgKE465ls6XhT8Cxf2y6JiDU",
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(config);

// Fetch NFTs for a specific contract address and store in MongoDB
router.post("/fetch-nfts/:contractAddress", async (req, res) => {
  const { contractAddress } = req.params;

  try {
    const nfts = await alchemy.nft.getNftsForContract(contractAddress);

    // Extract only required fields
    const nftData = nfts.nfts.map((nft) => ({
      contractAddress: contractAddress,
      tokenId: nft.tokenId,
      name: nft.name,
      description: nft.description,
      tokenUri: nft.tokenUri,
      timeLastUpdated: nft.timeLastUpdated,
    }));

    // Save to MongoDB
    await Nft.insertMany(nftData);
    res.json({ message: "NFTs fetched and stored successfully!" });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    res.status(500).json({ message: "Error fetching NFTs", error });
  }
});

// Retrieve NFTs for a given contract address from MongoDB
router.get("/nfts/:contractAddress", async (req, res) => {
  const { contractAddress } = req.params;

  try {
    const nfts = await Nft.find({ contractAddress });
    res.json(nfts);
  } catch (error) {
    console.error("Error retrieving NFTs:", error);
    res.status(500).json({ message: "Error retrieving NFTs", error });
  }
});

module.exports = router;
