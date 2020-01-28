const Reverter = require('../../dependencies/test/helpers/reverter');
const bytes32 = require('../../dependencies/test/helpers/bytes32')(web3);
const AssertExpectations = require('../../dependencies/test/helpers/assertExpectations');

const ComplianceConfiguration = artifacts.require('ComplianceConfigurationTestable');
const Ambi2 = artifacts.require('Ambi2');
const Mock = artifacts.require('Mock');
const Storage = artifacts.require('Storage');

contract('ComplianceConfiguration', (accounts) => {
  const reverter = new Reverter(web3);
  afterEach('revert', reverter.revert);

  let complianceConfiguration;
  let ambi2;
  let mock;
  let storage;
  let assertExpectations;

  const ROLE = 'admin';
  const ALLOWED = accounts[1];
  const INSTITUTION = bytes32('USPX').slice(0, 10);
  const ICAP = bytes32('XE00USXUSPX123123123');

  const claimForSig = web3.sha3('claimFor(address,address)').slice(0, 10);
  const isOwnerSig = web3.sha3('isOwner(address,address)').slice(0, 10);

  const hasRoleData = (node, role, to) => {
    return ambi2.hasRole.request(node, role, to).params[0].data;
  };

  before('Setup', async () => {
    mock = await Mock.new();
    storage = await Storage.new();
    complianceConfiguration =
        await ComplianceConfiguration.new(
          storage.address,
          'ComplianceConfiguration'
        );
    assertExpectations = new AssertExpectations(assert, mock);
    ambi2 = await Ambi2.at(mock.address);
    await mock.ignore(claimForSig, true);
    await mock.ignore(isOwnerSig, true);
    await complianceConfiguration.setupAmbi2(mock.address);
    await mock.ignoreAllFrom(storage.address, true);
    await storage.setupAmbi2(mock.address);
    await storage.grantAccess(
      'ComplianceConfiguration',
      complianceConfiguration.address
    );
    await reverter.snapshot();
  });

  it('should be possible to set providers for user with specific role', async () => {
    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        ROLE,
        ALLOWED
      ),
      bytes32(1)
    );
    assert.isTrue(
      await complianceConfiguration.setProviders.call(
        [mock.address],
        {from: ALLOWED}
      )
    );
    await complianceConfiguration.setProviders(
      [mock.address],
      {from: ALLOWED}
    );
    await assertExpectations();
  });

  it('should be possible to set empty array of providers for user with specific role', async () => {
    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        ROLE,
        ALLOWED
      ), bytes32(1));
    assert.isTrue(
      await complianceConfiguration.setProviders.call([], {from: ALLOWED})
    );
    await complianceConfiguration.setProviders([], {from: ALLOWED});
    await assertExpectations();
  });

  it('should NOT be possible to set providers for user without specific role', async () => {
    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        ROLE,
        accounts[3]
      ), bytes32(0));
    assert.isFalse(
      await complianceConfiguration.setProviders.call(
        [mock.address],
        {from: accounts[3]}
      )
    );
    await complianceConfiguration.setProviders(
      [mock.address],
      {from: accounts[3]}
    );
    await assertExpectations();
  });

  it('should be possible to set, and then get, providers for user with specific role', async () => {
    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        ROLE,
        ALLOWED
      ), bytes32(1));
    await complianceConfiguration.setProviders(
      [mock.address],
      {from: ALLOWED}
    );
    await assertExpectations();
    assert.equal(
      (await complianceConfiguration.getProviders())[0],
      mock.address
    );
  });

  it('should not have providers by default', async () => {
    assert.equal((await complianceConfiguration.getProviders()).length, 0);
  });

  it('should allow to add address to the whitelist for user with specific role', async () => {
    const allowed = accounts[5];

    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'addToWhitelist',
        allowed
      ), bytes32(1));
    assert.isTrue(
      await complianceConfiguration.addToWhitelist.call(
        accounts[2],
        {from: allowed}
      )
    );
    await complianceConfiguration.addToWhitelist(accounts[2], {from: allowed});
    await assertExpectations();
  });

  it('should NOT allow to add address to the whitelist for user without specific role', async () => {
    const notAllowed = accounts[3];

    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'addToWhitelist',
        notAllowed
      ), bytes32(0));
    assert.isFalse(
      await complianceConfiguration.addToWhitelist.call(
        accounts[2],
        {from: notAllowed}
      )
    );
    await complianceConfiguration.addToWhitelist(
      accounts[2],
      {from: notAllowed}
    );
    await assertExpectations();
  });

  it('should emit AddedToWhitelist event when admin adds address to the white list', async () => {
    const allowed = accounts[5];
    const user = accounts[2];

    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'addToWhitelist',
        allowed
      ), bytes32(1));
    const result = await complianceConfiguration.addToWhitelist(
      user,
      {from: allowed}
    );
    assert.equal(result.logs.length, 1);
    assert.equal(result.logs[0].event, 'AddedToWhitelist');
    assert.equal(result.logs[0].args.addr, user);
    await assertExpectations();
  });

  it('should allow to remove address from the whitelist for user with specific role', async () => {
    const allowed = accounts[6];

    const user = accounts[2];

    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'addToWhitelist',
        allowed
      ), bytes32(1));
    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'removeFromWhitelist',
        allowed
      ), bytes32(1));
    await complianceConfiguration.addToWhitelist(user, {from: allowed});
    assert.isTrue(
      await complianceConfiguration.removeFromWhitelist.call(
        user,
        {from: allowed}
      )
    );
    await complianceConfiguration.removeFromWhitelist(user, {from: allowed});
    await assertExpectations();
  });

  it('should NOT allow to remove address from the whitelist for user without specific role', async () => {
    const allowed = accounts[6];
    const notAllowed = accounts[3];
    const user = accounts[2];

    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'addToWhitelist',
        allowed
      ), bytes32(1));
    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'removeFromWhitelist',
        notAllowed
      ), bytes32(0));
    await complianceConfiguration.addToWhitelist(user, {from: allowed});
    assert.isFalse(
      await complianceConfiguration.removeFromWhitelist.call(
        user,
        {from: notAllowed}
      )
    );
    await complianceConfiguration.removeFromWhitelist(
      user,
      {from: notAllowed}
    );
    await assertExpectations();
  });

  it('should emit RemovedFromWhitelist event when admin removes address from the whitelist', async () => {
    const allowed = accounts[6];
    const user = accounts[2];

    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'addToWhitelist',
        allowed
      ), bytes32(1));
    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'removeFromWhitelist',
        allowed
      ), bytes32(1));
    await complianceConfiguration.addToWhitelist(user, {from: allowed});
    const result =
        await complianceConfiguration.removeFromWhitelist(
          user,
          {from: allowed}
        );
    assert.equal(result.logs.length, 1);
    assert.equal(result.logs[0].event, 'RemovedFromWhitelist');
    assert.equal(result.logs[0].args.addr, user);
    await assertExpectations();
  });

  it('should allow to add ICAP institution to the whitelist for user with specific role', async () => {
    const allowed = accounts[5];

    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'addToWhitelistICAP',
        allowed
      ), bytes32(1));
    assert.isTrue(
      await complianceConfiguration.addToWhitelistICAPInstitution.call(
        INSTITUTION,
        {from: allowed}
      )
    );
    await complianceConfiguration.addToWhitelistICAPInstitution(
      INSTITUTION, {from: allowed});
    await assertExpectations();
    assert.isTrue(
      await complianceConfiguration.isWhitelistedICAPInstitution(INSTITUTION));
    assert.isTrue(await complianceConfiguration.isWhitelistedICAP(ICAP));
  });

  it('should NOT allow to add ICAP institution to the whitelist for user without specific role', async () => {
    const notAllowed = accounts[3];

    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'addToWhitelistICAP',
        notAllowed
      ), bytes32(0));
    assert.isFalse(
      await complianceConfiguration.addToWhitelistICAPInstitution.call(
        INSTITUTION,
        {from: notAllowed}
      )
    );
    await complianceConfiguration.addToWhitelistICAPInstitution(
      INSTITUTION,
      {from: notAllowed}
    );
    await assertExpectations();
    assert.isFalse(
      await complianceConfiguration.isWhitelistedICAPInstitution(INSTITUTION));
    assert.isFalse(await complianceConfiguration.isWhitelistedICAP(ICAP));
  });

  it('should emit AddedToWhitelistICAPInstitution event when admin adds address to the white list', async () => {
    const allowed = accounts[5];

    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'addToWhitelistICAP',
        allowed
      ), bytes32(1));
    const result = await complianceConfiguration.addToWhitelistICAPInstitution(
      INSTITUTION,
      {from: allowed}
    );
    assert.equal(result.logs.length, 1);
    assert.equal(result.logs[0].event, 'AddedToWhitelistICAPInstitution');
    assert.equal(result.logs[0].args.institution, INSTITUTION);
    await assertExpectations();
  });

  it('should allow to remove ICAP institution from the whitelist for user with specific role', async () => {
    const allowed = accounts[6];

    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'addToWhitelistICAP',
        allowed
      ), bytes32(1));
    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'removeFromWhitelistICAP',
        allowed
      ), bytes32(1));
    await complianceConfiguration.addToWhitelistICAPInstitution(
      INSTITUTION, {from: allowed});
    assert.isTrue(
      await complianceConfiguration.removeFromWhitelistICAPInstitution.call(
        INSTITUTION,
        {from: allowed}
      )
    );
    await complianceConfiguration.removeFromWhitelistICAPInstitution(
      INSTITUTION, {from: allowed});
    await assertExpectations();
    assert.isFalse(
      await complianceConfiguration.isWhitelistedICAPInstitution(INSTITUTION));
    assert.isFalse(await complianceConfiguration.isWhitelistedICAP(ICAP));
  });

  it('should NOT allow to remove ICAP institution from the whitelist for user without specific role', async () => {
    const allowed = accounts[6];
    const notAllowed = accounts[3];

    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'addToWhitelistICAP',
        allowed
      ), bytes32(1));
    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'removeFromWhitelistICAP',
        notAllowed
      ), bytes32(0));
    await complianceConfiguration.addToWhitelistICAPInstitution(
      INSTITUTION, {from: allowed});
    assert.isFalse(
      await complianceConfiguration.removeFromWhitelistICAPInstitution.call(
        INSTITUTION,
        {from: notAllowed}
      )
    );
    await complianceConfiguration.removeFromWhitelistICAPInstitution(
      INSTITUTION,
      {from: notAllowed}
    );
    await assertExpectations();
    assert.isTrue(
      await complianceConfiguration.isWhitelistedICAPInstitution(INSTITUTION));
    assert.isTrue(await complianceConfiguration.isWhitelistedICAP(ICAP));
  });

  it('should emit RemovedFromWhitelistICAPInstitution event when admin removes ICAP institution from the whitelist', async () => {
    const allowed = accounts[6];

    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'addToWhitelistICAP',
        allowed
      ), bytes32(1));
    await mock.expect(
      complianceConfiguration.address,
      0,
      hasRoleData(
        complianceConfiguration.address,
        'removeFromWhitelistICAP',
        allowed
      ), bytes32(1));
    await complianceConfiguration.addToWhitelistICAPInstitution(
      INSTITUTION, {from: allowed});
    const result =
        await complianceConfiguration.removeFromWhitelistICAPInstitution(
          INSTITUTION,
          {from: allowed}
        );
    assert.equal(result.logs.length, 1);
    assert.equal(result.logs[0].event, 'RemovedFromWhitelistICAPInstitution');
    assert.equal(result.logs[0].args.institution, INSTITUTION);
    await assertExpectations();
  });
});
