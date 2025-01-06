// Using 'require' syntax for CommonJS
const { Alchemy, Network } = require("alchemy-sdk");

const config = {
  apiKey: "6-_Vzfb_BgKE465ls6XhT8Cxf2y6JiDU",
  network: Network.ETH_SEPOLIA, // Ensure this is the correct network
};
const alchemy = new Alchemy(config);

const main = async () => {
  try {
    const nfts = await alchemy.nft.getNftsForContract(
      "0x74F8bfdE751C736a1D3E24037085F02E29Cd9d80"
    );
    // Print NFTs
    console.log(nfts);
  } catch (error) {
    console.error("Error fetching NFTs:", error);
  }
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();
