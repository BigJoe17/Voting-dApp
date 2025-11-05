// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Pausable.sol";

/// @title AuthManager
/// @notice Manages user authentication and roles for the voting system
contract AuthManager is Ownable, Pausable {

    struct User {
        bool isRegistered;
        bool isAdmin;
        string username;
        bytes32 passwordHash;
        uint256 registeredAt;
    }

    // Mapping from user address to User struct
    mapping(address => User) public users;
    
    // Array to keep track of all registered addresses
    address[] public registeredUsers;
    
    // Events
    event UserRegistered(address indexed userAddress, string username, bool isAdmin);
    event UserUpdated(address indexed userAddress, string username);
    event AdminStatusChanged(address indexed userAddress, bool isAdmin);

    // Modifiers
    modifier onlyRegistered() {
        require(users[msg.sender].isRegistered, "Not registered");
        _;
    }

    modifier onlyAdmin() {
        require(users[msg.sender].isAdmin, "Not an admin");
        _;
    }

    constructor() Ownable(msg.sender) {
        // Register contract deployer as the first admin
        _registerUser(msg.sender, "admin", keccak256(abi.encodePacked("admin")), true);
    }

    /// @notice Register a new user
    /// @param username The username for the new user
    /// @param passwordHash Hash of the user's password
    function register(string memory username, bytes32 passwordHash) external {
        require(!users[msg.sender].isRegistered, "Already registered");
        require(bytes(username).length > 0, "Username required");
        
        _registerUser(msg.sender, username, passwordHash, false);
    }

    /// @notice Internal function to register a user
    function _registerUser(
        address userAddress,
        string memory username,
        bytes32 passwordHash,
        bool isAdmin
    ) internal {
        users[userAddress] = User({
            isRegistered: true,
            isAdmin: isAdmin,
            username: username,
            passwordHash: passwordHash,
            registeredAt: block.timestamp
        });

        registeredUsers.push(userAddress);
        emit UserRegistered(userAddress, username, isAdmin);
    }

    /// @notice Update user's password
    /// @param newPasswordHash Hash of the new password
    /// @param currentPasswordHash Hash of the current password for verification
    function updatePassword(bytes32 newPasswordHash, bytes32 currentPasswordHash) external onlyRegistered {
        require(users[msg.sender].passwordHash == currentPasswordHash, "Invalid current password");
        users[msg.sender].passwordHash = newPasswordHash;
    }

    /// @notice Grant or revoke admin status
    /// @param userAddress Address of the user
    /// @param isAdmin New admin status
    function setAdminStatus(address userAddress, bool isAdmin) external onlyOwner {
        require(users[userAddress].isRegistered, "User not registered");
        users[userAddress].isAdmin = isAdmin;
        emit AdminStatusChanged(userAddress, isAdmin);
    }

    /// @notice Check if an address is registered
    /// @param userAddress Address to check
    /// @return bool True if the address is registered
    function isRegistered(address userAddress) external view returns (bool) {
        return users[userAddress].isRegistered;
    }

    /// @notice Check if an address is an admin
    /// @param userAddress Address to check
    /// @return bool True if the address is an admin
    function isAdmin(address userAddress) external view returns (bool) {
        return users[userAddress].isAdmin;
    }

    /// @notice Verify user credentials
    /// @param userAddress Address of the user
    /// @param passwordHash Hash of the password to verify
    /// @return bool True if credentials are valid
    function verifyCredentials(address userAddress, bytes32 passwordHash) external view returns (bool) {
        return users[userAddress].isRegistered && users[userAddress].passwordHash == passwordHash;
    }

    /// @notice Get user details
    /// @param userAddress Address of the user
    /// @return username The username
    /// @return isAdmin Whether the user is an admin
    /// @return registeredAt When the user registered
    function getUserDetails(address userAddress) external view returns (
        string memory username,
        bool isAdmin,
        uint256 registeredAt
    ) {
        require(users[userAddress].isRegistered, "User not found");
        User memory user = users[userAddress];
        return (user.username, user.isAdmin, user.registeredAt);
    }

    /// @notice Get the total number of registered users
    /// @return uint256 The number of registered users
    function getUserCount() external view returns (uint256) {
        return registeredUsers.length;
    }

    /// @notice Emergency pause
    function pause() external onlyOwner {
        _pause();
    }

    /// @notice Unpause
    function unpause() external onlyOwner {
        _unpause();
    }
}