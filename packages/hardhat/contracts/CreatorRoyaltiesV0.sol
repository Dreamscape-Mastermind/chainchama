// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

/**
 * @title CreatorRoyaltiesV0
 * @dev 2026 Creator Economy v0: Trust-based royalty splits for creative collaborations
 * 
 * Core Features:
 * - Register creative projects with multiple contributors
 * - Automated royalty distribution based on ownership percentages
 * - Trust-based: No upfront fees, only gas (minimal on L2)
 * - Parallel contract support: Multiple projects can execute simultaneously
 * - Transparent on-chain record of all splits and payments
 * 
 * Use Cases:
 * - Music collaborations (producer, artist, featured artists)
 * - Digital art collections (artist, developer, community manager)
 * - Content creation (writer, editor, designer, marketer)
 * - Any creative work requiring fair, transparent revenue sharing
 */
contract CreatorRoyaltiesV0 is ReentrancyGuard, Ownable {
    
    // ============ State Variables ============
    
    struct Creator {
        address wallet;
        uint256 sharePercentage; // Out of 10000 (100.00%)
        string role; // e.g., "artist", "producer", "engineer"
    }
    
    struct Project {
        uint256 projectId;
        string name;
        string description;
        address initiator;
        Creator[] creators;
        uint256 totalReceived; // Total ETH/tokens received
        uint256 totalDistributed; // Total already distributed
        bool active;
        uint256 createdAt;
    }
    
    // Project ID => Project data
    mapping(uint256 => Project) public projects;
    
    // Project ID => Token Address => Balance
    mapping(uint256 => mapping(address => uint256)) public projectBalances;
    
    // Creator address => Project IDs they're part of
    mapping(address => uint256[]) public creatorProjects;
    
    uint256 public nextProjectId;
    uint256 public totalProjects;
    
    // Platform fee (0.5% = 50 basis points out of 10000)
    uint256 public platformFee = 50;
    address public feeCollector;
    
    // ============ Events ============
    
    event ProjectCreated(
        uint256 indexed projectId,
        string name,
        address indexed initiator,
        uint256 creatorCount
    );
    
    event RoyaltyReceived(
        uint256 indexed projectId,
        address indexed payer,
        uint256 amount,
        address token // address(0) for ETH
    );
    
    event RoyaltyDistributed(
        uint256 indexed projectId,
        address indexed creator,
        uint256 amount,
        address token
    );
    
    event ProjectStatusUpdated(
        uint256 indexed projectId,
        bool active
    );
    
    event CreatorAdded(
        uint256 indexed projectId,
        address indexed creator,
        uint256 sharePercentage,
        string role
    );
    
    // ============ Constructor ============
    
    constructor() Ownable(msg.sender) {
        feeCollector = msg.sender;
        nextProjectId = 1;
    }
    
    // ============ Core Functions ============
    
    /**
     * @notice Register a new creative project with royalty splits
     * @param _name Project name
     * @param _description Project description
     * @param _creators Array of creator addresses
     * @param _shares Array of share percentages (must sum to 10000)
     * @param _roles Array of creator roles
     */
    function registerProject(
        string memory _name,
        string memory _description,
        address[] memory _creators,
        uint256[] memory _shares,
        string[] memory _roles
    ) external returns (uint256) {
        require(_creators.length > 0, "At least one creator required");
        require(
            _creators.length == _shares.length && _creators.length == _roles.length,
            "Arrays length mismatch"
        );
        
        // Verify shares sum to 100%
        uint256 totalShares = 0;
        for (uint256 i = 0; i < _shares.length; i++) {
            require(_creators[i] != address(0), "Invalid creator address");
            require(_shares[i] > 0, "Share must be greater than 0");
            totalShares += _shares[i];
        }
        require(totalShares == 10000, "Shares must sum to 10000 (100%)");
        
        uint256 projectId = nextProjectId++;
        
        Project storage project = projects[projectId];
        project.projectId = projectId;
        project.name = _name;
        project.description = _description;
        project.initiator = msg.sender;
        project.active = true;
        project.createdAt = block.timestamp;
        
        // Add creators
        for (uint256 i = 0; i < _creators.length; i++) {
            project.creators.push(Creator({
                wallet: _creators[i],
                sharePercentage: _shares[i],
                role: _roles[i]
            }));
            
            creatorProjects[_creators[i]].push(projectId);
            
            emit CreatorAdded(projectId, _creators[i], _shares[i], _roles[i]);
        }
        
        totalProjects++;
        
        emit ProjectCreated(projectId, _name, msg.sender, _creators.length);
        
        return projectId;
    }
    
    /**
     * @notice Send royalty payment to a project (ETH)
     * @param _projectId Project to pay
     */
    function payRoyalty(uint256 _projectId) external payable nonReentrant {
        require(msg.value > 0, "Must send ETH");
        require(projects[_projectId].active, "Project not active");
        
        projects[_projectId].totalReceived += msg.value;
        projectBalances[_projectId][address(0)] += msg.value;
        
        emit RoyaltyReceived(_projectId, msg.sender, msg.value, address(0));
        
        // Auto-distribute
        _distributeRoyalties(_projectId, address(0));
    }
    
    /**
     * @notice Send ERC20 royalty payment to a project
     * @param _projectId Project to pay
     * @param _token Token address
     * @param _amount Amount to pay
     */
    function payRoyaltyERC20(
        uint256 _projectId,
        address _token,
        uint256 _amount
    ) external nonReentrant {
        require(_amount > 0, "Amount must be greater than 0");
        require(projects[_projectId].active, "Project not active");
        require(_token != address(0), "Use payRoyalty for ETH");
        
        IERC20(_token).transferFrom(msg.sender, address(this), _amount);
        
        projects[_projectId].totalReceived += _amount;
        projectBalances[_projectId][_token] += _amount;
        
        emit RoyaltyReceived(_projectId, msg.sender, _amount, _token);
        
        // Auto-distribute
        _distributeRoyalties(_projectId, _token);
    }
    
    /**
     * @notice Distribute accumulated royalties to creators
     * @param _projectId Project ID
     * @param _token Token address (address(0) for ETH)
     */
    function _distributeRoyalties(
        uint256 _projectId,
        address _token
    ) internal {
        uint256 balance = projectBalances[_projectId][_token];
        if (balance == 0) return;
        
        Project storage project = projects[_projectId];
        
        // Calculate platform fee
        uint256 feeAmount = (balance * platformFee) / 10000;
        uint256 distributableAmount = balance - feeAmount;
        
        // Transfer fee to collector
        if (feeAmount > 0) {
            if (_token == address(0)) {
                payable(feeCollector).transfer(feeAmount);
            } else {
                IERC20(_token).transfer(feeCollector, feeAmount);
            }
        }
        
        // Distribute to creators based on their share
        for (uint256 i = 0; i < project.creators.length; i++) {
            Creator memory creator = project.creators[i];
            uint256 creatorAmount = (distributableAmount * creator.sharePercentage) / 10000;
            
            if (creatorAmount > 0) {
                if (_token == address(0)) {
                    payable(creator.wallet).transfer(creatorAmount);
                } else {
                    IERC20(_token).transfer(creator.wallet, creatorAmount);
                }
                
                emit RoyaltyDistributed(_projectId, creator.wallet, creatorAmount, _token);
            }
        }
        
        project.totalDistributed += distributableAmount;
        projectBalances[_projectId][_token] = 0;
    }
    
    /**
     * @notice Manual distribution trigger (if auto-distribute disabled in future versions)
     * @param _projectId Project ID
     * @param _token Token address (address(0) for ETH)
     */
    function distributeRoyalties(
        uint256 _projectId,
        address _token
    ) external nonReentrant {
        _distributeRoyalties(_projectId, _token);
    }
    
    // ============ View Functions ============
    
    /**
     * @notice Get project details
     */
    function getProject(uint256 _projectId) external view returns (
        string memory name,
        string memory description,
        address initiator,
        uint256 creatorCount,
        uint256 totalReceived,
        uint256 totalDistributed,
        bool active
    ) {
        Project storage project = projects[_projectId];
        return (
            project.name,
            project.description,
            project.initiator,
            project.creators.length,
            project.totalReceived,
            project.totalDistributed,
            project.active
        );
    }
    
    /**
     * @notice Get all creators for a project
     */
    function getProjectCreators(uint256 _projectId) external view returns (
        address[] memory wallets,
        uint256[] memory shares,
        string[] memory roles
    ) {
        Project storage project = projects[_projectId];
        uint256 length = project.creators.length;
        
        wallets = new address[](length);
        shares = new uint256[](length);
        roles = new string[](length);
        
        for (uint256 i = 0; i < length; i++) {
            wallets[i] = project.creators[i].wallet;
            shares[i] = project.creators[i].sharePercentage;
            roles[i] = project.creators[i].role;
        }
    }
    
    /**
     * @notice Get all projects a creator is part of
     */
    function getCreatorProjects(address _creator) external view returns (uint256[] memory) {
        return creatorProjects[_creator];
    }
    
    /**
     * @notice Get project balance for a specific token
     */
    function getProjectBalance(
        uint256 _projectId,
        address _token
    ) external view returns (uint256) {
        return projectBalances[_projectId][_token];
    }
    
    // ============ Admin Functions ============
    
    /**
     * @notice Update project active status
     */
    function setProjectStatus(uint256 _projectId, bool _active) external {
        require(
            msg.sender == projects[_projectId].initiator || msg.sender == owner(),
            "Not authorized"
        );
        
        projects[_projectId].active = _active;
        emit ProjectStatusUpdated(_projectId, _active);
    }
    
    /**
     * @notice Update platform fee (only owner)
     */
    function setPlatformFee(uint256 _fee) external onlyOwner {
        require(_fee <= 500, "Fee too high (max 5%)"); // Max 5%
        platformFee = _fee;
    }
    
    /**
     * @notice Update fee collector address
     */
    function setFeeCollector(address _collector) external onlyOwner {
        require(_collector != address(0), "Invalid address");
        feeCollector = _collector;
    }
    
    // ============ Fallback ============
    
    receive() external payable {
        revert("Use payRoyalty function");
    }
}