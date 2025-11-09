# Yggdrasil Smart Contracts

Hardhat project cho Yggdrasil blockchain layer (testnet).

## Contracts

### GreenCertNFT (ERC-721)
- **Purpose**: Chứng chỉ xanh cho sản phẩm verified
- **Features**:
  - One NFT per product batch (unique `productId`)
  - Metadata URI (IPFS/HTTP)
  - Role-based minting (`MINTER_ROLE`)
  - Pausable (emergency stop)
- **Key Functions**:
  - `mintCertificate(recipient, productId, tokenURI)` → mint NFT
  - `getProductId(tokenId)` → get product ID
  - `hasCertificate(productId)` → check existence

### GreenLeafToken (ERC-20)
- **Purpose**: Reward token cho hành vi xanh
- **Features**:
  - Max supply: 1 billion tokens
  - Role-based minting (`MINTER_ROLE`)
  - Batch reward capability
  - Pausable
- **Key Functions**:
  - `reward(recipient, amount, reason)` → single reward
  - `batchReward(recipients[], amounts[], reason)` → batch
  - `remainingSupply()` → check available supply

## Tech Stack

- **Framework**: Hardhat
- **Solidity**: 0.8.24
- **Libraries**: OpenZeppelin Contracts v5
- **Networks**: Base Sepolia (primary), Sepolia ETH (fallback)

## Setup

```powershell
# Install dependencies
npm install

# Compile contracts
npm run compile

# Run tests (optional)
npm test

# Deploy to Base Sepolia
npm run deploy
```

## Environment Variables

Trong root `.env`:

```env
DEPLOYER_PRIVATE_KEY=your_private_key_here
BASE_SEPOLIA_RPC=https://sepolia.base.org
BASESCAN_API_KEY=your_basescan_api_key_for_verification
```

## Deployment

### 1. Get Testnet ETH

**Base Sepolia Faucet:**
- https://www.alchemy.com/faucets/base-sepolia
- https://portal.cdp.coinbase.com/products/faucet (Coinbase)

**Sepolia ETH Faucet:**
- https://www.alchemy.com/faucets/ethereum-sepolia
- https://sepoliafaucet.com/

### 2. Deploy

```powershell
# Compile first
npm run compile

# Deploy to Base Sepolia
npm run deploy

# Or deploy to Sepolia ETH
npx hardhat run scripts/deploy.ts --network sepolia

# Local (for testing)
npm run node  # terminal 1
npm run deploy:local  # terminal 2
```

### 3. Verify Output

Kiểm tra file `deployments.json`:

```json
{
  "network": {
    "name": "base-sepolia",
    "chainId": 84532
  },
  "contracts": {
    "GreenCertNFT": {
      "address": "0x...",
      "deployer": "0x..."
    },
    "GreenLeafToken": {
      "address": "0x...",
      "deployer": "0x..."
    }
  },
  "deployedAt": "2024-11-06T..."
}
```

## Contract Verification

Verify trên Basescan (sau deploy):

```powershell
npx hardhat verify --network baseSepolia <CONTRACT_ADDRESS>
```

## Backend Integration

### Load Deployment Info

```python
# services/api/blockchain.py
import json
from web3 import Web3
from eth_account import Account

with open("../../contracts/deployments.json") as f:
    deployments = json.load(f)

nft_address = deployments["contracts"]["GreenCertNFT"]["address"]
token_address = deployments["contracts"]["GreenLeafToken"]["address"]

w3 = Web3(Web3.HTTPProvider(os.getenv("RPC_URL")))
signer = Account.from_key(os.getenv("PRIVATE_KEY"))

# Load ABI from artifacts
with open("../../contracts/artifacts/contracts/GreenCertNFT.sol/GreenCertNFT.json") as f:
    nft_abi = json.load(f)["abi"]

nft_contract = w3.eth.contract(address=nft_address, abi=nft_abi)
```

### Mint Certificate

```python
def mint_certificate(product_id: str, recipient: str, metadata_uri: str):
    nonce = w3.eth.get_transaction_count(signer.address)
    
    tx = nft_contract.functions.mintCertificate(
        recipient,
        product_id,
        metadata_uri
    ).build_transaction({
        'from': signer.address,
        'nonce': nonce,
        'gas': 200000,
        'gasPrice': w3.eth.gas_price,
    })
    
    signed = signer.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
    
    return tx_hash.hex()
```

### Reward Tokens

```python
def reward_tokens(recipient: str, amount_ether: float, reason: str):
    amount_wei = w3.to_wei(amount_ether, 'ether')
    
    tx = token_contract.functions.reward(
        recipient,
        amount_wei,
        reason
    ).build_transaction({
        'from': signer.address,
        'nonce': w3.eth.get_transaction_count(signer.address),
        'gas': 150000,
        'gasPrice': w3.eth.gas_price,
    })
    
    signed = signer.sign_transaction(tx)
    tx_hash = w3.eth.send_raw_transaction(signed.rawTransaction)
    
    return tx_hash.hex()
```

## Testing

### Manual Test (Hardhat Console)

```powershell
npx hardhat console --network baseSepolia
```

```javascript
const GreenCertNFT = await ethers.getContractFactory("GreenCertNFT");
const nft = GreenCertNFT.attach("0x...");  // deployed address

// Mint test certificate
const tx = await nft.mintCertificate(
  "0xRecipientAddress",
  "prod-001",
  "ipfs://QmTest123"
);
await tx.wait();
console.log("Minted token ID:", await nft.totalSupply());
```

### Unit Tests

```powershell
npm test
```

Tạo file `test/GreenCertNFT.test.ts` nếu cần:

```typescript
import { expect } from "chai";
import { ethers } from "hardhat";

describe("GreenCertNFT", function () {
  it("Should mint certificate", async function () {
    const [owner, addr1] = await ethers.getSigners();
    const GreenCertNFT = await ethers.getContractFactory("GreenCertNFT");
    const nft = await GreenCertNFT.deploy();
    
    await nft.mintCertificate(addr1.address, "prod-001", "ipfs://test");
    
    expect(await nft.totalSupply()).to.equal(1);
    expect(await nft.getProductId(1)).to.equal("prod-001");
  });
});
```

## Security

- **MINTER_ROLE**: Chỉ backend signer (không public)
- **Private key**: NEVER commit, chỉ env vars
- **Pausable**: Admin có thể pause nếu phát hiện vấn đề
- **AccessControl**: OpenZeppelin role-based permissions
- **Testnet only**: MVP không deploy mainnet

## Roadmap

- [ ] Add events for frontend listening
- [ ] Batch minting for efficiency
- [ ] Metadata schema validation
- [ ] Transferable/non-transferable toggle
- [ ] Burn mechanism (if needed)
- [ ] Governance (DAO) for future

## Block Explorers

- **Base Sepolia**: https://sepolia.basescan.org/
- **Sepolia ETH**: https://sepolia.etherscan.io/

Paste contract address để xem transactions, events, code.
