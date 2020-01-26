pragma solidity >=0.5.8 <0.6.0;

/**
 * @title ProjectStorage
 * @dev This contract holds all the necessary state variables to carry out the storage of any contract.
 */
contract ProjectStorage {

    enum TransactionState {
        Pending,
        Completed,
        Failed
    }

    struct BackedTransaction {
        address contributor;
        uint amount;
        TransactionState state;
    }

    struct Transaction {
        address contributor;
        uint amount;
    }

    struct Backer {
        address backerAddress;
    }

    address public raiseBy;

    uint public minimunAmount;

    uint public maximunAmount;

    uint public maxBackerAmount;

    uint public expiredAt;

    uint public availableAt;

    uint public startedAt;

    bool public useToken;

    uint256 public totalBalance;

    BackedTransaction[] public backedTransaction;

    Transaction[] public transaction;

    mapping(address => uint256) public tokens;

    mapping(address => Backer) public backers;

    mapping(bytes32 => bool) internal boolStorage;

    mapping(bytes32 => int256) internal intStorage;

    mapping(bytes32 => bytes) internal bytesStorage;

    mapping(bytes32 => uint256) internal uintStorage;

    mapping(bytes32 => string) internal stringStorage;

    mapping(bytes32 => address) internal addressStorage;
}