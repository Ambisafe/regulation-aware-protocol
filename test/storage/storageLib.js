const assertsModule = require('../../dependencies/test/helpers/asserts');
const Reverter = require('../../dependencies/test/helpers/reverter');

const Mock = artifacts.require('Mock');
const Storage = artifacts.require('Storage');
const StorageTester = artifacts.require('StorageTester');

contract('StorageLib', function(accounts) {
  const reverter = new Reverter(web3);
  afterEach('revert', reverter.revert);

  const asserts = assertsModule(assert);
  let storage;
  let storageTester;
  let mock;

  const ignoreAuth = async (enabled = true) => {
    await mock.ignoreAllFrom(storage.address, enabled);
  };

  before('setup', async () => {
    mock = await Mock.new();
    storage = await Storage.new();
    storageTester = await StorageTester.new(storage.address, 'StorageTester');
    await ignoreAuth();
    await storage.setupAmbi2(mock.address);
    await storage.grantAccess('StorageTester', storageTester.address);
    await reverter.snapshot();
  });

  it('should store uint values', async () => {
    const value = web3.toBigNumber(`0x${'f'.repeat(64)}`);
    await storageTester.setUInt(value);
    assert.equal((await storageTester.getUInt()).valueOf(), value);
  });

  it('should store address values', async () => {
    const value = '0xffffffffffffffffffffffffffffffffffffffff';
    await storageTester.setAddress(value);
    assert.equal((await storageTester.getAddress()).valueOf(), value);
  });

  it('should store bool values', async () => {
    const value = true;
    await storageTester.setBool(value);
    assert.equal((await storageTester.getBool()).valueOf(), value);
  });

  it('should store int values', async () => {
    const value = web3.toBigNumber(2).pow(255).sub(1).mul(-1);
    await storageTester.setInt(value);
    assert.equal((await storageTester.getInt()).valueOf(), value);
  });

  it('should store bytes32 values', async () => {
    const value = `0x${'f'.repeat(64)}`;
    await storageTester.setBytes32(value);
    assert.equal((await storageTester.getBytes32()).valueOf(), value);
  });

  it('should store bytes32 => bytes32 mapping values', async () => {
    const key =
        '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
    const value = `0x${'f'.repeat(64)}`;
    await storageTester.setMapping(key, value);
    assert.equal((await storageTester.getMapping(key)).valueOf(), value);
  });

  it('should store address => uint mapping values', async () => {
    const key = '0xffffffffffffffffffffffffffffffffffffffff';
    const value =
        web3.toBigNumber(`0x${'f'.repeat(64)}`);
    await storageTester.setAddressUIntMapping(key, value);
    assert.equal(
      (await storageTester.getAddressUIntMapping(key)).valueOf(),
      value
    );
  });

  it('should store bytes32 set values', async () => {
    const value = `0x${'f'.repeat(64)}`;
    const value2 = `0x${'f'.repeat(62)}00`;
    let set;
    await storageTester.addSet(value);
    assert.isTrue(await storageTester.includesSet(value));
    assert.isFalse(await storageTester.includesSet(value2));
    assert.equal((await storageTester.countSet()).valueOf(), 1);
    set = await storageTester.getSet();
    assert.equal(set.length, 1);
    assert.equal(set[0], value);
    await storageTester.addSet(value2);
    assert.isTrue(await storageTester.includesSet(value));
    assert.isTrue(await storageTester.includesSet(value2));
    assert.equal((await storageTester.countSet()).valueOf(), 2);
    set = await storageTester.getSet();
    assert.equal(set.length, 2);
    assert.equal(set[0], value);
    assert.equal(set[1], value2);
    await storageTester.removeSet(value);
    assert.isFalse(await storageTester.includesSet(value));
    assert.isTrue(await storageTester.includesSet(value2));
    assert.equal((await storageTester.countSet()).valueOf(), 1);
    set = await storageTester.getSet();
    assert.equal(set.length, 1);
    assert.equal(set[0], value2);
    await storageTester.removeSet(value2);
    assert.isFalse(await storageTester.includesSet(value));
    assert.isFalse(await storageTester.includesSet(value2));
    assert.equal((await storageTester.countSet()).valueOf(), 0);
    set = await storageTester.getSet();
    assert.equal(set.length, 0);
  });

  it('should store address set values', async () => {
    const value = '0xffffffffffffffffffffffffffffffffffffffff';
    const value2 = '0xffffffffffffffffffffffffffffffffffffff00';
    let set;
    await storageTester.addAddressesSet(value);
    assert.isTrue(await storageTester.includesAddressesSet(value));
    assert.isFalse(await storageTester.includesAddressesSet(value2));
    assert.equal((await storageTester.countAddressesSet()).valueOf(), 1);
    set = await storageTester.getAddressesSet();
    assert.equal(set.length, 1);
    assert.equal(set[0], value);
    await storageTester.addAddressesSet(value2);
    assert.isTrue(await storageTester.includesAddressesSet(value));
    assert.isTrue(await storageTester.includesAddressesSet(value2));
    assert.equal((await storageTester.countAddressesSet()).valueOf(), 2);
    set = await storageTester.getAddressesSet();
    assert.equal(set.length, 2);
    assert.equal(set[0], value);
    assert.equal(set[1], value2);
    await storageTester.removeAddressesSet(value);
    assert.isFalse(await storageTester.includesAddressesSet(value));
    assert.isTrue(await storageTester.includesAddressesSet(value2));
    assert.equal((await storageTester.countAddressesSet()).valueOf(), 1);
    set = await storageTester.getAddressesSet();
    assert.equal(set.length, 1);
    assert.equal(set[0], value2);
    await storageTester.removeAddressesSet(value2);
    assert.isFalse(await storageTester.includesAddressesSet(value));
    assert.isFalse(await storageTester.includesAddressesSet(value2));
    assert.equal((await storageTester.countAddressesSet()).valueOf(), 0);
    set = await storageTester.getAddressesSet();
    assert.equal(set.length, 0);
  });

  it('should not allow repeated variables initialization', async () => {
    return asserts.throws(storageTester.reinit());
  });
});
