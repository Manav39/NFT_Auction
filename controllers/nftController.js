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

const addNewNft = async (req, res) => {
  const {
    contractAddress,
    tokenId,
    name,
    description,
    tokenUri,
    timeLastUpdated,
  } = req.body;

  try {
    const nftExists = await Nft.findOne({ contractAddress, tokenId });
    if (nftExists) {
      return res
        .status(400)
        .json({ message: "NFT already exists in the database." });
    }

    const newNft = new Nft({
      contractAddress,
      tokenId,
      name,
      description,
      tokenUri,
      timeLastUpdated,
    });
    await newNft.save();
    res.status(201).json({ message: "NFT added successfully!", nft: newNft });
  } catch (error) {
    console.error("Error adding NFT:", error);
    res.status(500).json({ message: "Error adding NFT", error });
  }
};

const voteForNfts = async (req, res) => {
  const { voterId, selectedNFTs } = req.body;

  if (!selectedNFTs || selectedNFTs.length > 3) {
    return res
      .status(400)
      .json({ message: "You can vote for up to 3 NFTs only." });
  }

  try {
    const vote = new Votes({ voter: voterId, selectedNFTs });
    await vote.save();

    await Nft.updateMany(
      { _id: { $in: selectedNFTs } },
      { $inc: { votes: 1 } }
    );

    res.status(201).json({ message: "Votes cast successfully!" });
  } catch (error) {
    console.error("Error casting votes:", error);
    res.status(500).json({ message: "Error casting votes", error });
  }
};

const getNftsWithVoteCounts = async (req, res) => {
  const { parameter } = req.query;

  try {
    let nfts;
    if (parameter === "all") {
      nfts = await Nft.find().sort({ votes: -1 });
    } else {
      nfts = await Nft.find().sort({ votes: -1 }).limit(10);
    }
    res.json(nfts);
  } catch (error) {
    console.error("Error retrieving NFTs:", error);
    res.status(500).json({ message: "Error retrieving NFTs", error });
  }
};

module.exports = {
  fetchNftsForContract,
  getNftsForContract,
  addNewNft,
  voteForNfts,
  getNftsWithVoteCounts,
};
