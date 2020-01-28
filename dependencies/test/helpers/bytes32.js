'use strict';

function bytes32(web3) {
  return (stringOrNumber) => {
    const zeros = `${'0'.repeat(63)}`;
    if (typeof stringOrNumber === 'string') {
      return (web3.toHex(stringOrNumber) + zeros).slice(0, 66);
    }
    const hexNumber = web3.toHex(stringOrNumber).slice(2);
    return '0x' + (zeros + hexNumber).slice(-64);
  };
}

module.exports = bytes32;
