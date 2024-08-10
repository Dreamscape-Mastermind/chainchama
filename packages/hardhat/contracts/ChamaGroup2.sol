// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract ChamaGroupOwnable is ReentrancyGuard, Ownable {
    using SafeMath for uint256;

    uint private nextId = 1;

    enum STATUS {
        ACTIVE,
        DELETED
    }

    struct Group {
        uint id;
        address creator;
        string name;
        string description;
        STATUS status;
        uint totalEtherContributions;
        address[] contributedTokens; // Array to track token addresses that have been contributed
        mapping(address => uint) totalTokenContributions; // token address => total contribution
        mapping(address => uint) etherContributions;
        mapping(address => mapping(address => uint)) tokenContributions; // contributor => token address => amount
        mapping(address => bool) isContributor;
        uint contributorCount;
        address[] contributors; // To safely iterate over contributors
    }

    mapping(uint => Group) private groups;
    mapping(address => uint[]) private contributorGroups;
    mapping(address => uint) private pendingEtherWithdrawals;
    mapping(address => mapping(address => uint)) private pendingTokenWithdrawals;

    event GroupCreated(uint indexed groupId, address groupCreator, string name, STATUS status);
    event GroupDeleted(uint indexed groupId, address groupCreator, STATUS status);
    event ContributorAdded(uint indexed groupId, address indexed newContributor);
    event ContributorRemoved(uint indexed groupId, address indexed contributor);
    event EtherWithdrawal(address indexed contributor, uint amount);
    event TokenWithdrawal(address indexed contributor, address token, uint amount);
    event TokenContribution(address indexed contributor, uint indexed groupId, address token, uint amount);

    constructor() {
        // Owner is set by Ownable
    }

    modifier groupExists(uint groupId) {
        require(groups[groupId].id != 0, "Group does not exist");
        _;
    }

    modifier onlyGroupCreator(uint groupId) {
        require(msg.sender == groups[groupId].creator, "Only the group creator can perform this action");
        _;
    }

    function createGroup(
        string memory _name,
        string memory _description
    ) public nonReentrant {
        require(bytes(_name).length > 0, "Name must not be empty");
        require(bytes(_description).length > 0, "Description must not be empty");

        Group storage newGroup = groups[nextId];
        newGroup.id = nextId;
        newGroup.creator = msg.sender;
        newGroup.name = _name;
        newGroup.description = _description;
        newGroup.status = STATUS.ACTIVE;
        newGroup.contributorCount = 1;

        newGroup.isContributor[msg.sender] = true;
        newGroup.etherContributions[msg.sender] = 0;
        newGroup.contributors.push(msg.sender);

        contributorGroups[msg.sender].push(nextId);

        emit GroupCreated(nextId, msg.sender, _name, STATUS.ACTIVE);

        nextId++;
    }

    function contributeEther(uint groupId) public payable nonReentrant groupExists(groupId) {
        Group storage group = groups[groupId];
        require(group.status == STATUS.ACTIVE, "Group is not active");

        group.etherContributions[msg.sender] = group.etherContributions[msg.sender].add(msg.value);
        group.totalEtherContributions = group.totalEtherContributions.add(msg.value);

        if (!group.isContributor[msg.sender]) {
            group.isContributor[msg.sender] = true;
            group.contributorCount++;
            group.contributors.push(msg.sender);
            contributorGroups[msg.sender].push(groupId);
            emit ContributorAdded(groupId, msg.sender);
        }
    }

    function contributeToken(uint groupId, address tokenAddress, uint amount) public nonReentrant groupExists(groupId) {
        require(tokenAddress != address(0), "Invalid token address");
        Group storage group = groups[groupId];
        require(group.status == STATUS.ACTIVE, "Group is not active");

        IERC20 token = IERC20(tokenAddress);
        require(token.transferFrom(msg.sender, address(this), amount), "Token transfer failed");

        group.tokenContributions[msg.sender][tokenAddress] = group.tokenContributions[msg.sender][tokenAddress].add(amount);
        group.totalTokenContributions[tokenAddress] = group.totalTokenContributions[tokenAddress].add(amount);

        // Track the token address if it's the first time it is contributed
        if (group.totalTokenContributions[tokenAddress] == amount) {
            group.contributedTokens.push(tokenAddress);
        }

        if (!group.isContributor[msg.sender]) {
            group.isContributor[msg.sender] = true;
            group.contributorCount++;
            group.contributors.push(msg.sender);
            contributorGroups[msg.sender].push(groupId);
            emit ContributorAdded(groupId, msg.sender);
        }

        emit TokenContribution(msg.sender, groupId, tokenAddress, amount);
    }

    function deleteGroup(uint groupId) public nonReentrant onlyGroupCreator(groupId) groupExists(groupId) {
        Group storage group = groups[groupId];
        require(group.status == STATUS.ACTIVE, "Group is not active");

        for (uint i = 0; i < group.contributors.length; i++) {
            address contributor = group.contributors[i];
            uint etherAmount = group.etherContributions[contributor];
            if (etherAmount > 0) {
                pendingEtherWithdrawals[contributor] = pendingEtherWithdrawals[contributor].add(etherAmount);
            }

            // Iterate over contributed tokens
            for (uint j = 0; j < group.contributedTokens.length; j++) {
                address tokenAddr = group.contributedTokens[j];
                uint tokenAmount = group.tokenContributions[contributor][tokenAddr];
                if (tokenAmount > 0) {
                    pendingTokenWithdrawals[tokenAddr][contributor] = pendingTokenWithdrawals[tokenAddr][contributor].add(tokenAmount);
                }
            }
        }

        group.status = STATUS.DELETED;

        emit GroupDeleted(groupId, msg.sender, STATUS.DELETED);
    }

    function withdrawEther() public nonReentrant {
        uint amount = pendingEtherWithdrawals[msg.sender];
        require(amount > 0, "No Ether to withdraw");
        require(address(this).balance >= amount, "Insufficient contract balance");

        pendingEtherWithdrawals[msg.sender] = 0;

        (bool success, ) = payable(msg.sender).call{value: amount}("");
        require(success, "Ether withdrawal failed");

        emit EtherWithdrawal(msg.sender, amount);
    }

    // do we need to ensure the correct wei units?

    function withdrawToken(address tokenAddress) public nonReentrant {
        uint amount = pendingTokenWithdrawals[tokenAddress][msg.sender];
        require(amount > 0, "No tokens to withdraw");

        pendingTokenWithdrawals[tokenAddress][msg.sender] = 0;

        IERC20 token = IERC20(tokenAddress);
        require(token.transfer(msg.sender, amount), "Token withdrawal failed");

        emit TokenWithdrawal(msg.sender, tokenAddress, amount);
    }

    function getGroupById(uint groupId) public view groupExists(groupId) returns (
        uint id,
        address creator,
        string memory name,
        string memory description,
        STATUS status,
        uint totalEtherContributions,
        uint contributorCount
    ) {
        Group storage group = groups[groupId];
        require(group.status == STATUS.ACTIVE, "Group is not active");

        return (
            group.id,
            group.creator,
            group.name,
            group.description,
            group.status,
            group.totalEtherContributions,
            group.contributorCount
        );
    }

    function getGroupsByContributor(address contributor) public view returns (uint[] memory) {
        return contributorGroups[contributor];
    }

    fallback() external payable {
        revert("Fallback function triggered, no ether accepted");
    }

    receive() external payable {
        revert("Contract does not accept direct ether payments");
    }
}
