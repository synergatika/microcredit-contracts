pragma solidity >=0.5.8 <0.6.1;

import './ProjectStorage.sol';
import './Ownable.sol';
import '../node_modules/@openzeppelin/contracts/math/SafeMath.sol';

contract Project  is ProjectStorage, Ownable{

    using SafeMath for uint256;

     modifier isStarted() {
        require(startedAt == 0 || block.timestamp >= startedAt,
            "Not started project");
        _;
    }

    modifier isNotExpired() {
        require(expiredAt == 0 || block.timestamp < expiredAt,
            "Expired project");
        _;
    }

    modifier isAvailable() {
        require(availableAt == 0 || block.timestamp >= availableAt,
            "Not available project yet");
        _;
    }

    modifier isNotAvailable() {
        require(availableAt == 0 || block.timestamp < availableAt,
            "Project is available yet");
        _;
    }

     modifier isNotFinished() {
        require(finishedAt == 0 || block.timestamp < finishedAt,
            "Project is finished");
        _;
    }

    constructor (
        address projectRaiseBy,
        uint projectMinimunAmount,
        uint projectMaximunAmount,
        uint projectMaxBackerAmount,
        uint projectMinBackerAmount,
        uint projectExpiredAt,
        uint projectAvailableAt,
        uint projectStartedAt,
        uint projectFinishedAt,
        bool projectUseToken
    ) public {
        minimunAmount = projectMinimunAmount;
        maximunAmount = projectMaximunAmount;
        maxBackerAmount = projectMaxBackerAmount;
        minBackerAmount = projectMinBackerAmount;
        raiseBy = projectRaiseBy;
        expiredAt = projectExpiredAt;
        availableAt = projectAvailableAt;
        startedAt = projectStartedAt;
        useToken = projectUseToken;
        finishedAt = projectFinishedAt;
    }

    function promiseToFund(address _contributor, uint _amount) public isStarted isNotExpired returns(bytes32) {
        require(maxBackerAmount == 0 || tokens[_contributor] + _amount <= maxBackerAmount,
            "User exceeds his/her maximum allowed backing amount");

        BackedTransaction memory trx = BackedTransaction({
            contributor: _contributor,
            amount: _amount,
            state: TransactionState.Pending,
            ref: keccak256(abi.encodePacked(_contributor, block.number))
        });

        uint _index = backedTransaction.length;
        backedTransaction.push(trx);

        emit BackedTransactionEvent(_contributor, _amount, _index, trx.ref);
        return trx.ref;
    }

    function revertFund(uint256 _index) public isStarted isNotAvailable {
        require(backedTransaction[_index].state == TransactionState.Completed,
            "Transaction isn't competed");
        BackedTransaction memory trx = backedTransaction[_index];

        backedTransaction[_index].state = TransactionState.Pending;
        tokens[trx.contributor] = tokens[trx.contributor].sub(trx.amount);
        totalBalance = totalBalance.sub(trx.amount);

        emit FundRevertedEvent(trx.contributor, trx.amount);
    }

    function fundReceived(uint256 _index) public isStarted isNotExpired {
        require(_index < backedTransaction, "Index out of transactions list");
        require(backedTransaction[_index].state == TransactionState.Pending,
            "Transaction isn't pending");
        BackedTransaction memory trx = backedTransaction[_index];

        backedTransaction[_index].state = TransactionState.Completed;
        tokens[trx.contributor] = tokens[trx.contributor].add(trx.amount);
        totalBalance = totalBalance.add(trx.amount);

        emit FundReceivedEvent(trx.contributor, trx.amount);
    }

    function spend(address _contributor, uint256 _price) public {
        require(useToken == false, "Tokens aren't deductable");
        useTokens(_contributor, _price);
    }

    function spend(address _contributor) public {
        require(useToken == true, "Tokens are deductable");
        require(minBackerAmount == 0 || tokens[_contributor] >= minBackerAmount,
            "You need more tokens");
        useTokens(_contributor, 0);
    }

    function useTokens(address _contributor, uint256 _price) internal
        isStarted
        isAvailable
        isNotFinished {
        require(_price <= tokens[_contributor], "Ιnsufficient balance");
        tokens[_contributor] = tokens[_contributor].sub(_price);

        transaction.push(Transaction({
            contributor: _contributor,
            amount: _price
        }));

        emit TransactionEvent(_contributor, _price);
    }

    function backedTransactionLength() public view returns(uint256) {
        return backedTransaction.length;
    }

    function transactionLength() public view returns(uint256) {
        return transaction.length;
    }
}