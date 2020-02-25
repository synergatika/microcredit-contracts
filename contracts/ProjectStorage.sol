pragma solidity >=0.5.8 <0.6.0;

/**
 * @title ProjectStorage
 * @dev This contract holds all the necessary state variables to carry out the storage of any contract.
 */
contract ProjectStorage {
    event BackedTransactionEvent(
        address contributor,
        uint256 amount,
        uint256 index,
        bytes32 ref
    );

    event FundReceivedEvent(address contributor, uint256 amount);

    event FundRevertedEvent(address contributor, uint256 amount);

    event TransactionEvent(address contributor, uint256 amount);

    enum TransactionState {Pending, Completed, Failed}

    struct BackedTransaction {
        address contributor;
        uint256 amount;
        bytes32 ref;
        TransactionState state;
    }

    struct Transaction {
        address contributor;
        uint256 amount;
    }

    struct Backer {
        address backerAddress;
    }

    address public raiseBy;

    uint256 public minimunAmount;

    uint256 public maximunAmount;

    uint256 public maxBackerAmount;

    uint256 public minBackerAmount;

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
