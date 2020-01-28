const assertsModule = require('../../dependencies/test/helpers/asserts');
const Reverter = require('../../dependencies/test/helpers/reverter');
const AssertExpectations = require('../../dependencies/test/helpers/assertExpectations');

const Mock = artifacts.require('Mock');
const Ambi2 = artifacts.require('Ambi2');
const Storage = artifacts.require('Storage');

contract('Storage', function(accounts) {
  const reverter = new Reverter(web3);
  afterEach('revert', reverter.revert);

  const asserts = assertsModule(assert);
  let storage;
  let mock;
  let assertExpectations;
  let ambi2;
  const KEY =
      '0x1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef';
  const CRATE = 'SomeCrate';

  const ZERO_BYTES32 = `0x${'0'.repeat(64)}`;
  const TRUE_BYTES32 = `0x${'0'.repeat(63)}1`;
  const FULL_BYTES32 = `0x${'f'.repeat(64)}`;
  const BYTES = `0x${'f'.repeat(102)}`;
  const EMPTY_BYTES = '0x';

  const hasRoleSig =
      web3.sha3('hasRole(address,bytes32,address)').slice(0, 10);
  const claimForSig = web3.sha3('claimFor(address,address)').slice(0, 10);
  const isOwnerSig = web3.sha3('isOwner(address,address)').slice(0, 10);

  const ignoreAuth = async (enabled = true) => {
    await mock.ignore(hasRoleSig, enabled);
  };

  const hasRoleData = (node, role, to) => {
    return ambi2.hasRole.request(node, role, to).params[0].data;
  };

  before('setup', async () => {
    storage = await Storage.new();
    mock = await Mock.new();
    assertExpectations = new AssertExpectations(assert, mock);
    ambi2 = await Ambi2.at(mock.address);
    await mock.ignore(claimForSig, true);
    await mock.ignore(isOwnerSig, true);
    await ignoreAuth();
    await storage.setupAmbi2(mock.address);
    await reverter.snapshot();
  });

  it('should store bytes32 values', async () => {
    const value = FULL_BYTES32;
    await storage.grantAccess(CRATE, accounts[0]);
    await storage.set(CRATE, KEY, value);
    assert.equal((await storage.get(CRATE, KEY)).valueOf(), value);
  });

  it('should not store bytes32 values if not allowed', async () => {
    const value = FULL_BYTES32;
    await asserts.throws(storage.set(CRATE, KEY, value));
    assert.equal((await storage.get(CRATE, KEY)).valueOf(), ZERO_BYTES32);
  });

  it('should not store bytes32 values after revoking access', async () => {
    const value = FULL_BYTES32;
    await storage.grantAccess(CRATE, accounts[0]);
    await storage.revokeAccess(CRATE, accounts[0]);
    await asserts.throws(storage.set(CRATE, KEY, value));
    assert.equal((await storage.get(CRATE, KEY)).valueOf(), ZERO_BYTES32);
  });

  it('should store bytes values', async () => {
    const value = BYTES;
    await storage.grantAccess(CRATE, accounts[0]);
    await storage.setBytes(CRATE, KEY, value);
    assert.equal((await storage.getBytes(CRATE, KEY)).valueOf(), value);
  });

  it('should not store bytes values if not allowed', async () => {
    const value = BYTES;
    await asserts.throws(storage.setBytes(CRATE, KEY, value));
    assert.equal((await storage.getBytes(CRATE, KEY)).valueOf(), EMPTY_BYTES);
  });

  it('should not store bytes values after revoking access', async () => {
    const value = BYTES;
    await storage.grantAccess(CRATE, accounts[0]);
    await storage.revokeAccess(CRATE, accounts[0]);
    await asserts.throws(storage.setBytes(CRATE, KEY, value));
    assert.equal((await storage.getBytes(CRATE, KEY)).valueOf(), EMPTY_BYTES);
  });

  it('should not store values if has access to another crate', async () => {
    const value = FULL_BYTES32;
    await storage.grantAccess('AnotherCrate', accounts[0]);
    await asserts.throws(storage.set(CRATE, KEY, value));
    assert.equal((await storage.get(CRATE, KEY)).valueOf(), ZERO_BYTES32);
  });

  it('should not allow to grant access if not admin', async () => {
    await ignoreAuth(false);
    await mock.expect(
      storage.address,
      0,
      hasRoleData(storage.address, 'admin', accounts[0]),
      ZERO_BYTES32
    );
    await storage.grantAccess('AnotherCrate', accounts[0]);
    assert.isFalse(await storage.hasAccess('AnotherCrate', accounts[0]));
    await assertExpectations();
  });

  it('should allow admin to grant access', async () => {
    await ignoreAuth(false);
    await mock.expect(
      storage.address,
      0,
      hasRoleData(storage.address, 'admin', accounts[0]),
      TRUE_BYTES32
    );
    await storage.grantAccess('AnotherCrate', accounts[0]);
    assert.isTrue(await storage.hasAccess('AnotherCrate', accounts[0]));
    await assertExpectations();
  });

  it('should not allow to revoke access if not admin', async () => {
    await storage.grantAccess('AnotherCrate', accounts[0]);
    await ignoreAuth(false);
    await mock.expect(
      storage.address,
      0,
      hasRoleData(storage.address, 'admin', accounts[0]),
      ZERO_BYTES32
    );
    await storage.revokeAccess('AnotherCrate', accounts[0]);
    assert.isTrue(await storage.hasAccess('AnotherCrate', accounts[0]));
    await assertExpectations();
  });

  it('should allow admin to revoke access', async () => {
    await storage.grantAccess('AnotherCrate', accounts[0]);
    await ignoreAuth(false);
    await mock.expect(
      storage.address,
      0,
      hasRoleData(storage.address, 'admin', accounts[0]),
      TRUE_BYTES32
    );
    await storage.revokeAccess('AnotherCrate', accounts[0]);
    assert.isFalse(await storage.hasAccess('AnotherCrate', accounts[0]));
    await assertExpectations();
  });
});
