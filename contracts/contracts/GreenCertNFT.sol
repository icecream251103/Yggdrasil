// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title GreenCertNFT
 * @dev ERC-721 NFT representing verified green product certificates
 * Only accounts with MINTER_ROLE can mint (backend signer)
 */
contract GreenCertNFT is ERC721URIStorage, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    uint256 private _tokenIdCounter;
    
    // Mapping from token ID to product ID
    mapping(uint256 => string) public tokenToProduct;
    
    // Mapping from product ID to token ID (one cert per product batch)
    mapping(string => uint256) public productToToken;
    
    event CertificateMinted(
        uint256 indexed tokenId,
        string indexed productId,
        address indexed recipient,
        string tokenURI
    );
    
    constructor() ERC721("Yggdrasil Green Certificate", "YGGCERT") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    /**
     * @dev Mint a new green certificate NFT
     * @param recipient Address to receive the NFT
     * @param productId Unique product identifier
     * @param tokenURI Metadata URI (IPFS or HTTP)
     * @return tokenId The minted token ID
     */
    function mintCertificate(
        address recipient,
        string memory productId,
        string memory tokenURI
    ) public onlyRole(MINTER_ROLE) whenNotPaused returns (uint256) {
        require(bytes(productId).length > 0, "Product ID required");
        require(productToToken[productId] == 0, "Certificate already exists for this product");
        
        _tokenIdCounter++;
        uint256 tokenId = _tokenIdCounter;
        
        _safeMint(recipient, tokenId);
        _setTokenURI(tokenId, tokenURI);
        
        tokenToProduct[tokenId] = productId;
        productToToken[productId] = tokenId;
        
        emit CertificateMinted(tokenId, productId, recipient, tokenURI);
        
        return tokenId;
    }
    
    /**
     * @dev Get product ID for a token
     */
    function getProductId(uint256 tokenId) public view returns (string memory) {
        require(ownerOf(tokenId) != address(0), "Token does not exist");
        return tokenToProduct[tokenId];
    }
    
    /**
     * @dev Check if product has certificate
     */
    function hasCertificate(string memory productId) public view returns (bool) {
        return productToToken[productId] != 0;
    }
    
    /**
     * @dev Get total certificates minted
     */
    function totalSupply() public view returns (uint256) {
        return _tokenIdCounter;
    }
    
    /**
     * @dev Pause minting (emergency)
     */
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause minting
     */
    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
    
    // Required overrides
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721URIStorage, AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
