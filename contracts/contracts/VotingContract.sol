// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title VotingContract
/// @notice A secure on-chain voting system with owner/organizer controls and candidate management.
contract VotingContract is Ownable {
    uint256 private _candidateIdCounter;

    // The organizer (deployer)
    address public organizer;

    constructor() Ownable(msg.sender) {
        organizer = msg.sender;
        electionState = ElectionState.NotStarted;
    }

    enum ElectionState {
        NotStarted,
        Active,
        Ended
    }

    ElectionState public electionState;
    uint256 public electionStartTimestamp;
    uint256 public electionEndTimestamp;

    struct Candidate {
        uint256 id;
        string name;
        string imageCID; // IPFS CID for candidate image
        uint256 voteCount;
        bool exists;
    }

    struct Voter {
        bool hasVoted;
        uint256 votedCandidateId;
    }

    mapping(uint256 => Candidate) private candidates;
    uint256[] private candidateIds;

    mapping(address => Voter) private voters;

    // -------- Events --------
    event CandidateAdded(uint256 indexed id, string name, string imageCID);
    event CandidateRemoved(uint256 indexed id);
    event VoteCast(address indexed voter, uint256 indexed candidateId);
    event ElectionStarted(uint256 startTimestamp, uint256 endTimestamp);
    event ElectionEnded(uint256 endTimestamp);
    event OrganizerChanged(address indexed oldOrganizer, address indexed newOrganizer);

    // -------- Modifiers --------
    modifier onlyDuringElection() {
        require(
            electionState == ElectionState.Active &&
                block.timestamp >= electionStartTimestamp &&
                block.timestamp <= electionEndTimestamp,
            "Not during active election"
        );
        _;
    }

    modifier onlyBeforeElection() {
        require(electionState == ElectionState.NotStarted, "Election already started");
        _;
    }

    modifier onlyAfterElection() {
        require(electionState == ElectionState.Ended, "Election not ended");
        _;
    }

    modifier onlyOrganizer() {
        require(msg.sender == organizer, "Only organizer can call this");
        _;
    }

    // -------- Admin Functions --------
    function changeOrganizer(address newOrganizer) external onlyOwner {
        require(newOrganizer != address(0), "Invalid address");
        emit OrganizerChanged(organizer, newOrganizer);
        organizer = newOrganizer;
    }

    /// @notice Add a candidate (before election starts)
    function addCandidate(string calldata name, string calldata imageCID)
        external
        onlyOwner
        onlyBeforeElection
    {
        require(bytes(name).length > 0, "Candidate name required");
        require(bytes(imageCID).length > 0, "Candidate imageCID required");

        _candidateIdCounter++;
        uint256 newId = _candidateIdCounter;

        candidates[newId] = Candidate({
            id: newId,
            name: name,
            imageCID: imageCID,
            voteCount: 0,
            exists: true
        });

        candidateIds.push(newId);
        emit CandidateAdded(newId, name, imageCID);
    }

    /// @notice Remove a candidate (before election starts)
    function removeCandidate(uint256 id) external onlyOwner onlyBeforeElection {
        require(candidates[id].exists, "Candidate does not exist");

        delete candidates[id];

        for (uint256 i = 0; i < candidateIds.length; i++) {
            if (candidateIds[i] == id) {
                candidateIds[i] = candidateIds[candidateIds.length - 1];
                candidateIds.pop();
                break;
            }
        }

        emit CandidateRemoved(id);
    }

    /// @notice Start the election for a set duration (seconds)
    function startElection(uint256 durationSeconds) external onlyOwner onlyBeforeElection {
        require(candidateIds.length > 0, "No candidates available");
        require(durationSeconds > 0, "Duration must be greater than zero");

        electionStartTimestamp = block.timestamp;
        electionEndTimestamp = block.timestamp + durationSeconds;
        electionState = ElectionState.Active;

        emit ElectionStarted(electionStartTimestamp, electionEndTimestamp);
    }

    /// @notice End the election early
    function endElection() external onlyOwner onlyDuringElection {
        electionEndTimestamp = block.timestamp;
        electionState = ElectionState.Ended;

        emit ElectionEnded(electionEndTimestamp);
    }

    // -------- Voting --------
    /// @notice Allows any address to vote once during the active election
    function vote(uint256 candidateId) external onlyDuringElection {
        require(candidates[candidateId].exists, "Candidate not found");
        require(!voters[msg.sender].hasVoted, "Already voted");

        voters[msg.sender].hasVoted = true;
        voters[msg.sender].votedCandidateId = candidateId;

        candidates[candidateId].voteCount += 1;

        emit VoteCast(msg.sender, candidateId);
    }

    // -------- View Functions --------
    function getOrganizer() external view returns (address) {
        return organizer;
    }

    function getCandidateIds() external view returns (uint256[] memory) {
        return candidateIds;
    }

    function getCandidate(uint256 id)
        external
        view
        returns (uint256, string memory, string memory, uint256)
    {
        Candidate memory c = candidates[id];
        require(c.exists, "Candidate not found");
        return (c.id, c.name, c.imageCID, c.voteCount);
    }

    function getAllCandidates()
        external
        view
        returns (uint256[] memory ids, string[] memory names, string[] memory imageCIDs, uint256[] memory voteCounts)
    {
        uint256 len = candidateIds.length;
        ids = new uint256[](len);
        names = new string[](len);
        imageCIDs = new string[](len);
        voteCounts = new uint256[](len);

        for (uint256 i = 0; i < len; i++) {
            uint256 id = candidateIds[i];
            Candidate memory c = candidates[id];
            ids[i] = c.id;
            names[i] = c.name;
            imageCIDs[i] = c.imageCID;
            voteCounts[i] = c.voteCount;
        }
    }

    function hasVoted(address user) external view returns (bool) {
        return voters[user].hasVoted;
    }

    function getVotedCandidateId(address user) external view returns (uint256) {
        return voters[user].votedCandidateId;
    }

    function getElectionTimestamps() external view returns (uint256 startTs, uint256 endTs) {
        return (electionStartTimestamp, electionEndTimestamp);
    }

    function getElectionState() external view returns (ElectionState) {
        if (electionState == ElectionState.Active && block.timestamp > electionEndTimestamp) {
            return ElectionState.Ended;
        }
        return electionState;
    }
}
