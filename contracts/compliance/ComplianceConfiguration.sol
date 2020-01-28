pragma solidity 0.4.23;

import '../Ambi2EnabledFull.sol';
import '../storage/StorageAdapter.sol';
import './Countries.sol';
import './Regions.sol';
import './ComplianceProviderInterface.sol';


contract ComplianceConfigurationInterface {
    function isTransferAllowed(address _from, address _to, uint _value)
        public view returns(bool);

    function isTransferToICAPAllowed(address _from, bytes32 _icap, uint _value)
        public view returns(bool);

    function processTransferResult(address _from, address _to, uint _value, bool _success)
        public;

    function processTransferToICAPResult(address _from, bytes32 _icap, uint _value, bool _success)
        public;
}


contract Asset {
    function proxy() public view returns(AssetProxy);
}


contract AssetProxy {
    function balanceOf(address) public view returns(uint);
}

/**
 * @title ComplianceConfiguration
 *
 * This contract provides verification of operations.
 *
 * Only admin can manage whitelist and set providers.
 * Provider is an object of ComplianceProvider and serves to get propertyValue
 * which may be information about country or about accreditation status etc.
 * This contract can check if some user has a property and what property is it.
 *
 * Verification function is internal, they should be used in an inheritor contract.
 */

contract ComplianceConfiguration is Ambi2EnabledFull, StorageAdapter,
ComplianceConfigurationInterface, Countries, Regions {

    StorageLib.AddressesSet internal providers;
    StorageLib.AddressBoolMapping internal whitelist;
    StorageLib.Bytes4BoolMapping internal whitelistICAP;

    event ProvidersUpdated(address[] currentProviders);
    event AddedToWhitelist(address addr);
    event RemovedFromWhitelist(address addr);
    event AddedToWhitelistICAPInstitution(bytes4 institution);
    event RemovedFromWhitelistICAPInstitution(bytes4 institution);

    constructor(
        StorageInterface _store,
        bytes32 _crate
    ) public StorageAdapter(_store, _crate) {
        providers.init('providers');
        whitelist.init('whitelist');
        whitelistICAP.init('whitelistICAP');
    }

    function setProviders(address[] _providers) public onlyRole('admin') returns(bool) {
        store.clear(providers);
        for (uint i = 0; i < _providers.length; i++) {
            store.insert(providers, _providers[i]);
        }
        emit ProvidersUpdated(_providers);
        return true;
    }

    function addToWhitelist(address _address)
        public
        onlyRole('addToWhitelist')
        returns(bool)
    {
        store.set(whitelist, _address, true);
        emit AddedToWhitelist(_address);
        return true;
    }

    function removeFromWhitelist(address _address)
        public
        onlyRole('removeFromWhitelist')
        returns(bool)
    {
        store.set(whitelist, _address, false);
        emit RemovedFromWhitelist(_address);
        return true;
    }

    function addToWhitelistICAPInstitution(bytes4 _institution)
        public
        onlyRole('addToWhitelistICAP')
        returns(bool)
    {
        store.set(whitelistICAP, _institution, true);
        emit AddedToWhitelistICAPInstitution(_institution);
        return true;
    }

    function removeFromWhitelistICAPInstitution(bytes4 _institution)
        public
        onlyRole('removeFromWhitelistICAP')
        returns(bool)
    {
        store.set(whitelistICAP, _institution, false);
        emit RemovedFromWhitelistICAPInstitution(_institution);
        return true;
    }

    function getProviders() public view returns(address[]) {
        return store.get(providers);
    }

    function getProvider(uint _index) public view returns(ComplianceProviderInterface) {
        return ComplianceProviderInterface(store.get(providers, _index));
    }

    function _getPropertyIf(
        address _addr,
        bytes32 _propertyKey,
        function (bytes32) internal view returns(bool) _condition
    ) internal view returns(bytes32) {
        uint providersCount = store.count(providers);
        for (uint i = 0; i < providersCount; i++) {
            bytes32 propertyValue = getProvider(i).getProperty(_addr, _propertyKey);
            if (_condition(propertyValue)) {
                return propertyValue;
            }
        }
        return bytes32(0);
    }

    function _hasPropertyIf(
        address _addr,
        bytes32 _propertyKey,
        function (bytes32) internal view returns(bool) _condition
    ) internal view returns(bool) {
        return _notNull(_getPropertyIf(_addr, _propertyKey, _condition));
    }

    function _getCountry(address _addr) internal view returns(bytes32) {
        return _getPropertyIf(_addr, 'country', _notNull);
    }

    function _getRegion(address _addr) internal view returns(bytes32) {
        return _getPropertyIf(_addr, 'region', _notNull);
    }

    function _isAccredited(address _addr) internal view returns(bool) {
        return _hasPropertyIf(_addr, 'accredited', _notNull);
    }

    function _notNull(bytes32 _value) internal view returns(bool) {
        return _value != bytes32(0);
    }

    function balanceOf(address _addr) public view returns(uint) {
        return Asset(msg.sender).proxy().balanceOf(_addr);
    }

    function isWhitelisted(address _addr) public view returns(bool) {
        return store.get(whitelist, _addr);
    }

    function isWhitelistedICAPInstitution(bytes4 _institution) public view returns(bool) {
        return store.get(whitelistICAP, _institution);
    }

    function isWhitelistedICAP(bytes32 _icap) public view returns(bool) {
        return isWhitelistedICAPInstitution(bytes4(_icap << (7*8)));
    }

    function isTransferAllowed(address, address, uint) public view returns(bool);

    function isTransferToICAPAllowed(address, bytes32, uint) public view returns(bool);

    // solhint-disable-next-line no-empty-blocks
    function processTransferResult(address, address, uint, bool) public {

    }

    // solhint-disable-next-line no-empty-blocks
    function processTransferToICAPResult(address, bytes32, uint, bool) public {

    }
}
