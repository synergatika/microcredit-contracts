pragma solidity >=0.5.4 <0.6.0;

import '@openzeppelin/contracts/math/SafeMath.sol';

contract Project {
    using SafeMath for uint256;

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

    // State variables
    address public raiseBy;
    uint public minimunAmount;
    uint256 public totalBalance;
    uint public completeAt;

    BackedTransaction[] public backedTransaction;
    Transaction[] public transaction;

    mapping(address => uint256) public tokens; // I own you equal price of products

    constructor (
        address projectRaiseBy,
        uint projectMinimunAmount,
        uint projectCompleteAt
    ) public {
        raiseBy = projectRaiseBy;
        minimunAmount = projectMinimunAmount;
        completeAt = projectCompleteAt;
    }

    function promiseToFund(address _contributor, uint _amount) public returns(uint256){
        backedTransaction.push(BackedTransaction({
            contributor: _contributor,
            amount: _amount,
            state: TransactionState.Pending
        }));

        // checkIfFundingCompleteOrExpired();
    }

    function fundReceived(uint256 _index) public {
        BackedTransaction memory trx = backedTransaction[_index];

        backedTransaction[_index].state = TransactionState.Completed;
        tokens[trx.contributor] = tokens[trx.contributor].add(trx.amount);
        totalBalance = totalBalance.add(trx.amount);
    }

    function spend(address _contributor, uint256 _price) public {
        tokens[_contributor] = tokens[_contributor].sub(_price);
    }
}