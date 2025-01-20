const express = require("express");
const router = express.Router();
const {
  fetchNftsForContract,
  getNftsForContract,
  addNewNft,
  voteForNfts,
  getNftsWithVoteCounts,
} = require("../controllers/nftController");

router.post("/fetch-nfts/:contractAddress", fetchNftsForContract);
router.get("/nfts/:contractAddress", getNftsForContract);
router.post("/nft", addNewNft);
router.post("/vote", voteForNfts);
router.get("/nfts-votes", getNftsWithVoteCounts);

module.exports = router;
