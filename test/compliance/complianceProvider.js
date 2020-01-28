const Reverter = require('../../dependencies/test/helpers/reverter');
const bytes32 = require('../../dependencies/test/helpers/bytes32')(web3);
const AssertExpectations = require('../../dependencies/test/helpers/assertExpectations');

const ComplianceProvider = artifacts.require('ComplianceProvider');
const Ambi2 = artifacts.require('Ambi2');
const Mock = artifacts.require('Mock');

const bytesToString = function(bytes) {
  return web3.toAscii(bytes.split('00')[0]);
};

contract('ComplianceProvider', (accounts) => {
  const reverter = new Reverter(web3);
  afterEach('revert', reverter.revert);

  let complianceProvider;
  const ambi2 = web3.eth.contract(Ambi2.abi).at(accounts[6]);
  let mock;
  let assertExpectations;

  const ROLE = 'admin';
  const ALLOWED = accounts[1];

  before('Setup', async function() {
    complianceProvider = await ComplianceProvider.new();
    mock = await Mock.new();
    assertExpectations = new AssertExpectations(assert, mock);
    await mock.ignore(ambi2.claimFor.getData('', '').slice(0, 10), true);
    await mock.ignore(ambi2.isOwner.getData('', '').slice(0, 10), true);
    await complianceProvider.setupAmbi2(mock.address);
    await reverter.snapshot();
  });

  it('should be possible to set property for user with specific role', async function() {
    const user = accounts[3];
    await mock.expect(
      complianceProvider.address,
      0,
      ambi2.hasRole.getData(
        complianceProvider.address,
        ROLE,
        ALLOWED
      ), bytes32(1));
    const result =
        await complianceProvider.setProperty.call(
          user,
          'testKey',
          'testValue',
          {from: ALLOWED}
        );
    assert.isTrue(result);
    await complianceProvider.setProperty(
      user,
      'testKey',
      'testValue',
      {from: ALLOWED});
    await assertExpectations();
  });

  it('should be possible to set properties for users with specific role', async function() {
    const user = accounts[3];
    const user2 = accounts[4];
    await mock.expect(
      complianceProvider.address,
      0,
      ambi2.hasRole.getData(
        complianceProvider.address,
        ROLE,
        ALLOWED
      ), bytes32(1));
    const result =
        await complianceProvider.setProperties.call(
          [user, user2],
          ['testKey', 'testKey2'],
          ['testValue', 'testValue2'],
          {from: ALLOWED}
        );
    assert.isTrue(result);
    const txResult = await complianceProvider.setProperties(
      [user, user2],
      ['testKey', 'testKey2'],
      ['testValue', 'testValue2'],
      {from: ALLOWED});
    assert.equal(txResult.logs.length, 2);
    await assertExpectations();
  });

  it('should NOT be possible to set property for user without specific role', async function() {
    const user = accounts[3];
    await mock.expect(
      complianceProvider.address,
      0,
      ambi2.hasRole.getData(
        complianceProvider.address,
        ROLE,
        accounts[2]
      ), bytes32(0));
    const result =
        await complianceProvider.setProperty.call(
          user,
          'testKey',
          'testValue',
          {from: accounts[2]}
        );
    assert.isFalse(result);
    await complianceProvider.setProperty(
      user,
      'testKey',
      'testValue',
      {from: accounts[2]}
    );
    await assertExpectations();
  });

  it('should emit PropertySet event when admin sets property', async function() {
    const user = accounts[3];
    const testKey = 'testKey';
    const testValue = 'testValue';
    await mock.expect(
      complianceProvider.address,
      0,
      ambi2.hasRole.getData(
        complianceProvider.address,
        ROLE,
        ALLOWED
      ), bytes32(1));
    const result =
        await complianceProvider.setProperty(
          user,
          testKey,
          testValue,
          {from: ALLOWED}
        );
    assert.equal(result.logs.length, 1);
    assert.equal(result.logs[0].event, 'PropertySet');
    assert.equal(result.logs[0].args.addr, user);
    assert.equal(bytesToString(result.logs[0].args.propertyKey), testKey);
    assert.equal(bytesToString(result.logs[0].args.propertyValue), testValue);
    await assertExpectations();
  });

  it('should NOT emit PropertySet event when user without specific role sets property', async function() {
    const user = accounts[3];
    await mock.expect(
      complianceProvider.address,
      0,
      ambi2.hasRole.getData(
        complianceProvider.address,
        ROLE,
        accounts[2]
      ), bytes32(0));
    const result =
        await complianceProvider.setProperty(
          user,
          'testKey',
          'testValue',
          {from: accounts[2]}
        );
    assert.equal(result.logs.length, 0);
    await assertExpectations();
  });

  it('should be possible to get property', async function() {
    const user = accounts[3];
    const testKey = 'testKey';
    const testValue = 'testValue';
    await mock.expect(
      complianceProvider.address,
      0,
      ambi2.hasRole.getData(
        complianceProvider.address,
        ROLE,
        ALLOWED
      ), bytes32(1));
    await complianceProvider.setProperty(
      user,
      testKey,
      testValue,
      {from: ALLOWED}
    );
    const result = await complianceProvider.getProperty(user, testKey);
    assert.equal(bytesToString(result), testValue);
    await assertExpectations();
  });

  it('should NOT be possible to get property for unknown address', async function() {
    const user = accounts[3];
    const testKey = 'testKey';
    const testValue = 'testValue';
    await mock.expect(
      complianceProvider.address,
      0,
      ambi2.hasRole.getData(
        complianceProvider.address,
        ROLE,
        ALLOWED
      ), bytes32(1));
    await complianceProvider.setProperty(
      user,
      testKey,
      testValue,
      {from: ALLOWED}
    );
    const result = await complianceProvider.getProperty(accounts[4], testKey);
    assert.equal(bytesToString(result), '');
    await assertExpectations();
  });

  it('should NOT be possible to get property for unknown propertyKey', async function() {
    const user = accounts[3];
    const testKey = 'testKey';
    const testValue = 'testValue';
    await mock.expect(
      complianceProvider.address,
      0,
      ambi2.hasRole.getData(
        complianceProvider.address,
        ROLE,
        ALLOWED
      ), bytes32(1));
    await complianceProvider.setProperty(
      user,
      testKey,
      testValue,
      {from: ALLOWED}
    );
    const result = await complianceProvider.getProperty(user, 'notValidKey');
    assert.equal(bytesToString(result), '');
    await assertExpectations();
  });

  it('should be possible to modify property', async function() {
    const user = accounts[3];
    const testKey = 'testKey';
    const updatedValue = 'updatedValue';
    await mock.expect(
      complianceProvider.address,
      0,
      ambi2.hasRole.getData(
        complianceProvider.address,
        ROLE,
        ALLOWED
      ), bytes32(1));
    await mock.expect(
      complianceProvider.address,
      0,
      ambi2.hasRole.getData(
        complianceProvider.address,
        ROLE,
        ALLOWED
      ), bytes32(1));
    await complianceProvider.setProperty(
      user,
      testKey,
      'testValue',
      {from: ALLOWED}
    );
    await complianceProvider.setProperty(
      user,
      testKey,
      updatedValue,
      {from: ALLOWED}
    );
    const result = await complianceProvider.getProperty(user, testKey);
    assert.equal(bytesToString(result), updatedValue);
    await assertExpectations();
  });
});
