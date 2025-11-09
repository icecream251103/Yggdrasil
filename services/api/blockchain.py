"""
Blockchain utilities for interacting with deployed contracts
"""
import json
import os
from pathlib import Path
from typing import Optional
from web3 import Web3
from eth_account import Account

# Load environment
RPC_URL = os.getenv("RPC_URL", "https://sepolia.base.org")
PRIVATE_KEY = os.getenv("PRIVATE_KEY")

# Initialize Web3
w3 = Web3(Web3.HTTPProvider(RPC_URL))

# Load signer (backend minter account)
signer: Optional[Account] = None
if PRIVATE_KEY:
    signer = Account.from_key(PRIVATE_KEY)

# Load deployment info
CONTRACTS_DIR = Path(__file__).parent.parent.parent / "contracts"
DEPLOYMENTS_PATH = CONTRACTS_DIR / "deployments.json"

def load_deployments():
    """Load contract addresses from deployments.json"""
    if DEPLOYMENTS_PATH.exists():
        with open(DEPLOYMENTS_PATH, "r") as f:
            return json.load(f)
    return None

def load_contract_abi(contract_name: str):
    """Load contract ABI from artifacts"""
    abi_path = CONTRACTS_DIR / "artifacts" / "contracts" / f"{contract_name}.sol" / f"{contract_name}.json"
    if abi_path.exists():
        with open(abi_path, "r") as f:
            return json.load(f)["abi"]
    return None

def get_nft_contract():
    """Get GreenCertNFT contract instance"""
    deployments = load_deployments()
    if not deployments:
        raise ValueError("Deployments not found. Run contracts deploy first.")
    
    nft_address = deployments["contracts"]["GreenCertNFT"]["address"]
    nft_abi = load_contract_abi("GreenCertNFT")
    
    return w3.eth.contract(address=Web3.to_checksum_address(nft_address), abi=nft_abi)

def get_token_contract():
    """Get GreenLeafToken contract instance"""
    deployments = load_deployments()
    if not deployments:
        raise ValueError("Deployments not found. Run contracts deploy first.")
    
    token_address = deployments["contracts"]["GreenLeafToken"]["address"]
    token_abi = load_contract_abi("GreenLeafToken")
    
    return w3.eth.contract(address=Web3.to_checksum_address(token_address), abi=token_abi)

async def mint_nft_certificate(
    product_id: str,
    recipient_address: str,
    metadata_uri: str
) -> str:
    """
    Mint a GreenCert NFT
    Returns transaction hash
    """
    if not signer:
        raise ValueError("No signer configured. Set PRIVATE_KEY in .env")
    
    nft_contract = get_nft_contract()
    
    # Build transaction
    nonce = w3.eth.get_transaction_count(signer.address)
    
    tx = nft_contract.functions.mintCertificate(
        Web3.to_checksum_address(recipient_address),
        product_id,
        metadata_uri
    ).build_transaction({
        'from': signer.address,
        'nonce': nonce,
        'gas': 200000,
        'gasPrice': w3.eth.gas_price,
    })
    
    # Sign and send
    signed = signer.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
    
    return tx_hash.hex()

async def reward_tokens(
    recipient_address: str,
    amount_ether: float,
    reason: str
) -> str:
    """
    Reward GreenLeaf tokens
    Returns transaction hash
    """
    if not signer:
        raise ValueError("No signer configured. Set PRIVATE_KEY in .env")
    
    token_contract = get_token_contract()
    
    # Convert to wei (18 decimals)
    amount_wei = w3.to_wei(amount_ether, 'ether')
    
    # Build transaction
    nonce = w3.eth.get_transaction_count(signer.address)
    
    tx = token_contract.functions.reward(
        Web3.to_checksum_address(recipient_address),
        amount_wei,
        reason
    ).build_transaction({
        'from': signer.address,
        'nonce': nonce,
        'gas': 150000,
        'gasPrice': w3.eth.gas_price,
    })
    
    # Sign and send
    signed = signer.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
    
    return tx_hash.hex()

def check_certificate_exists(product_id: str) -> bool:
    """Check if a product already has a certificate"""
    nft_contract = get_nft_contract()
    return nft_contract.functions.hasCertificate(product_id).call()

def get_token_balance(address: str) -> float:
    """Get GreenLeaf token balance (in ether units)"""
    token_contract = get_token_contract()
    balance_wei = token_contract.functions.balanceOf(Web3.to_checksum_address(address)).call()
    return w3.from_wei(balance_wei, 'ether')
