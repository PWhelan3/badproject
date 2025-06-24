
const { ethers } = require("hardhat");

async function main() {
  console.log("Deploying GeoNFT contract to Sepolia testnet...");
  
  // Get the contract factory
  const GeoNFT = await ethers.getContractFactory("GeoNFT");
  
  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("Deploying contracts with the account:", deployer.address);
  console.log("Account balance:", (await deployer.getBalance()).toString());
  
  // Deploy the contract
  const geoNFT = await GeoNFT.deploy(deployer.address);
  await geoNFT.deployed();
  
  console.log("GeoNFT deployed to:", geoNFT.address);
  console.log("Transaction hash:", geoNFT.deployTransaction.hash);
  
  // Wait for a few block confirmations
  console.log("Waiting for block confirmations...");
  await geoNFT.deployTransaction.wait(6);
  
  // Verify the contract on Etherscan
  if (process.env.ETHERSCAN_API_KEY) {
    console.log("Verifying contract on Etherscan...");
    try {
      await hre.run("verify:verify", {
        address: geoNFT.address,
        constructorArguments: [deployer.address],
      });
      console.log("Contract verified on Etherscan");
    } catch (error) {
      console.log("Error verifying contract:", error);
    }
  }
  
  console.log("\n=== Deployment Summary ===");
  console.log("Contract Address:", geoNFT.address);
  console.log("Network: Sepolia Testnet");
  console.log("Deployer:", deployer.address);
  console.log("Etherscan URL:", `https://sepolia.etherscan.io/address/${geoNFT.address}`);
  
  console.log("\n=== Next Steps ===");
  console.log("1. Update CONTRACTS.NFT_CONTRACT in src/config/wagmi.js");
  console.log("2. Add the contract ABI to your frontend");
  console.log("3. Test minting functionality");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });