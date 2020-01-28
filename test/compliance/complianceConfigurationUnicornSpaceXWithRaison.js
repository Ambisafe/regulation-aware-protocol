const Reverter = require('../../dependencies/test/helpers/reverter');
const bytes32 = require('../../dependencies/test/helpers/bytes32')(web3);
const AssertExpectations = require('../../dependencies/test/helpers/assertExpectations');

const ComplianceConfigurationUnicornSpaceX = artifacts.require('ComplianceConfigurationUnicornSpaceX');
const Mock = artifacts.require('Mock');
const Storage = artifacts.require('Storage');
const ComplianceProvider = artifacts.require('ComplianceProvider');

contract('ComplianceConfigurationUnicornSpaceX', (accounts) => {
  const reverter = new Reverter(web3);
  afterEach('revert', reverter.revert);

  let storage;
  let complianceConfigurationUnicornSpaceX;
  let mock;
  let assertExpectations;

  const KYCValue = bytes32(5);

  const INSTITUTION = 'USPX';
  const ICAP = 'XE00USXUSPX123123123';

  const claimForSig = web3.sha3('claimFor(address,address)').slice(0, 10);

  const getData = (id) => {
    return storage.get.request(
      'ComplianceConfigurationUSpaceX',
      id
    ).params[0].data;
  };

  const complianceProvider =
    web3.eth.contract(ComplianceProvider.abi).at(accounts[5]);

  const expectGetProvidersCount = async (count = 1) => {
    await mock.expect(
      complianceConfigurationUnicornSpaceX.address,
      0,
      getData(web3.sha3(
        bytes32('providers') + web3.toHex('count').slice(2),
        {encoding: 'hex'}
      )),
      bytes32(count)
    );
  };

  const expectGetProvider = async (index = 0) => {
    await expectGetProvidersCount();
    await expectGetProvidersCount();
    await mock.expect(
      complianceConfigurationUnicornSpaceX.address,
      0,
      getData(
        web3.sha3(
          web3.sha3(bytes32('providers') + web3.toHex('values').slice(2),
            {encoding: 'hex'}) + bytes32(index + 1).slice(-64),
          {encoding: 'hex'}
        )
      ),
      addressToBytes32(mock.address)
    );
  };

  const addressToBytes32 = (address) => {
    return address.split('0x').join('0x000000000000000000000000');
  };

  const expectCountry = async (address, country) => {
    await expectGetProvider();
    await mock.expect(
      complianceConfigurationUnicornSpaceX.address,
      0,
      complianceProvider.getProperty.getData(
        address,
        'country'
      ),
      bytes32(country)
    );
  };

  const expectRegion = async (address, region) => {
    await expectGetProvider();
    await mock.expect(
      complianceConfigurationUnicornSpaceX.address,
      0,
      complianceProvider.getProperty.getData(
        address,
        'region'
      ),
      bytes32(region)
    );
  };

  const expectKYC = async (address, kycLevel) => {
    await expectGetProvider();
    await mock.expect(
      complianceConfigurationUnicornSpaceX.address,
      0,
      complianceProvider.getProperty.getData(
        address,
        'kyc'
      ),
      bytes32(kycLevel)
    );
  };

  const expectIsWhitelisted = async (address, isWhitelisted) => {
    await mock.expect(
      complianceConfigurationUnicornSpaceX.address,
      0,
      getData(web3.sha3(
        bytes32('whitelist') + addressToBytes32(address).slice(-64),
        {encoding: 'hex'}
      )),
      bytes32(isWhitelisted ? 1 : 0)
    );
  };

  const expectIsWhitelistedICAPInst = async (institution, isWhitelisted) => {
    await mock.expect(
      complianceConfigurationUnicornSpaceX.address,
      0,
      getData(web3.sha3(
        bytes32('whitelistICAP') + bytes32(institution).slice(-64),
        {encoding: 'hex'}
      )),
      bytes32(isWhitelisted ? 1 : 0)
    );
  };

  const assertIsTransferNotPossible = async (sender, receiver) => {
    assert.isFalse(
      await complianceConfigurationUnicornSpaceX.isTransferAllowed(
        sender,
        receiver,
        1
      )
    );
    await complianceConfigurationUnicornSpaceX.isTransferAllowed
    .sendTransaction(
      sender,
      receiver,
      1
    );
    await assertExpectations();
  };

  const assertIsTransferPossible = async (sender, receiver) => {
    assert.isTrue(
      await complianceConfigurationUnicornSpaceX.isTransferAllowed(
        sender,
        receiver,
        1
      )
    );
    await complianceConfigurationUnicornSpaceX.isTransferAllowed
    .sendTransaction(
      sender,
      receiver,
      1
    );
    await assertExpectations();
  };

  before('Setup', async () => {
    storage = await Storage.new();
    mock = await Mock.new();
    complianceConfigurationUnicornSpaceX =
      await ComplianceConfigurationUnicornSpaceX.new(mock.address);
    assertExpectations = new AssertExpectations(assert, mock);
    await mock.ignore(claimForSig, true);
    await complianceConfigurationUnicornSpaceX.setupAmbi2(mock.address);
    await reverter.snapshot();
  });

  describe('Whitelist, KYC and ICAP', async () => {
    it('should be allowed to transfer from address from whitelist to address from whitelist', async () => {
      const sender = accounts[2];
      const receiver = accounts[3];
      // await expectIsWhitelisted(sender, true);
      await expectIsWhitelisted(receiver, true);
      await assertIsTransferPossible(sender, receiver);
    });

    it('should be allowed to transfer from address NOT from whitelist to address from whitelist', async () => {
      const sender = accounts[2];
      const receiver = accounts[3];
      // await expectIsWhitelisted(sender, false);
      await expectIsWhitelisted(receiver, true);
      await assertIsTransferPossible(sender, receiver);
    });

    it('should NOT be allowed to transfer from address from whitelist to address NOT from whitelist', async () => {
      const sender = accounts[2];
      const receiver = accounts[3];

      // await expectIsWhitelisted(sender, true);
      await expectIsWhitelisted(receiver, false);
      await expectKYC(receiver, 0);
      await assertIsTransferNotPossible(sender, receiver);
    });

    it('should NOT be allowed to transfer from allowed address to receiver with not reached KYC', async () => {
      const sender = accounts[2];
      const receiver = accounts[3];

      // await expectIsWhitelisted(sender, true);
      await expectIsWhitelisted(receiver, false);
      await expectKYC(receiver, bytes32(4));
      await assertIsTransferNotPossible(sender, receiver);
    });

    it('should NOT be allowed to transfer from allowed address to receiver with unknown country', async () => {
      const sender = accounts[2];
      const receiver = accounts[3];
      const receiverCountry = '';

      // await expectIsWhitelisted(sender, true);
      await expectIsWhitelisted(receiver, false);
      await expectKYC(receiver, KYCValue);
      await expectCountry(receiver, receiverCountry);
      await assertIsTransferNotPossible(sender, receiver);
    });

    it('should be allowed to transfer from NOT whitelisted address to whitelisted ICAP', async () => {
      const sender = accounts[2];
      // await expectIsWhitelisted(sender, false);
      await expectIsWhitelistedICAPInst(INSTITUTION, true);

      assert.isTrue(
        await complianceConfigurationUnicornSpaceX.isTransferToICAPAllowed.call(
          sender,
          ICAP,
          1
        )
      );
    });

    it('should NOT be allowed to transfer from whitelisted address to NOT whitelisted ICAP', async () => {
      const sender = accounts[2];
      // await expectIsWhitelisted(sender, true);
      await expectIsWhitelistedICAPInst(INSTITUTION, false);

      assert.isFalse(
        await complianceConfigurationUnicornSpaceX.isTransferToICAPAllowed.call(
          sender,
          ICAP,
          1
        )
      );
    });

    it('should be allowed to transfer from whitelisted address to whitelisted ICAP', async () => {
      const sender = accounts[2];
      // await expectIsWhitelisted(sender, true);
      await expectIsWhitelistedICAPInst(INSTITUTION, true);

      assert.isTrue(
        await complianceConfigurationUnicornSpaceX.isTransferToICAPAllowed.call(
          sender,
          ICAP,
          1
        )
      );
    });
  });

  describe('Countries', async () => {
    const blockedCountries = [
      {name: 'Afghanistan', abbreviation: 'AF'},
      {name: 'Burundi', abbreviation: 'BI'},
      {name: 'Albania', abbreviation: 'AL'},
      {name: 'Kosovo', abbreviation: 'XK'},
      {name: 'Central African Republic', abbreviation: 'CF'},
      {name: 'Congo Brazzaville', abbreviation: 'CG'},
      {name: 'Congo Kinshasa', abbreviation: 'CD'},
      {name: 'Cuba', abbreviation: 'CU'},
      {name: 'Cyprus', abbreviation: 'CY'},
      {name: 'Eritrea', abbreviation: 'ER'},
      {name: 'Iran', abbreviation: 'IR'},
      {name: 'Iraq', abbreviation: 'IQ'},
      {name: 'Lebanon', abbreviation: 'LB'},
      {name: 'Liberia', abbreviation: 'LR'},
      {name: 'Libya', abbreviation: 'LY'},
      {name: 'Macao', abbreviation: 'MO'},
      {name: 'Myanmar', abbreviation: 'MM'},
      {name: 'Korea North', abbreviation: 'KP'},
      {name: 'Somalia', abbreviation: 'SO'},
      {name: 'Sudan', abbreviation: 'SD'},
      {name: 'Syria', abbreviation: 'SY'},
      {name: 'Venezuela', abbreviation: 'VE'},
      {name: 'Yemen', abbreviation: 'YE'},
      {name: 'Zimbabwe', abbreviation: 'ZW'},
    ];

    const blockedCountriesWithFutureAccreditation = [
      {name: 'Switzerland', abbreviation: 'CH'},
      {name: 'Japan', abbreviation: 'JP'},
      {name: 'Singapore', abbreviation: 'SG'},
      {name: 'UnitedStatesOfAmerica', abbreviation: 'US'},
    ];

    const raisonAiAllowedCountries = [
      {name: 'Australia', abbreviation: 'AU'},
      {name: 'Brazil', abbreviation: 'BR'},
      {name: 'New Zealand', abbreviation: 'NZ'},
      {name: 'Israel', abbreviation: 'IL'},
      {name: 'Canada', abbreviation: 'CA'},
      {name: 'Austria', abbreviation: 'AT'},
      {name: 'Belgium', abbreviation: 'BE'},
      {name: 'Bulgaria', abbreviation: 'BG'},
      {name: 'Croatia', abbreviation: 'HR'},
      {name: 'Czech Republic', abbreviation: 'CZ'},
      {name: 'Denmark', abbreviation: 'DK'},
      {name: 'Estonia', abbreviation: 'EE'},
      {name: 'Finland', abbreviation: 'FI'},
      {name: 'France', abbreviation: 'FR'},
      {name: 'Germany', abbreviation: 'DE'},
      {name: 'Greece', abbreviation: 'GR'},
      {name: 'Hungary', abbreviation: 'HU'},
      {name: 'Ireland', abbreviation: 'IE'},
      {name: 'Italy', abbreviation: 'IT'},
      {name: 'Latvia', abbreviation: 'LV'},
      {name: 'Lithuania', abbreviation: 'LT'},
      {name: 'Luxembourg', abbreviation: 'LU'},
      {name: 'Malta', abbreviation: 'MT'},
      {name: 'Netherlands', abbreviation: 'NL'},
      {name: 'Poland', abbreviation: 'PL'},
      {name: 'Portugal', abbreviation: 'PT'},
      {name: 'Romania', abbreviation: 'RO'},
      {name: 'Slovakia', abbreviation: 'SK'},
      {name: 'Slovenia', abbreviation: 'SI'},
      {name: 'Spain', abbreviation: 'ES'},
      {name: 'Sweden', abbreviation: 'SE'},
      {name: 'United Kingdom', abbreviation: 'GB'},
    ];

    const allowedCountries = [
      {name: 'CotedIvoire', abbreviation: 'CI'},
      {name: 'Gibraltar', abbreviation: 'GI'},
      {name: 'Hong Kong', abbreviation: 'HK'},
      {name: 'China', abbreviation: 'CN'},
      {name: 'Uganda', abbreviation: 'UG'},
      {name: 'Tunisia', abbreviation: 'TN'},
      {name: 'Trinidad And Tobago', abbreviation: 'TT'},
      {name: 'Tonga', abbreviation: 'TO'},
      {name: 'Tokelau', abbreviation: 'TK'},
      {name: 'Togo', abbreviation: 'TG'},
      {name: 'Timor Leste', abbreviation: 'TL'},
      {name: 'Sri Lanka', abbreviation: 'LK'},
    ];

    const testAllowedCountry = async (country) => {
      it('should be allowed to transfer from address from whitelist to receiver from ' + country.name + ' and NOT whitelisted address', async () => {
        const sender = accounts[2];
        const receiver = accounts[3];

        // await expectIsWhitelisted(sender, true);
        await expectIsWhitelisted(receiver, false);
        await expectKYC(receiver, KYCValue);
        await expectCountry(receiver, country.abbreviation);
        await assertIsTransferPossible(sender, receiver);
      });
    };

    const testBlockedCountry = async (country) => {
      it('should NOT be allowed to transfer from allowed address to receiver from ' + country.name, async () => {
        const sender = accounts[2];
        const receiver = accounts[3];

        // await expectIsWhitelisted(sender, true);
        await expectIsWhitelisted(receiver, false);
        await expectKYC(receiver, KYCValue);
        await expectCountry(receiver, country.abbreviation);
        await assertIsTransferNotPossible(sender, receiver);
      });
    };

    for (let i = 0; i < allowedCountries.length; i++) {
      testAllowedCountry(allowedCountries[i]);
    }

    for (let i = 0; i < raisonAiAllowedCountries.length; i++) {
      testAllowedCountry(raisonAiAllowedCountries[i]);
    }

    for (let i = 0; i < blockedCountries.length; i++) {
      testBlockedCountry(blockedCountries[i]);
    }

    for (let i = 0; i < blockedCountriesWithFutureAccreditation.length; i++) {
      testBlockedCountry(blockedCountriesWithFutureAccreditation[i]);
    }
  });

  describe('Regions', async () => {
    const blockedRegions = [
      {country: 'UA', name: 'Crimea'},
      {country: 'UA', name: 'Donetsk'},
      {country: 'UA', name: 'Luhansk'},
    ];

    it('should be allowed to transfer from address from whitelist to receiver from United Emirates with unknown region', async () => {
      const sender = accounts[2];
      const receiver = accounts[3];

      // await expectIsWhitelisted(sender, true);
      await expectIsWhitelisted(receiver, false);
      await expectKYC(receiver, KYCValue);
      await expectCountry(receiver, 'AE');
      // await expectRegion(receiver, '');
      await assertIsTransferPossible(sender, receiver);
    });

    it('should be allowed to transfer from address from whitelist to receiver from United Emirates with allowed region', async () => {
      const sender = accounts[2];
      const receiver = accounts[3];

      // await expectIsWhitelisted(sender, true);
      await expectIsWhitelisted(receiver, false);
      await expectKYC(receiver, KYCValue);
      await expectCountry(receiver, 'AE');
      // await expectRegion(receiver, 'Dubai');
      await assertIsTransferPossible(sender, receiver);
    });

    it('should be allowed to transfer from address from whitelist to receiver from Ukraine with unknown region', async () => {
      const sender = accounts[2];
      const receiver = accounts[3];

      // await expectIsWhitelisted(sender, true);
      await expectIsWhitelisted(receiver, false);
      await expectKYC(receiver, KYCValue);
      await expectCountry(receiver, 'UA');
      await expectRegion(receiver, '');
      await assertIsTransferPossible(sender, receiver);
    });

    it('should be allowed to transfer from address from whitelist to receiver from Ukraine with allowed region', async () => {
      const sender = accounts[2];
      const receiver = accounts[3];

      // await expectIsWhitelisted(sender, true);
      await expectIsWhitelisted(receiver, false);
      await expectKYC(receiver, KYCValue);
      await expectCountry(receiver, 'UA');
      await expectRegion(receiver, 'Kyiv');
      await assertIsTransferPossible(sender, receiver);
    });

    const testBlockedRegion = async (region) => {
      it('should NOT be allowed to transfer from allowed address to receiver from ' + region.name, async () => {
        const sender = accounts[2];
        const receiver = accounts[3];

        // await expectIsWhitelisted(sender, true);
        await expectIsWhitelisted(receiver, false);
        await expectKYC(receiver, KYCValue);
        await expectCountry(receiver, region.country);
        await expectRegion(receiver, region.name);
        await assertIsTransferNotPossible(sender, receiver);
      });
    };

    for (let i = 0; i < blockedRegions.length; i++) {
      testBlockedRegion(blockedRegions[i]);
    }
  });
});
