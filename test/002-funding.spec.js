const Project = artifacts.require("Project");
const assertRevert = require('./helpers/assertRevert');

contract("Project 002", (accounts) => {
    const projectRaiseBy = accounts[0];
    const projectMinimunAmount = 2000;
    const projectMaximunAmount = 20000;
    const projectMaxBackerAmount = 1000;
    const projectMinBackerAmount = 100;
    const projectExpiredAt = 0;
    const projectAvailableAt = 0;
    const projectStartedAt = 0;
    const projectUseToken = false;
    const projectFinishedAt = 0;
    let project;
    let ref;

    before(async () => {
        project = await Project.new(
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
    })

    describe('Project Contract 002 Behavior', function () {
        describe('Fund (deductable)', function () {
            it('promise to fund', async function () {
                const result = await project.promiseToFund(accounts[1], 1000);
                const args = result.logs[0].args;
                assert.equal(accounts[1], args.contributor);
                assert.equal(0, args.index);
                assert.equal(1000, args.amount);
                ref = args.ref;
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

            it('check total balance', async function () {
                const totalBalance = await project.tokens(accounts[1]);
                assert.equal(totalBalance, 0);
            })

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

            it('returns 1000', async function () {
                const totalBalance = await project.totalBalance();
                assert.equal(totalBalance, 1000);
            })

            it('returns 1000', async function () {
                const totalBalance = await project.tokens(accounts[1]);
                assert.equal(totalBalance, 1000);
            })

            it('do not allow verification of already verified transaction', async function () {
                await assertRevert(project.fundReceived(0));
            })

            it('success', async function () {
                await assertRevert(project.promiseToFund(accounts[1], 1000))
            })

            it('failed - Tokens are deductable', async function () {
                await assertRevert(project.spend(accounts[0]))
            })

            it('check transaction length', async function () {
                const result = await project.transactionLength();
                assert.equal(result, 0);
            })

            it('success', async function () {
                const result = await project.spend(accounts[1], 500);
                assert.equal('0x01', result.receipt.status, 'spend tokens');
            })

            it('returns 1000', async function () {
                const totalBalance = await project.tokens(accounts[1]);
                assert.equal(totalBalance, 500);
            })

            it('check transaction length', async function () {
                const result = await project.transactionLength();
                assert.equal(result, 1);
            })            

            it('fail - Ιnsufficient balance', async function () {
                await assertRevert(project.spend(accounts[0], 1000)) // accounts[0] balance is zero
            })

            it('get list transanction', async function () {
                const transanction = await project.transaction(0);
                assert.equal(transanction[0], accounts[1]);
                assert.equal(transanction[1], 500);
            })

            it('check transaction length', async function () {
                const result = await project.transactionLength();
                assert.equal(result, 1);
            })
        });
    });
});