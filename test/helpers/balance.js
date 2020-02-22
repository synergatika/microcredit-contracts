async function checkBalance(project, ac, tb, ab) {
    it('returns ' + tb, async function () {
        const totalBalance = await project.totalBalance();
        assert.equal(totalBalance, tb);
    })

    it('returns ' +  ac + '[' + ab + ']', async function () {
        const totalBalance = await project.tokens(ac);
        assert.equal(totalBalance, ab);
    })
}

module.exports = checkBalance;