// Contract interaction utilities for frontend (read-only for MVP)

import { ethers } from 'ethers';

// Import deployment info (static for MVP)
// In production, fetch from API or environment
export const CONTRACTS = {
  baseSepolia: {
    chainId: 84532,
    rpcUrl: 'https://sepolia.base.org',
    // Will be filled after deployment
    GreenCertNFT: '0x...', // Replace with deployed address
    GreenLeafToken: '0x...', // Replace with deployed address
  },
};

// ABIs (minimal for reading)
const NFT_ABI = [
  'function totalSupply() view returns (uint256)',
  'function getProductId(uint256 tokenId) view returns (string)',
  'function hasCertificate(string productId) view returns (bool)',
  'function ownerOf(uint256 tokenId) view returns (address)',
];

const TOKEN_ABI = [
  'function totalSupply() view returns (uint256)',
  'function balanceOf(address account) view returns (uint256)',
  'function totalMinted() view returns (uint256)',
  'function remainingSupply() view returns (uint256)',
];

export async function getProvider(chainId: number = 84532) {
  // Use public RPC for reading (no wallet needed)
  const config = CONTRACTS.baseSepolia;
  return new ethers.JsonRpcProvider(config.rpcUrl);
}

export async function getNFTContract(chainId: number = 84532) {
  const provider = await getProvider(chainId);
  const config = CONTRACTS.baseSepolia;
  return new ethers.Contract(config.GreenCertNFT, NFT_ABI, provider);
}

export async function getTokenContract(chainId: number = 84532) {
  const provider = await getProvider(chainId);
  const config = CONTRACTS.baseSepolia;
  return new ethers.Contract(config.GreenLeafToken, TOKEN_ABI, provider);
}

// Read-only functions
export async function checkProductCertificate(productId: string): Promise<boolean> {
  try {
    const nft = await getNFTContract();
    return await nft.hasCertificate(productId);
  } catch (error) {
    console.error('Error checking certificate:', error);
    return false;
  }
}

export async function getTotalCertificates(): Promise<number> {
  try {
    const nft = await getNFTContract();
    const total = await nft.totalSupply();
    return Number(total);
  } catch (error) {
    console.error('Error getting total certificates:', error);
    return 0;
  }
}

export async function getTokenBalance(address: string): Promise<string> {
  try {
    const token = await getTokenContract();
    const balance = await token.balanceOf(address);
    return ethers.formatEther(balance);
  } catch (error) {
    console.error('Error getting token balance:', error);
    return '0';
  }
}

export async function getTotalTokensMinted(): Promise<string> {
  try {
    const token = await getTokenContract();
    const minted = await token.totalMinted();
    return ethers.formatEther(minted);
  } catch (error) {
    console.error('Error getting total minted:', error);
    return '0';
  }
}

// Helper to format addresses
export function shortenAddress(address: string): string {
  if (!address || address.length < 10) return address;
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

// Helper to get explorer URL
export function getExplorerUrl(txHash: string, chainId: number = 84532): string {
  if (chainId === 84532) {
    return `https://sepolia.basescan.org/tx/${txHash}`;
  }
  return `https://sepolia.etherscan.io/tx/${txHash}`;
}

export function getAddressExplorerUrl(address: string, chainId: number = 84532): string {
  if (chainId === 84532) {
    return `https://sepolia.basescan.org/address/${address}`;
  }
  return `https://sepolia.etherscan.io/address/${address}`;
}
