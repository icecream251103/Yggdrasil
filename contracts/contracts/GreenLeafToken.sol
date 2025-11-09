// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/AccessControl.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/**
 * @title GreenLeafToken
 * @dev ERC-20 reward token for sustainable actions
 * Only accounts with MINTER_ROLE can mint (backend signer)
 */
contract GreenLeafToken is ERC20, AccessControl, Pausable {
    bytes32 public constant MINTER_ROLE = keccak256("MINTER_ROLE");
    
    uint256 public constant MAX_SUPPLY = 1_000_000_000 * 10**18; // 1 billion tokens
    uint256 public totalMinted;
    
    event TokensRewarded(address indexed recipient, uint256 amount, string reason);
    
    constructor() ERC20("GreenLeaf Token", "LEAF") {
        _grantRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _grantRole(MINTER_ROLE, msg.sender);
    }
    
    /**
     * @dev Reward tokens to user for green actions
     * @param recipient Address to receive tokens
     * @param amount Amount of tokens (in wei, with 18 decimals)
     * @param reason Description of reward reason
     */
    function reward(
        address recipient,
        uint256 amount,
        string memory reason
    ) public onlyRole(MINTER_ROLE) whenNotPaused {
        require(recipient != address(0), "Invalid recipient");
        require(amount > 0, "Amount must be positive");
        require(totalMinted + amount <= MAX_SUPPLY, "Max supply exceeded");
        
        totalMinted += amount;
        _mint(recipient, amount);
        
        emit TokensRewarded(recipient, amount, reason);
    }
    
    /**
     * @dev Batch reward to multiple recipients
     */
    function batchReward(
        address[] memory recipients,
        uint256[] memory amounts,
        string memory reason
    ) public onlyRole(MINTER_ROLE) whenNotPaused {
        require(recipients.length == amounts.length, "Arrays length mismatch");
        require(recipients.length > 0, "Empty arrays");
        
        uint256 totalAmount = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            totalAmount += amounts[i];
        }
        
        require(totalMinted + totalAmount <= MAX_SUPPLY, "Max supply exceeded");
        
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            require(amounts[i] > 0, "Amount must be positive");
            
            totalMinted += amounts[i];
            _mint(recipients[i], amounts[i]);
            
            emit TokensRewarded(recipients[i], amounts[i], reason);
        }
    }
    
    /**
     * @dev Get remaining supply
     */
    function remainingSupply() public view returns (uint256) {
        return MAX_SUPPLY - totalMinted;
    }
    
    /**
     * @dev Pause token operations (emergency)
     */
    function pause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _pause();
    }
    
    /**
     * @dev Unpause token operations
     */
    function unpause() public onlyRole(DEFAULT_ADMIN_ROLE) {
        _unpause();
    }
    
    /**
     * @dev Override transfer to respect pause
     */
    function _update(address from, address to, uint256 value)
        internal
        override
        whenNotPaused
    {
        super._update(from, to, value);
    }
    
    // Required override
    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(AccessControl)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
