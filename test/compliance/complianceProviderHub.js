const Reverter = require('../../dependencies/test/helpers/reverter');
const bytes32 = require('../../dependencies/test/helpers/bytes32')(web3);
const AssertExpectations = require('../../dependencies/test/helpers/assertExpectations');

const ComplianceProviderHub = artifacts.require('ComplianceProviderHub');
const Ambi2 = artifacts.require('Ambi2');
const Mock = artifacts.require('Mock');

contract('ComplianceProviderHub', (accounts) => {
  const reverter = new Reverter(web3);
  afterEach('revert', reverter.revert);

  let complianceProviderHub;
  const ambi2 = web3.eth.contract(Ambi2.abi).at(accounts[6]);
  let mockAmbi;
  let mockProvider;
  let mockProvider2;
  let assertExpectations;
  let assertExpectations2;
  let assertExpectations3;

  const ADMIN = 'admin';
  const ALLOWED = accounts[1];
  const USER = accounts[5];
  const COUNTRY = 'country';
  const KYC = 'kyc';

  const assertAllExpectations = async () => {
    await assertExpectations();
    await assertExpectations2();
    await assertExpectations3();
  };

  const hasRoleData = (node, role, to) => {
    return ambi2.hasRole.request(node, role, to).params[0].data;
  };

  const expectGetProperty = async (provider, address, property, value) => {
    await provider.expect(
      complianceProviderHub.address,
      0,
      complianceProviderHub.getProperty.request(
        address, property).params[0].data,
      value
    );
  };

  before('Setup', async function() {
    complianceProviderHub = await ComplianceProviderHub.new();
    mockAmbi = await Mock.new();
    mockProvider = await Mock.new();
    mockProvider2 = await Mock.new();
    assertExpectations = new AssertExpectations(assert, mockAmbi);
    assertExpectations2 = new AssertExpectations(assert, mockProvider);
    assertExpectations3 = new AssertExpectations(assert, mockProvider2);
    await mockAmbi.ignore(ambi2.claimFor.getData('', '').slice(0, 10), true);
    await mockAmbi.ignore(ambi2.isOwner.getData('', '').slice(0, 10), true);
    await complianceProviderHub.setupAmbi2(mockAmbi.address);
    await reverter.snapshot();
  });

  it('should be possible to set providers for user with specific role', async () => {
    await mockAmbi.expect(
      complianceProviderHub.address,
      0,
      hasRoleData(
        complianceProviderHub.address,
        ADMIN,
        ALLOWED
      ),
      bytes32(1)
    );
    assert.isTrue(
      await complianceProviderHub.setProviders.call(
        [mockProvider.address, mockProvider2.address],
        {from: ALLOWED}
      )
    );
    await complianceProviderHub.setProviders(
      [mockProvider.address, mockProvider2.address],
      {from: ALLOWED}
    );
    await assertAllExpectations();
  });

  it('should be possible to set empty array of providers for user with specific role', async () => {
    await mockAmbi.expect(
      complianceProviderHub.address,
      0,
      hasRoleData(
        complianceProviderHub.address,
        ADMIN,
        ALLOWED
      ), bytes32(1));
    assert.isTrue(
      await complianceProviderHub.setProviders.call([], {from: ALLOWED})
    );
    await complianceProviderHub.setProviders([], {from: ALLOWED});
    await assertAllExpectations();
  });

  it('should NOT be possible to set providers for user without specific role', async () => {
    await mockAmbi.expect(
      complianceProviderHub.address,
      0,
      hasRoleData(
        complianceProviderHub.address,
        ADMIN,
        accounts[3]
      ), bytes32(0));
    assert.isFalse(
      await complianceProviderHub.setProviders.call(
        [mockProvider.address],
        {from: accounts[3]}
      )
    );
    await complianceProviderHub.setProviders(
      [mockProvider.address],
      {from: accounts[3]}
    );
    assert.equal((await complianceProviderHub.getProviders()).length, 0);
    await assertAllExpectations();
  });

  it('should be possible to set, and then get, providers for user with specific role', async () => {
    await mockAmbi.expect(
      complianceProviderHub.address,
      0,
      hasRoleData(
        complianceProviderHub.address,
        ADMIN,
        ALLOWED
      ), bytes32(1));
    const result = await complianceProviderHub.setProviders(
      [mockProvider.address, mockProvider2.address],
      {from: ALLOWED}
    );
    assert.equal(
      (await complianceProviderHub.getProviders())[0],
      mockProvider.address
    );
    assert.equal(
      (await complianceProviderHub.getProviders())[1],
      mockProvider2.address
    );
    assert.equal(result.logs.length, 1);
    assert.equal(result.logs[0].address, complianceProviderHub.address);
    assert.equal(result.logs[0].event, 'ProvidersUpdated');
    assert.equal(result.logs[0].args.providers[0], mockProvider.address);
    assert.equal(result.logs[0].args.providers[1], mockProvider2.address);
    await assertAllExpectations();
  });

  it('should not have providers by default', async () => {
    assert.equal((await complianceProviderHub.getProviders()).length, 0);
  });

  it('should be possible to get property from first provider', async () => {
    const country = bytes32('TS');
    await mockAmbi.expect(
      complianceProviderHub.address,
      0,
      hasRoleData(
        complianceProviderHub.address,
        ADMIN,
        ALLOWED
      ), bytes32(1));
    await complianceProviderHub.setProviders(
      [mockProvider.address, mockProvider2.address],
      {from: ALLOWED}
    );
    await expectGetProperty(mockProvider, USER, COUNTRY, country);
    assert.equal(
      (await complianceProviderHub.getProperty(USER, COUNTRY)),
      country
    );
    await complianceProviderHub.getProperty.sendTransaction(USER, COUNTRY);
    await assertAllExpectations();
  });

  it('should be possible to get property from second provider', async () => {
    const country = bytes32('TS');
    await mockAmbi.expect(
      complianceProviderHub.address,
      0,
      hasRoleData(
        complianceProviderHub.address,
        ADMIN,
        ALLOWED
      ), bytes32(1));
    await complianceProviderHub.setProviders(
      [mockProvider.address, mockProvider2.address],
      {from: ALLOWED}
    );
    await expectGetProperty(mockProvider, USER, COUNTRY, bytes32(0));
    await expectGetProperty(mockProvider2, USER, COUNTRY, country);
    assert.equal(
      (await complianceProviderHub.getProperty(USER, COUNTRY)),
      country
    );
    await complianceProviderHub.getProperty.sendTransaction(USER, COUNTRY);
    await assertAllExpectations();
  });

  it('should be possible to get property from 2 providers', async () => {
    const country = bytes32('TS');
    const kyc = bytes32(5);
    await mockAmbi.expect(
      complianceProviderHub.address,
      0,
      hasRoleData(
        complianceProviderHub.address,
        ADMIN,
        ALLOWED
      ), bytes32(1));
    await complianceProviderHub.setProviders(
      [mockProvider.address, mockProvider2.address],
      {from: ALLOWED}
    );
    await expectGetProperty(mockProvider, USER, COUNTRY, country);
    await expectGetProperty(mockProvider, USER, KYC, bytes32(0));
    await expectGetProperty(mockProvider2, USER, KYC, kyc);
    assert.equal(
      (await complianceProviderHub.getProperty(USER, COUNTRY)),
      country
    );
    assert.equal(
      (await complianceProviderHub.getProperty(USER, KYC)),
      kyc
    );
    await complianceProviderHub.getProperty.sendTransaction(USER, COUNTRY);
    await complianceProviderHub.getProperty.sendTransaction(USER, KYC);
    await assertAllExpectations();
  });
});
