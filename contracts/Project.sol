pragma solidity >=0.5.8 <0.6.0;

import './ProjectStorage.sol';
import './Ownable.sol';
import '@openzeppelin/contracts/math/SafeMath.sol';

contract Project  is ProjectStorage, Ownable{

    using SafeMath for uint256;

    modifier isPending(uint256 _index) {
         require(backedTransaction[_index].state == TransactionState.Pending, "Transaction isn't pending");
        _;
    }

    constructor (
        address projectRaiseBy,
        uint projectMinimunAmount,
        uint projectMaximunAmount,
        uint projectMaxBackerAmount,
        uint projectCompleteAt,
        uint projectRaisingEndsAt,
        bool projectUseToken
    ) public {
        minimunAmount = projectMinimunAmount;
        maximunAmount = projectMaximunAmount;
        maxBackerAmount = projectMaxBackerAmount;
        raiseBy = projectRaiseBy;
        completeAt = projectCompleteAt;
        raisingEndsAt = projectRaisingEndsAt;
        useToken = projectUseToken;
    }

    function promiseToFund(address _contributor, uint _amount) public returns(bytes32){
        backedTransaction.push(BackedTransaction({
            contributor: _contributor,
            amount: _amount,
            state: TransactionState.Pending
        }));

        return keccak256('loyalty_score_timespan');
    }

    function fundReceived(uint256 _index) public isPending(_index) {
        BackedTransaction memory trx = backedTransaction[_index];

        backedTransaction[_index].state = TransactionState.Completed;
        tokens[trx.contributor] = tokens[trx.contributor].add(trx.amount);
        totalBalance = totalBalance.add(trx.amount);
    }

    function spend(address _contributor, uint256 _price) public {
        tokens[_contributor] = tokens[_contributor].sub(_price);
    }
}