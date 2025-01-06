const { Alchemy, Network } = require("alchemy-sdk");
const Nft = require("../models/nftSchema");

const config = {
  apiKey: "6-_Vzfb_BgKE465ls6XhT8Cxf2y6JiDU",
  network: Network.ETH_SEPOLIA,
};
const alchemy = new Alchemy(config);

const fetchNftsForContract = async (req, res) => {
  const { contractAddress } = req.params;

  try {
    const nfts = await alchemy.nft.getNftsForContract(contractAddress);
    console.log(nfts);
    // Save NFTs in MongoDB
    // const nftPromises = nfts.ownedNfts.map(async (nft) => {
    //   const nftData = new Nft({
    //     contractAddress: contractAddress,
    //     tokenId: nft.id.tokenId,
    //     title: nft.title,
    //     description: nft.description,
    //     imageUrl: nft.media[0]?.gateway,
    //     metadata: nft.metadata,
    //   });

    //   await nftData.save();
    //});

    // await Promise.all(nftPromises);

    // res.status(200).json({ message: "NFTs fetched and stored successfully!" });
  } catch (error) {
    console.error("Error fetching NFTs:", error);
    res.status(500).json({ message: "Error fetching NFTs", error });
  }
};

const getNftsForContract = async (req, res) => {
  const { contractAddress } = req.params;

  try {
    const nfts = await Nft.find({ contractAddress });
    res.status(200).json(nfts);
  } catch (error) {
    console.error("Error retrieving NFTs:", error);
    res.status(500).json({ message: "Error retrieving NFTs", error });
  }
};

module.exports = { fetchNftsForContract, getNftsForContract };
