async function checkDetails(project, projectRaiseBy,
    projectMinimunAmount,
    projectMaximunAmount,
    projectMaxBackerAmount,
    projectMinBackerAmount,
    projectExpiredAt,
    projectAvailableAt,
    projectStartedAt,
    projectFinishedAt,
    projectUseToken) {

    it('returns ' + projectMinimunAmount, async function () {
        const initialized = await project.minimunAmount();
        assert.equal(initialized, projectMinimunAmount);
    })

    it('returns ' + projectRaiseBy, async function () {
        const raiseBy = await project.raiseBy();
        assert.equal(raiseBy, projectRaiseBy);
    })

    it('returns ' + projectMaximunAmount, async function () {
        const result = await project.maximunAmount();
        assert.equal(result, projectMaximunAmount);
    })

    it('returns ' + projectMaxBackerAmount, async function () {
        const result = await project.maxBackerAmount();
        assert.equal(result, projectMaxBackerAmount);
    })

    it('returns ' + projectMinBackerAmount, async function () {
        const result = await project.minBackerAmount();
        assert.equal(result, projectMinBackerAmount);
    })

    it('returns ' + projectExpiredAt, async function () {
        const result = await project.expiredAt();
        assert.equal(result, projectExpiredAt);
    })

    it('returns ' + projectStartedAt, async function () {
        const result = await project.startedAt();
        assert.equal(result, projectStartedAt);
    })

    it('returns ' + projectAvailableAt, async function () {
        const result = await project.availableAt();
        assert.equal(result, projectAvailableAt);
    })

    it('returns ' + projectFinishedAt, async function () {
        const result = await project.finishedAt();
        assert.equal(result, projectFinishedAt);
    })

    it('returns ' + projectUseToken, async function () {
        const result = await project.useToken();
        assert.equal(result, projectUseToken);
    })

}

module.exports = checkDetails;