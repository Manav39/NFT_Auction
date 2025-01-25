const { Alchemy, Network } = require("alchemy-sdk");
const Nft = require("../models/nftSchema");
const Votes = require("../models/VoteSchema");
const Team = require("../models/teamSchema");
const User = require("../models/userSchema");

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
    walletAddress,
    contractAddress,
    tokenId,
    name,
    description,
    tokenUri,
    timeLastUpdated,
  } = req.body;

  try {
    const nftExists = await Nft.findOne({ walletAddress });
    if (nftExists) {
      return res
        .status(400)
        .json({ message: "NFT already exists in the database." });
    }

    const newNft = new Nft({
      walletAddress,
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

const getAllNfts = async (req, res) => {
  try {
    const nfts = await Nft.find();
    res.status(200).json(nfts);
  } catch (error) {
    console.error("Error fetching all nfts:", error);
    res.status(500).json({ message: "Error fetching all nfts", error });
  }
};

const voteForNfts = async (req, res) => {
  const { walletAddress, voterId, selectedNFT } = req.body; // Now expecting a single selectedNFT
  try {
    const ownNft = await Nft.findById(selectedNFT);
    if (ownNft?.walletAddress === walletAddress) {
      return res
        .status(400)
        .json({ message: "You can't vote for your own NFT." });
    }

    const existingVote = await Votes.findOne({ voter: voterId });

    // If the voter has already voted
    if (existingVote) {
      if (existingVote.selectedNFTs.length >= 3) {
        return res
          .status(400)
          .json({ message: "You can vote for a maximum of 3 NFTs." });
      }
      // If not, add the new NFT to the selectedNFTs array
      existingVote.selectedNFTs.push(selectedNFT);

      // Save the updated vote record
      await existingVote.save();
    } else {
      // If this is the first time voting, create a new vote record with the selected NFT
      const vote = new Votes({
        voter: voterId,
        selectedNFTs: selectedNFT,
      });

      // Save the new vote record
      await vote.save();
    }

    // Update the votes for the selected NFT in the Nft collection
    await Nft.updateOne({ _id: selectedNFT }, { $inc: { votes: 1 } });

    res.status(201).json({ message: "Vote cast successfully!" });
  } catch (error) {
    console.error("Error casting vote:", error);
    res.status(500).json({ message: "Error casting vote", error });
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

const discardNft = async (req, res) => {
  const { nftId } = req.query;

  try {
    await Nft.deleteOne({ _id: nftId });
    res.status(200).json({ message: "NFT discarded successfully" });
  } catch (error) {
    console.error("Error discarding NFT:", error);
    res.status(500).json({ message: "Error discarding NFT", error });
  }
};

const addTeam = async (req, res) => {
  const {
    teamName,
    nftHoldCount = 0,
    currentBalance = 0,
    totalInvestment = 0,
  } = req.body;

  try {
    const newTeam = new Team({
      teamName,
      nftHoldCount,
      currentBalance,
      totalInvestment,
    });

    await newTeam.save();
    res.status(201).json({ message: "Team added successfully", team: newTeam });
  } catch (error) {
    console.error("Error adding team:", error);
    res.status(500).json({ message: "Error adding team", error });
  }
};

const getTeamsByTotalInvestment = async (req, res) => {
  try {
    const teams = await Team.find().sort({ cumulativeVoteCount: -1 });
    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching teams:", error);
    res.status(500).json({ message: "Error fetching teams", error });
  }
};

const getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json(teams);
  } catch (error) {
    console.error("Error fetching all teams:", error);
    res.status(500).json({ message: "Error fetching all teams", error });
  }
};

const modifyTeamNftHoldCount = async (req, res) => {
  const { teamId, biddingPrice, nftVoteCount } = req.body;

  if (!teamId || !biddingPrice || !nftVoteCount) {
    return res
      .status(400)
      .json({ message: "Team ID and bidding price are required" });
  }

  try {
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ message: "Team not found" });
    }

    team.nftHoldCount += 1;
    team.currentBalance = team.currentBalance - biddingPrice;
    team.totalInvestment = team.totalInvestment + biddingPrice;
    team.cumulativeVoteCount = team.cumulativeVoteCount + nftVoteCount;

    await team.save();

    res
      .status(200)
      .json({ message: "Team NFT hold count updated successfully", team });
  } catch (error) {
    console.error("Error modifying team NFT hold count:", error);
    res
      .status(500)
      .json({ message: "Error modifying team NFT hold count", error });
  }
};

const addUser = async (req, res) => {
  const { walletAddress, name } = req.body;
  try {
    const existingUser = await User.findOne({ walletAddress });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User with this wallet address already exists" });
    }

    const newUser = new User({
      walletAddress,
      name,
      ownedNFTs: [],
    });

    await newUser.save();
    res.status(201).json({ message: "User added successfully", user: newUser });
  } catch (error) {
    console.error("Error adding user:", error);
    res.status(500).json({ message: "Error adding user", error });
  }
};

const getAllUsers = async (req, res) => {
  try {
    // await User.deleteMany({});
    // await Votes.deleteMany({});
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.error("Error fetching all users:", error);
    res.status(500).json({ message: "Error fetching all users", error });
  }
};

module.exports = {
  fetchNftsForContract,
  getNftsForContract,
  addNewNft,
  voteForNfts,
  getNftsWithVoteCounts,
  discardNft,
  addTeam,
  getTeamsByTotalInvestment,
  getAllTeams,
  modifyTeamNftHoldCount,
  addUser,
  getAllUsers,
  getAllNfts,
};
