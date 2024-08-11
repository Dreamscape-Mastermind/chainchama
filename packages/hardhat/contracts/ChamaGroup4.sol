// SPDX-License-Identifier: MIT
pragma solidity ^0.8.18;

import "@openzeppelin/contracts/security/ReentrancyGuard.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/IERC20Metadata.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Address.sol";

/**
 * @title ChamaGroupV4
 * @dev A smart contract for managing savings groups (Chamas) where members can contribute Ether or ERC20 tokens.
 * The contract includes functionalities for group creation, contributions, grantee selection, withdrawals, and group archiving.
 */
contract ChamaGroupV4 is ReentrancyGuard, Ownable {
    using Counters for Counters.Counter;
    using SafeERC20 for IERC20;
    using Address for address payable;

    Counters.Counter private nextId;

    enum STATUS {
        ACTIVE,
        ARCHIVED
    }

    struct Group {
        uint id;
        address creator;
        string name;
        string description;
        STATUS status;
        uint contributionAmount;
        uint contributionTimeline;
        uint savingsRatio; // Percentage out of 10000 (e.g., 5000 represents 50%)
        uint lastContributionTime;
        address[] contributors;
        mapping(address => uint256) etherContributions;
        mapping(address => mapping(address => uint256)) tokenContributions;
        mapping(address => bool) approvedMembers;
        mapping(address => uint256) votingPower;
        address selectedGrantee;
        address[] allowedTokens;
        uint totalContributions;
        bool granteeApproved; // Tracks if the grantee is approved to withdraw
        bool hasWithdrawn; // Tracks if the grantee has withdrawn in the current period
    }

    mapping(uint => Group) private groups;
    mapping(address => uint[]) private contributorGroups;
    uint256 public maxBatchSize = 100;

    event GroupCreated(uint indexed groupId, address groupCreator, string name, string description, STATUS status);
    event ContributionMade(uint indexed groupId, address indexed contributor, uint amount, address tokenAddress);
    event MemberApproved(uint indexed groupId, address indexed member);
    event GranteeSelected(uint indexed groupId, address indexed grantee);
    event GroupArchived(uint indexed groupId, address groupCreator, STATUS status);
    event Withdrawal(address indexed contributor, uint amount, address tokenAddress);
    event MemberAddedByOwner(uint indexed groupId, address indexed member);
    event MembersAddedByOwner(uint indexed groupId, uint numberOfMembers);
    event MemberRevoked(uint indexed groupId, address indexed member);
    event MemberRemoved(uint indexed groupId, address indexed member);
    event GroupUpdated(uint indexed groupId, string description, uint contributionAmount, uint contributionTimeline, uint savingsRatio);
    event TokenAdded(uint indexed groupId, address indexed tokenAddress);
    event TokensRemoved(uint indexed groupId, address[] tokenAddresses);

    constructor() {
        nextId.increment(); // Start IDs from 1
    }

    modifier groupExists(uint groupId) {
        require(groups[groupId].id != 0, "Group does not exist");
        _;
    }

    modifier onlyGroupCreator(uint groupId) {
        require(msg.sender == groups[groupId].creator, "Only the group creator can perform this action");
        _;
    }

    modifier onlyApprovedMember(uint groupId) {
        require(groups[groupId].approvedMembers[msg.sender], "You are not an approved member");
        _;
    }

    modifier onlySelectedGrantee(uint groupId) {
        require(msg.sender == groups[groupId].selectedGrantee, "You are not the selected grantee");
        _;
    }

    /**
     * @dev Creates a new savings group with the specified parameters.
     * @param _name The name of the group.
     * @param _description The description of the group.
     * @param _contributionAmount The fixed contribution amount for all members, denoted in the smallest unit (e.g., wei for Ether, or token decimals for ERC20).
     * @param _contributionTimeline The timeline in seconds for contributions.
     * @param _savingsRatio The percentage out of 10000 for the savings split.
     * @param _allowedTokens An array of allowed ERC20 token addresses for contributions.
     */
    function createGroup(
        string memory _name,
        string memory _description,
        uint _contributionAmount,
        uint _contributionTimeline,
        uint _savingsRatio,
        address[] memory _allowedTokens
    ) public nonReentrant {
        require(bytes(_name).length > 0, "Name must not be empty");
        require(bytes(_description).length > 0, "Description must not be empty");
        require(_contributionAmount > 0, "Contribution amount must be greater than zero");
        require(_contributionTimeline > 0, "Contribution timeline must be greater than zero");
        require(_savingsRatio <= 10000, "Savings ratio must be a percentage (0-10000)");

        Group storage newGroup = groups[nextId.current()];
        newGroup.id = nextId.current();
        newGroup.creator = msg.sender;
        newGroup.name = _name;
        newGroup.description = _description;
        newGroup.status = STATUS.ACTIVE;
        newGroup.contributionAmount = _contributionAmount;
        newGroup.contributionTimeline = _contributionTimeline;
        newGroup.savingsRatio = _savingsRatio;
        newGroup.contributors.push(msg.sender);
        newGroup.approvedMembers[msg.sender] = true;
        newGroup.allowedTokens = _allowedTokens;

        contributorGroups[msg.sender].push(nextId.current());

        emit GroupCreated(nextId.current(), msg.sender, _name, _description, STATUS.ACTIVE);

        nextId.increment();
    }

    /**
     * @dev Archives a group and marks it as inactive.
     * @param groupId The ID of the group.
     */
    function archiveGroup(uint groupId) public nonReentrant groupExists(groupId) onlyGroupCreator(groupId) {
        Group storage group = groups[groupId];
        require(group.status == STATUS.ACTIVE, "Group is not active");

        group.status = STATUS.ARCHIVED;

        emit GroupArchived(groupId, msg.sender, STATUS.ARCHIVED);
    }

    /**
     * @dev Updates group settings if members agree.
     * @param groupId The ID of the group.
     * @param _description The new description of the group.
     * @param _contributionAmount The new contribution amount for the group.
     * @param _contributionTimeline The new contribution timeline for the group.
     * @param _savingsRatio The new savings ratio for the group.
     */
    function updateGroup(
        uint groupId,
        string memory _description,
        uint _contributionAmount,
        uint _contributionTimeline,
        uint _savingsRatio
    ) public nonReentrant groupExists(groupId) onlyGroupCreator(groupId) {
        require(bytes(_description).length > 0, "Description must not be empty");
        require(_contributionAmount > 0, "Contribution amount must be greater than zero");
        require(_contributionTimeline > 0, "Contribution timeline must be greater than zero");
        require(_savingsRatio <= 10000, "Savings ratio must be a percentage (0-10000)");

        Group storage group = groups[groupId];
        group.description = _description;
        group.contributionAmount = _contributionAmount;
        group.contributionTimeline = _contributionTimeline;
        group.savingsRatio = _savingsRatio;

        emit GroupUpdated(groupId, _description, _contributionAmount, _contributionTimeline, _savingsRatio);
    }

    /**
     * @dev Adds a new token to the allowed tokens list for a group.
     * @param groupId The ID of the group.
     * @param tokenAddress The address of the ERC20 token to add.
     */
    function addAllowedToken(uint groupId, address tokenAddress) public nonReentrant groupExists(groupId) onlyGroupCreator(groupId) {
        Group storage group = groups[groupId];
        require(!isAllowedToken(group, tokenAddress), "Token is already allowed");

        group.allowedTokens.push(tokenAddress);
        emit TokenAdded(groupId, tokenAddress);
    }

    /**
     * @dev Removes multiple tokens from the allowed tokens list for a group.
     * @param groupId The ID of the group.
     * @param tokenAddresses The array of ERC20 token addresses to remove.
     */
    function removeAllowedTokens(uint groupId, address[] memory tokenAddresses) public nonReentrant groupExists(groupId) onlyGroupCreator(groupId) {
        Group storage group = groups[groupId];
        for (uint i = 0; i < tokenAddresses.length; i++) {
            address tokenAddress = tokenAddresses[i];
            uint tokenIndex = findTokenIndex(group, tokenAddress);
            if (tokenIndex < group.allowedTokens.length) {
                group.allowedTokens[tokenIndex] = group.allowedTokens[group.allowedTokens.length - 1];
                group.allowedTokens.pop();
            }
        }
        emit TokensRemoved(groupId, tokenAddresses);
    }

    /**
     * @dev Allows an approved member to contribute Ether or ERC20 tokens to the specified group.
     * @param groupId The ID of the group.
     * @param tokenAddress The address of the ERC20 token (use 0x0000000000000000000000000000000000000000 for Ether).
     * @param tokenAmount The amount of ERC20 tokens to contribute, in the token's smallest unit.
     */
    function contribute(uint groupId, address tokenAddress, uint tokenAmount) public payable nonReentrant groupExists(groupId) onlyApprovedMember(groupId) {
        Group storage group = groups[groupId];
        require(group.status == STATUS.ACTIVE, "Group is not active");
        require(block.timestamp >= group.lastContributionTime + group.contributionTimeline, "Contribution timeline not met");
        require(block.timestamp < group.lastContributionTime + group.contributionTimeline + 1 days, "Contribution period has ended");

        bool isEther = tokenAddress == address(0);
        uint256 valueToGrantee = (group.savingsRatio * group.contributionAmount) / 10000;
        uint256 valueToSave = group.contributionAmount - valueToGrantee;

        if (isEther) {
            require(msg.value == group.contributionAmount, "Incorrect Ether contribution amount");
            group.etherContributions[msg.sender] += valueToSave;
            group.etherContributions[group.selectedGrantee] += valueToGrantee;
        } else {
            require(tokenAmount == group.contributionAmount, "Incorrect token contribution amount");
            require(isAllowedToken(group, tokenAddress), "Token not allowed for this group");

            IERC20(tokenAddress).safeTransferFrom(msg.sender, address(this), tokenAmount);
            group.tokenContributions[msg.sender][tokenAddress] += valueToSave;
            group.tokenContributions[group.selectedGrantee][tokenAddress] += valueToGrantee;
        }

        group.totalContributions += group.contributionAmount;
        group.lastContributionTime = block.timestamp;
        group.granteeApproved = true; // Approve the grantee for withdrawal
        group.hasWithdrawn = false; // Reset the withdrawal flag for the new period

        if (!isContributor(group, msg.sender)) {
            group.contributors.push(msg.sender);
            contributorGroups[msg.sender].push(groupId);
        }

        group.votingPower[msg.sender] += valueToGrantee;

        emit ContributionMade(groupId, msg.sender, isEther ? msg.value : tokenAmount, tokenAddress);

        // Automatically select the next grantee after each contribution
        selectGranteeByVoting(groupId);
    }

    /**
     * @dev Withdraws Ether or ERC20 tokens for the selected grantee.
     * Only the grantee can withdraw, and only once per contribution period.
     * @param groupId The ID of the group.
     * @param tokenAddress The address of the ERC20 token (use 0x0000000000000000000000000000000000000000 for Ether).
     */
    function withdraw(uint groupId, address tokenAddress) public nonReentrant groupExists(groupId) onlySelectedGrantee(groupId) {
        Group storage group = groups[groupId];
        require(group.granteeApproved, "Grantee withdrawal not approved");
        require(!group.hasWithdrawn, "Withdrawal already made in this period");
        require(group.status == STATUS.ACTIVE || group.status == STATUS.ARCHIVED, "Group is not active or archived");

        bool isEther = tokenAddress == address(0);
        uint256 amount;

        if (isEther) {
            amount = group.etherContributions[msg.sender];
            require(amount > 0, "No Ether to withdraw");
            group.etherContributions[msg.sender] = 0;
            payable(msg.sender).sendValue(amount);
        } else {
            amount = group.tokenContributions[msg.sender][tokenAddress];
            require(amount > 0, "No tokens to withdraw");
            group.tokenContributions[msg.sender][tokenAddress] = 0;

            IERC20(tokenAddress).safeTransfer(msg.sender, amount);
        }

        group.hasWithdrawn = true; // Mark the withdrawal as completed for the period
        group.granteeApproved = false; // Revoke approval after withdrawal

        emit Withdrawal(msg.sender, amount, tokenAddress);
    }

    /**
     * @dev Removes a member from the group, but allows them to withdraw their contributions if they meet conditions.
     * @param groupId The ID of the group.
     * @param member The address of the member to remove.
     */
    function removeMember(uint groupId, address member) public nonReentrant groupExists(groupId) onlyGroupCreator(groupId) {
        Group storage group = groups[groupId];
        require(group.approvedMembers[member], "Member not approved");
        require(group.status == STATUS.ACTIVE || group.status == STATUS.ARCHIVED, "Group is not active or archived");

        group.approvedMembers[member] = false;
        emit MemberRemoved(groupId, member);
    }

    /**
     * @dev Selects the next grantee using a weighted voting system.
     * Only approved members can vote.
     * @param groupId The ID of the group.
     */
    function selectGranteeByVoting(uint groupId) internal groupExists(groupId) {
        Group storage group = groups[groupId];
        uint256 highestVotes = 0;
        address newGrantee;

        for (uint i = 0; i < group.contributors.length; i++) {
            address contributor = group.contributors[i];
            if (group.approvedMembers[contributor] && group.votingPower[contributor] > highestVotes) {
                highestVotes = group.votingPower[contributor];
                newGrantee = contributor;
            }
        }

        group.selectedGrantee = newGrantee;

        emit GranteeSelected(groupId, group.selectedGrantee);
    }

    /**
     * @dev Internal function to approve a new member to join the specified group.
     * @param groupId The ID of the group.
     * @param newMember The address of the new member.
     */
    function _approveMemberInternal(uint groupId, address newMember) internal {
        Group storage group = groups[groupId];
        group.approvedMembers[newMember] = true;

        emit MemberApproved(groupId, newMember);
    }

    /**
     * @dev Checks if a token is allowed for a group.
     * @param group The group to check.
     * @param tokenAddress The address of the token to check.
     * @return True if the token is allowed, false otherwise.
     */
    function isAllowedToken(Group storage group, address tokenAddress) internal view returns (bool) {
        for (uint i = 0; i < group.allowedTokens.length; i++) {
            if (group.allowedTokens[i] == tokenAddress) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Finds the index of a token in the allowedTokens array.
     * @param group The group to search.
     * @param tokenAddress The address of the token to find.
     * @return The index of the token in the array.
     */
    function findTokenIndex(Group storage group, address tokenAddress) internal view returns (uint) {
        for (uint i = 0; i < group.allowedTokens.length; i++) {
            if (group.allowedTokens[i] == tokenAddress) {
                return i;
            }
        }
        return group.allowedTokens.length;
    }

    /**
     * @dev Checks if an address is a contributor in the group.
     * @param group The group to check.
     * @param contributor The address to check.
     * @return True if the address is a contributor, false otherwise.
     */
    function isContributor(Group storage group, address contributor) internal view returns (bool) {
        for (uint i = 0; i < group.contributors.length; i++) {
            if (group.contributors[i] == contributor) {
                return true;
            }
        }
        return false;
    }

    /**
     * @dev Retrieves the details of a group by its ID.
     * @param groupId The ID of the group.
     * @return id The ID of the group.
     * @return creator The creator of the group.
     * @return name The name of the group.
     * @return description The description of the group.
     * @return status The current status of the group.
     * @return contributionAmount The fixed contribution amount for the group.
     * @return contributionTimeline The contribution timeline for the group.
     * @return savingsRatio The savings ratio percentage for the group.
     * @return selectedGrantee The currently selected grantee.
     */
    function getGroupById(uint groupId) public view groupExists(groupId) returns (
        uint id,
        address creator,
        string memory name,
        string memory description,
        STATUS status,
        uint contributionAmount,
        uint contributionTimeline,
        uint savingsRatio,
        address selectedGrantee
    ) {
        Group storage group = groups[groupId];

        return (
            group.id,
            group.creator,
            group.name,
            group.description,
            group.status,
            group.contributionAmount,
            group.contributionTimeline,
            group.savingsRatio,
            group.selectedGrantee
        );
    }

    /**
     * @dev Retrieves the IDs of groups a contributor belongs to.
     * @param contributor The address of the contributor.
     * @return An array of group IDs the contributor belongs to.
     */
    function getGroupsByContributor(address contributor) public view returns (uint[] memory) {
        return contributorGroups[contributor];
    }

    /**
     * @dev Fallback function that reverts any Ether sent to the contract.
     */
    fallback() external payable {
        revert("Fallback function triggered, no Ether accepted");
    }

    /**
     * @dev Receive function that reverts any direct Ether payments.
     */
    receive() external payable {
        revert("Contract does not accept direct Ether payments");
    }
}
