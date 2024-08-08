// SPDX-License-Identifier: MIT
pragma solidity ^0.8.7;


contract ChamaGroup {
    // Address of the contract owner
    address private immutable owner;

    // Counter for generating group IDs
    uint private nextId = 1;

    // Flag to prevent reentrant calls
    bool private locked;

    // Modifier to prevent reentrant calls
    modifier nonReentrant() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    // Enum representating the status of the group
    enum STATUS {
        ACTIVE,
        DELETED
    }

    // Struct to define the structure of the chama groups
    struct Group {
        uint id;
        address creator;
        string name;
        string description;
        STATUS status;
        uint totalContributions;
        address[] contributors;
        uint[] contributionAmounts;
    }

    // Mapping to efficiently store groups by ID
    mapping(uint => Group) public groups;

    // Mapping to track which groups a contributor has participated in
    mapping(address => uint[]) private contributorGroups;

    event GroupCreated(uint indexed groupId, address groupCreator, string name, STATUS status);
    event GroupDeleted(uint indexed groupId, address groupCreator, STATUS status);
    event ContributorAdded(uint indexed groupId, address indexed newContributor);


    // Contract
    constructor(){
        owner = msg.sender;
    }

    // Modifier to allow only the contract owner to perform certain actions
    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can perform this action.");
        _;
    }


     // Function to create a new chama group
    function createGroup(
        string memory _name, // name of the chama group
        string memory _description // description of the chama group
    ) public {
        // validation checks for input parameters
        require(bytes(_name).length > 0, 'Name must not be empty');
        require(bytes(_description).length > 0, 'Description must not be empty');

        // Create a new chama group with the provided information and add it to the array
        Group memory newGroup = Group({
            id : nextId,  // assign a unique id to the new chama group
            creator : msg.sender, // set the creator as the current sender of the transaction
            name : _name, // set the name of the chama group as the provided name
            description : _description, // set the description of the chama group as the provided description
            status : STATUS.ACTIVE, // set the status of the chama group as ACTIVE
            totalContributions : 0, // set the total contributions to 0 as no contributions have been made yet
            contributors : new address[](0), // create an empty array to store contributors
            contributionAmounts : new uint[](0) // create an empty array to store contribution amounts
        });

        // Create a new array with the creator as the first contributor
        address[] memory contributorsWithCreator = new address[](1);
        contributorsWithCreator[0] = msg.sender;

        // Assign the new array to the group's contributors
        newGroup.contributors = contributorsWithCreator;

        groups[nextId] = newGroup; // add the new chama group to the array

        // Track the group in the contributorGroups mapping
        contributorGroups[newGroup.creator].push(newGroup.id);

        // emit an event to notify listeners that a new chama group has been created
        emit GroupCreated(newGroup.id, newGroup.creator, newGroup.name, newGroup.status);

        // increment the id counter to generate unique ids for new chama groups
        nextId++;
    }

    // Function that allows the group creator to delette the group.
    function deleteGroup(uint groupId)  public {
        // Retrieve the group based on the group id
        Group storage group = groups[groupId];

        // Validatiion check: only creator can delete
        require(group.creator == msg.sender, "Only creator can delete");

        // TODO: Refund the contriibutors when group is delete

        // Remove the group from each contributor's list
        for (uint i = 0; i < group.contributors.length; i++) {
            address contributor = group.contributors[i];
            uint[] storage contributorGroupsList = contributorGroups[contributor];

            // Find the index of the group in the contributor's list
            for (uint j = 0; j < contributorGroupsList.length; j++) {
                if (contributorGroupsList[j] == groupId) {
                    // Remove the group from the list by shifting elements
                    for (uint k = j; k < contributorGroupsList.length - 1; k++) {
                        contributorGroupsList[k] = contributorGroupsList[k + 1];
                    }
                    contributorGroupsList.pop();
                    break;
                }
            }
        }
        // Mark group as delete
        group.status = STATUS.DELETED;

        // emit an event to notify listeners that the chama group has been deleted
        emit GroupDeleted(groupId, msg.sender, STATUS.DELETED);
    }

    // Function to get a group by its ID
    function getGroupById(uint groupId) public view returns (
        uint id,
        address creator,
        string memory name,
        string memory description,
        STATUS status,
        uint totalContributions
    ) {
        require(groups[groupId].id > 0, "Group does not exist");
        require(groups[groupId].status == STATUS.ACTIVE, "Group is not active");

        Group storage group = groups[groupId];
        return (
            group.id,
            group.creator,
            group.name,
            group.description,
            group.status,
            group.totalContributions
        );
    }


    // Function to get all groups that a specific contributor is part of
    function getGroupsByContributor(address contributor) public view returns (uint[] memory) {
        return contributorGroups[contributor];
    }

    // Add a contributor to a group
    function addContributor(uint groupId, address newContributor) public {
        Group storage group = groups[groupId];
        require(group.status == STATUS.ACTIVE, "Group is not active");
        // Validatiion check: only creator can add a contributor
        require(group.creator == msg.sender, "Only group creator can add contributors");

        // Prevent duplicate contributors
        require(findContributorIndex(group.contributors, newContributor) == type(uint).max, "Contributor exists");


        group.contributors.push(newContributor);
        contributorGroups[newContributor].push(groupId);

        emit ContributorAdded(groupId, newContributor);
    }

    // Remove a contributor from a group
    function removeContributor(uint groupId, address contributor) public {
        Group storage group = groups[groupId];
        require(group.status == STATUS.ACTIVE, "Group inactive");
        require(msg.sender == group.creator, "Only creator");

        uint index = findContributorIndex(group.contributors, contributor);
        require(index < group.contributors.length, "Contributor not found");

        // Safe array manipulation
        group.contributors[index] = group.contributors[group.contributors.length - 1];
        group.contributors.pop();

        // Assuming contributionAmounts has the same length as contributors
        group.contributionAmounts[index] = group.contributionAmounts[group.contributionAmounts.length - 1];
        group.contributionAmounts.pop();

        // Remove from contributor's groups
        uint[] storage cGroups = contributorGroups[contributor];
        for (uint i = 0; i < cGroups.length; i++) {
            if (cGroups[i] == groupId) {
                cGroups[i] = cGroups[cGroups.length - 1];
                cGroups.pop();
                break;
            }
        }
    }

    // Helper function to find contributor index
    function findContributorIndex(address[] memory array, address value) private pure returns (uint) {
        for (uint i = 0; i < array.length; i++) {
            if (array[i] == value) {
                return i;
            }
        }
        return type(uint).max;
    }

}
