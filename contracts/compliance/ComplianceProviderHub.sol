pragma solidity 0.4.23;

import '../Ambi2EnabledFull.sol';
import './ComplianceProviderInterface.sol';

/**
 * @title ComplianceProviderHub
 *
 * This contract acts as a compliance provider but under the hood
 * maintains a list of simple compliance providers to pull info from.
 *
 * Only admin can update the list of providers and anyone can see it.
 */

contract ComplianceProviderHub is Ambi2EnabledFull, ComplianceProviderInterface {
    address[] public providers;

    event ProvidersUpdated(address[] providers);

    function setProviders(address[] memory _providers)
        public
        onlyRole('admin')
        returns(bool)
    {
        providers = _providers;
        emit ProvidersUpdated(_providers);
        return true;
    }

    function getProviders() public view returns(address[] memory) {
        return providers;
    }

    function getProperty(address _addr, bytes32 _propertyKey) public view returns(bytes32) {
        for (uint i = 0; i < providers.length; i++) {
            bytes32 value = ComplianceProviderInterface(providers[i])
                .getProperty(_addr, _propertyKey);
            if (value != 0) {
                return value;
            }
        }
        return 0;
    }
}
