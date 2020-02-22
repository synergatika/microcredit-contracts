const Project = artifacts.require("Project");
const assertRevert = require('./helpers/assertRevert');
const checkBalance = require('./helpers/balance');

contract("Project 001",  async (accounts) => {
    const projectRaiseBy = accounts[0];
    const projectMinimunAmount = 0;
    const projectMaximunAmount = 0;
    const projectMaxBackerAmount = 1000;
    const projectMinBackerAmount = 1000;
    const projectExpiredAt = 0;
    const projectAvailableAt = 0;
    const projectStartedAt = 0;
    const projectFinishedAt = 0;
    const projectUseToken = true;
    
    let project = await Project.new(
        projectRaiseBy,
        projectMinimunAmount,
        projectMaximunAmount,
        projectMaxBackerAmount,
        projectMinBackerAmount,
        projectExpiredAt,
        projectAvailableAt,
        projectStartedAt,
        projectFinishedAt, 
        projectUseToken
    );

    let ref;

    describe('Project Contract Behavior', function () {
        describe('Contract is initialized', function () {
            it('returns 0', async function () {
                const initialized = await project.minimunAmount();
                assert.equal(initialized, 0);
            })

            it('returns beneficiery', async function () {
                const raiseBy = await project.raiseBy();
                assert.equal(raiseBy, accounts[0]);
            })

            it('returns 0', async function () {
                const result = await project.minimunAmount();
                assert.equal(result, 0);
            })

            it('returns 0', async function () {
                const result = await project.maximunAmount();
                assert.equal(result, 0);
            })

            it('returns 1000', async function () {
                const result = await project.maxBackerAmount();
                assert.equal(result, 1000);
            })

            it('returns 0', async function () {
                const result = await project.totalBalance();
                assert.equal(result, 0);
            })

            it('returns 0', async function () {
                const result = await project.expiredAt();
                assert.equal(result, 0);
            })

            it('returns 0', async function () {
                const result = await project.startedAt();
                assert.equal(result, 0);
            })

            it('returns 0', async function () {
                const result = await project.availableAt();
                assert.equal(result, 0);
            })

            it('returns 0', async function () {
                const result = await project.finishedAt();
                assert.equal(result, 0);
            })

            it('returns true', async function () {
                const result = await project.useToken();
                assert.equal(result, true);
            })
        });

        describe('Fund (non-deductable)', function () {
            it('promise to fund', async function () {
                const result = await project.promiseToFund(accounts[1], 1000);
                const args = result.logs[0].args;
                assert.equal(accounts[1], args.contributor);
                assert.equal(0, args.index);
                assert.equal(1000, args.amount);
                ref = args.ref;
                // assert.equal('0x52830dec972c72c48bdd960b1955b46076911d15dbe2cb98280c9a7f7608172f', args.ref);  Ref is random              
                assert.equal('0x01', result.receipt.status, 'send funds');
            })

            it('check new backed transaction', async function () {
                const result = await project.backedTransaction(0);
                assert.equal(accounts[1], result.contributor);
                assert.equal(ref, result.ref);
                assert.equal(1000, result.amount);
                assert.equal(0, result.state);
            })

            it('check backed transaction length', async function () {
                const result = await project.backedTransactionLength();
                assert.equal(result, 1);
            })

            checkBalance(project, accounts[1], 0, 0)

            it('receive funds', async function () {
                const result = await project.fundReceived(0);
                const args = result.logs[0].args;
                assert.equal(accounts[1], args.contributor);
                assert.equal(1000, args.amount);
                assert.equal('0x01', result.receipt.status);
            })

            it('check completed backed transaction', async function () {
                const result = await project.backedTransaction(0);
                assert.equal(accounts[1], result.contributor);
                assert.equal(ref, result.ref);
                assert.equal(1000, result.amount);
                assert.equal(1, result.state);
            })
            
            checkBalance(project, accounts[1], 1000, 1000)

            it('do not allow verification of already verified transaction', async function () {
                await assertRevert(project.fundReceived(0));
            })

            it('revert funds', async function () {
                const result = await project.revertFund(0);
                const args = result.logs[0].args;
                assert.equal(accounts[1], args.contributor);
                assert.equal(1000, args.amount);
                assert.equal('0x01', result.receipt.status);
            })

            checkBalance(project, accounts[1], 0, 0)
            
            it('recheck completed backed transaction', async function () {
                const result = await project.fundReceived(0);
                const args = result.logs[0].args;
                assert.equal(accounts[1], args.contributor);
                assert.equal(1000, args.amount);
                assert.equal('0x01', result.receipt.status);
            })
            
            it('success', async function () {
                await assertRevert(project.promiseToFund(accounts[1], 1000))
            })

            checkBalance(project, accounts[1], 1000, 1000)
            
            it('success', async function () {
                const result = await project.spend(accounts[1]);
                assert.equal('0x01', result.receipt.status, 'spend tokens');
            })

            it('check transaction length', async function () {
                const result = await project.transactionLength();
                assert.equal(result, 1);
            })

            checkBalance(project, accounts[0], 1000, 0)

            it('success', async function () {
                await assertRevert(project.spend(accounts[0]))
            })

            it('get list transanction', async function () {
                const transanction = await project.transaction(0);
                assert.equal(transanction[0], accounts[1]);
                assert.equal(transanction[1], 0);
            })

            it('check transaction length', async function () {
                const result = await project.transactionLength();
                assert.equal(result, 1);
            })
        });
    });
});
