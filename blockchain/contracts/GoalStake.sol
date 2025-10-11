// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

contract GoalStake {
    struct Goal {
        address staker;
        address forfeitAddress;
        uint256 amount;
        bool resolved;
    }

    uint256 public goalCount;
    mapping(uint256 => Goal) public goals;

    event GoalStaked(uint256 indexed goalId, address staker, uint256 amount);
    event GoalResolved(uint256 indexed goalId, bool success, address recipient);

    function stake(address _forfeitAddress) external payable returns (uint256) {
        require(msg.value > 0, "No ETH sent");
        goalCount++;
        goals[goalCount] = Goal(msg.sender, _forfeitAddress, msg.value, false);
        emit GoalStaked(goalCount, msg.sender, msg.value);
        return goalCount;
    }

    function markFailed(uint256 _goalId) external {
        Goal storage g = goals[_goalId];
        require(!g.resolved, "Already resolved");
        g.resolved = true;
        payable(g.forfeitAddress).transfer(g.amount);
        emit GoalResolved(_goalId, false, g.forfeitAddress);
    }

    function markCompleted(uint256 _goalId) external {
        Goal storage g = goals[_goalId];
        require(!g.resolved, "Already resolved");
        g.resolved = true;
        payable(g.staker).transfer(g.amount);
        emit GoalResolved(_goalId, true, g.staker);
    }
}
