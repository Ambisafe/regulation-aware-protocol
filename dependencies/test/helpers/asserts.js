'use strict';

const toBytes32 = require('./bytes32')(web3);

module.exports = (assert) => ({
  equal: (expected) => {
    return (actual) => {
      assert.equal(actual.valueOf(), expected.valueOf());
      return true;
    };
  },
  isTrue: assert.isTrue,
  isFalse: assert.isFalse,
  throws: (promise) => {
    return promise.then(assert.fail, () => true);
  },
  error: (txResult, message, eventsCount = 1, errorEventIndex = 0) => {
    assert.equal(txResult.logs.length, eventsCount);
    assert.equal(txResult.logs[errorEventIndex].event, 'Error');
    assert.equal(
      txResult.logs[errorEventIndex].args.message,
      toBytes32(message)
    );
  },
});

