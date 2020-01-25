const Project = artifacts.require("Project");
const assertRevert = require('./helpers/assertRevert');

contract("Project", (accounts) => {
    let options = {};
    let project;

    before(async () => {
        project = await Project.new(accounts[0], 0, 0, 0, 0, 0, true);
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

            it('returns 0', async function () {
                const result = await project.maxBackerAmount();
                assert.equal(result, 0);
            })

            it('returns 0', async function () {
                const result = await project.totalBalance();
                assert.equal(result, 0);
            })

            it('returns 0', async function () {
                const result = await project.completeAt();
                assert.equal(result, 0);
            })

            it('returns 0', async function () {
                const result = await project.raisingEndsAt();
                assert.equal(result, 0);
            })

            it('returns true', async function () {
                const result = await project.useToken();
                assert.equal(result, true);
            })
        });  
        
        describe('Fund', function () {
            it('success', async function () {
                const result = await project.promiseToFund(accounts[1], 1000);
                assert.equal('0x01', result.receipt.status, 'register member');
            })

            it('returns 0', async function () {
                const totalBalance = await project.tokens(accounts[1]);
                assert.equal(totalBalance, 0);
            })

            it('success', async function () {
                const result = await project.fundReceived(0);
                assert.equal('0x01', result.receipt.status, 'register member');
            })

            it('returns 1000', async function () {
                const totalBalance = await project.totalBalance();
                assert.equal(totalBalance, 1000);
            })

            it('returns 1000', async function () {
                const totalBalance = await project.tokens(accounts[1]);
                assert.equal(totalBalance, 1000);
            })
        }); 
    });
});