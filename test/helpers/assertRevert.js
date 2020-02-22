async function assertRevert(promise) {
  let isFailed = false;

  try {
    await promise;
    isFailed = true;
    throw new Error('Expected revert not received');
  } catch (error) {
    if (isFailed) {
      assert.equal(0, 1);
    } else {
      const revertFound = error.message.search('revert') >= 0;
      assert(revertFound, `Expected "revert", got ${error} instead`);
    }

  }
}

module.exports = assertRevert;