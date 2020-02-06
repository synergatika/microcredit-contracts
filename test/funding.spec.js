const Project = artifacts.require("Project");
const assertRevert = require('./helpers/assertRevert');

contract("Project", (accounts) => {
    let options = {};
    let project;
    let ref;

    before(async () => {
        project = await Project.new(accounts[0], 0, 0, 1000, 0, 0, 0, true);
    })

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

            it('returns true', async function () {
                const result = await project.useToken();
                assert.equal(result, true);
            })
        });

        describe('Fund', function () {

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

            it('success', async function () {
                const result = await project.spend(accounts[1]);
                assert.equal('0x01', result.receipt.status, 'spend tokens');
            })

            it('success', async function () {
                await assertRevert(project.spend(accounts[0])) // accounts[0] balance is zero
            })

            it('get list transanction', async function () {
                const transanction = await project.transaction(0);
                assert.equal(transanction[0], accounts[1]);
                assert.equal(transanction[1], 0);
            })
        });
    });
});