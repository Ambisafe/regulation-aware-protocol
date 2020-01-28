'use strict';

function AssertExpectations(assert, mock) {
  return async function(leftCalls = 0, executedCalls = null) {
    assert.equal((await mock.expectationsLeft()).valueOf(), leftCalls);
    const expectationsCount = await mock.expectationsCount();
    assert.equal(
      (await mock.callsCount()).valueOf(),
      executedCalls === null ? expectationsCount : executedCalls);
  };
}

module.exports = AssertExpectations;
