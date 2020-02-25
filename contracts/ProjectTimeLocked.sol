pragma solidity >=0.5.8 <0.6.1;

import "./ProjectStorage.sol";

/**
 * @title Ownable
 * @dev This contract has an owner address providing basic authorization control
 */
contract ProjectTimeLocked is ProjectStorage {
    uint256 public expiredAt;

    uint256 public availableAt;

    uint256 public finishedAt;

    uint256 public startedAt;

    modifier isStarted() {
        require(
            startedAt == 0 || block.timestamp >= startedAt,
            "Not started project"
        );
        _;
    }

    modifier isNotExpired() {
        require(
            expiredAt == 0 || block.timestamp < expiredAt,
            "Expired project"
        );
        _;
    }

    modifier isAvailable() {
        require(
            availableAt == 0 || block.timestamp >= availableAt,
            "Not available project yet"
        );
        _;
    }

    modifier isNotAvailable() {
        require(
            availableAt == 0 || block.timestamp < availableAt,
            "Project is available yet"
        );
        _;
    }

    modifier isNotFinished() {
        require(
            finishedAt == 0 || block.timestamp < finishedAt,
            "Project is finished"
        );
        _;
    }
}
