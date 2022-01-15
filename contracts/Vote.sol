pragma solidity ^0.8.0;
//SPDX-License-Identifier: MIT

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

import "hardhat/console.sol";

contract Vote is Ownable, Pausable, ReentrancyGuard {
    
    // events
    event PoliticalParyAded(string indexed partyName, string indexed presidentName);
    event userVoted(address indexed user,  string indexed partyName);
    event userCastedVote(address indexed from, address indexed to);

    // state
    uint public startDate;
    uint public endDate;
    

    // structs
    struct PoliticalPary {
        string partyName;
        string presidentName;
        uint256 regestrationDate;
        uint256 votes;
    }

    PoliticalPary[] public politicalParties;

    mapping(address => int) public userVotes;

    function addPoliticalParty(string memory _partyName, string memory _presidentName) public onlyOwner {
        PoliticalPary memory newParty;
        newParty.partyName = _partyName;
        newParty.presidentName = _presidentName;
        newParty.regestrationDate = block.timestamp;
        politicalParties.push(newParty);

        emit PoliticalParyAded(_partyName, _presidentName);
    }

    function getAllPoliticalParties() public view returns (PoliticalPary[] memory) {
        return politicalParties;
    }

    function setStartDate(uint256 _startDate) public onlyOwner {
        startDate = _startDate;
    }

    function setEndDate(uint256 _endDate) public onlyOwner {
        endDate = _endDate;
    }

    function getTime() public view returns (uint256) {
        return block.timestamp;
    }

    function vote(uint _politicalParty) public whenNotPaused nonReentrant {
        if (startDate == 0 || endDate == 0 || block.timestamp < startDate || block.timestamp > endDate) {
            console.log(block.timestamp);
            console.log(startDate);
            console.log(endDate);
            revert("Voting didn't start yet or already ended");
        }

        if (userVotes[msg.sender] > 0) {
            revert("You already voted");
        }

        politicalParties[_politicalParty].votes++;
        userVotes[msg.sender]++;

        emit userVoted(msg.sender, politicalParties[_politicalParty].partyName);

    }

    function castVote(address _to) public whenNotPaused {
        if (userVotes[msg.sender] > 0) {
            revert("You already voted");
        }

        userVotes[msg.sender]++;
        userVotes[_to]--;

        emit userCastedVote(msg.sender, _to);

    }

    function getUserVotes(address _user) public view returns (int) {
        return userVotes[_user];
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}