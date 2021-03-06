pragma solidity >=0.5.8 <0.6.1;

import "./ProjectStorage.sol";
import "./Ownable.sol";
import "./ProjectTimeLocked.sol";
import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract Project is ProjectStorage, Ownable, ProjectTimeLocked {
    using SafeMath for uint256;

    constructor(
        address projectRaiseBy,
        uint256 projectMinimunAmount,
        uint256 projectMaximunAmount,
        uint256 projectMaxBackerAmount,
        uint256 projectMinBackerAmount,
        uint256 projectExpiredAt,
        uint256 projectAvailableAt,
        uint256 projectStartedAt,
        uint256 projectFinishedAt,
        bool projectUseToken
    ) public {
        minimunAmount = projectMinimunAmount;
        maximunAmount = projectMaximunAmount;
        maxBackerAmount = projectMaxBackerAmount;
        minBackerAmount = projectMinBackerAmount;
        raiseBy = projectRaiseBy;

        startedAt = projectStartedAt * 1 seconds;
        availableAt = projectAvailableAt * 1 seconds;
        expiredAt = projectExpiredAt * 1 seconds;
        finishedAt = projectFinishedAt * 1 seconds;

        useToken = projectUseToken;
        addressStorage[keccak256("owner")] = msg.sender;
    }

    function promiseToFund(address _contributor, uint256 _amount)
        public
        isStarted
        isNotExpired
        returns (bytes32)
    {
        require(
            maxBackerAmount == 0 ||
                tokens[_contributor] + _amount <= maxBackerAmount,
            "User exceeds his/her maximum allowed backing amount"
        );

        BackedTransaction memory trx = BackedTransaction({
            contributor: _contributor,
            amount: _amount,
            state: TransactionState.Pending,
            ref: keccak256(abi.encodePacked(_contributor, block.number))
        });

        uint256 _index = backedTransaction.length;
        backedTransaction.push(trx);

        emit BackedTransactionEvent(_contributor, _amount, _index, trx.ref);
        return trx.ref;
    }

    function revertFund(uint256 _index) public isStarted isNotAvailable {
        require(
            backedTransaction[_index].state == TransactionState.Completed,
            "Transaction isn't competed"
        );
        BackedTransaction memory trx = backedTransaction[_index];

        backedTransaction[_index].state = TransactionState.Pending;
        tokens[trx.contributor] = tokens[trx.contributor].sub(trx.amount);
        totalBalance = totalBalance.sub(trx.amount);

        emit FundRevertedEvent(trx.contributor, trx.amount);
    }

    function fundReceived(uint256 _index) public isStarted isNotExpired {
        require(
            _index < backedTransaction.length,
            "Index out of transactions list"
        );
        require(
            backedTransaction[_index].state == TransactionState.Pending,
            "Transaction isn't pending"
        );
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
        require(
            minBackerAmount == 0 || tokens[_contributor] >= minBackerAmount,
            "You need more tokens"
        );
        useTokens(_contributor, 0);
    }

    function useTokens(address _contributor, uint256 _price)
        internal
        isStarted
        isAvailable
        isNotFinished
    {
        require(_price <= tokens[_contributor], "Ιnsufficient balance");
        tokens[_contributor] = tokens[_contributor].sub(_price);

        transaction.push(
            Transaction({contributor: _contributor, amount: _price})
        );

        emit TransactionEvent(_contributor, _price);
    }

    function backedTransactionLength() public view returns (uint256) {
        return backedTransaction.length;
    }

    function transactionLength() public view returns (uint256) {
        return transaction.length;
    }
}
