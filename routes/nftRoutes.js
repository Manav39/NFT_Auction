const express = require("express");
const router = express.Router();
const {
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
} = require("../controllers/nftController");

router.post("/fetch-nfts/:contractAddress", fetchNftsForContract);
router.get("/nfts/:contractAddress", getNftsForContract);
router.post("/nft", addNewNft);
router.post("/vote", voteForNfts);
router.get("/nfts-votes", getNftsWithVoteCounts);
router.delete("/discard-nft", discardNft);
router.post("/add-team", addTeam);
router.get("/get-top-teams", getTeamsByTotalInvestment);
router.get("/get-all-teams", getAllTeams);
router.put("/modify-team", modifyTeamNftHoldCount);
router.post("/add-user", addUser);
router.get("/get-all-users", getAllUsers);

module.exports = router;
