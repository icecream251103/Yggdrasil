import { ethers } from "hardhat";
import * as fs from "fs";
import * as path from "path";

async function main() {
  console.log("🌳 Deploying Yggdrasil contracts to testnet...\n");

  const [deployer] = await ethers.getSigners();
  console.log("Deployer address:", deployer.address);
  console.log("Deployer balance:", ethers.formatEther(await ethers.provider.getBalance(deployer.address)), "ETH\n");

  // Deploy GreenCertNFT
  console.log("Deploying GreenCertNFT...");
  const GreenCertNFT = await ethers.getContractFactory("GreenCertNFT");
  const greenCertNFT = await GreenCertNFT.deploy();
  await greenCertNFT.waitForDeployment();
  const nftAddress = await greenCertNFT.getAddress();
  console.log("✅ GreenCertNFT deployed to:", nftAddress, "\n");

  // Deploy GreenLeafToken
  console.log("Deploying GreenLeafToken...");
  const GreenLeafToken = await ethers.getContractFactory("GreenLeafToken");
  const greenLeafToken = await GreenLeafToken.deploy();
  await greenLeafToken.waitForDeployment();
  const tokenAddress = await greenLeafToken.getAddress();
  console.log("✅ GreenLeafToken deployed to:", tokenAddress, "\n");

  // Grant MINTER_ROLE to deployer (backend signer)
  const MINTER_ROLE = ethers.keccak256(ethers.toUtf8Bytes("MINTER_ROLE"));
  
  console.log("Granting MINTER_ROLE to deployer...");
  const tx1 = await greenCertNFT.grantRole(MINTER_ROLE, deployer.address);
  await tx1.wait();
  const tx2 = await greenLeafToken.grantRole(MINTER_ROLE, deployer.address);
  await tx2.wait();
  console.log("✅ MINTER_ROLE granted\n");

  // Save deployment info
  const network = await ethers.provider.getNetwork();
  const deployments = {
    network: {
      name: network.name,
      chainId: Number(network.chainId),
    },
    contracts: {
      GreenCertNFT: {
        address: nftAddress,
        deployer: deployer.address,
      },
      GreenLeafToken: {
        address: tokenAddress,
        deployer: deployer.address,
      },
    },
    deployer: deployer.address,
    deployedAt: new Date().toISOString(),
  };

  const deploymentsPath = path.join(__dirname, "..", "deployments.json");
  fs.writeFileSync(deploymentsPath, JSON.stringify(deployments, null, 2));
  console.log("📝 Deployment info saved to:", deploymentsPath, "\n");

  // Summary
  console.log("═══════════════════════════════════════");
  console.log("🎉 Deployment Complete!");
  console.log("═══════════════════════════════════════");
  console.log("Network:", network.name);
  console.log("Chain ID:", network.chainId);
  console.log("GreenCertNFT:", nftAddress);
  console.log("GreenLeafToken:", tokenAddress);
  console.log("Deployer:", deployer.address);
  console.log("═══════════════════════════════════════\n");

  console.log("Next steps:");
  console.log("1. Verify contracts on block explorer");
  console.log("2. Update backend .env with contract addresses");
  console.log("3. Test minting from backend signer");
  console.log("4. Update frontend with contract ABIs");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
