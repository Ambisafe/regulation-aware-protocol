pragma solidity 0.4.23;

import './ComplianceConfiguration.sol';

/**
 * @title ComplianceConfigurationUSpaceX
 *
 * This contract provides verification of operations for Orderbook SpaceX transfers.
 *
 * User can be a receiver under certain conditions:
 * - user in the whitelist
 * - user has reached KYC level
 * - country of user isn't in the 'blacklist'
 * - user is accredited.
 *
 */

contract ComplianceConfigurationUnicornSpaceX is ComplianceConfiguration {

    constructor(StorageInterface _store) public
        // solhint-disable-next-line no-empty-blocks
        ComplianceConfiguration(_store, 'ComplianceConfigurationUSpaceX') {}

    function isTransferAllowed(address, address _to, uint) public view returns(bool) {
        if (!isWhitelisted(_to) &&
            !isEligibleReceiver(_to)) {
            return false;
        }

        return true;
    }

    function isEligibleReceiver(address _addr) public view returns(bool) {
        if (!_isKYCLevelReached(_addr)) {
            return false;
        }

        bytes32 country = _getCountry(_addr);
        if (country == Unknown) {
            return false;
        }
        if (country == Afghanistan ||
            country == Burundi ||
            country == Albania ||
            country == Kosovo ||
            country == CentralAfricanRepublic ||
            country == CongoBrazzaville ||
            country == CongoKinshasa ||
            country == Cuba ||
            country == Cyprus ||
            country == Eritrea ||
            country == IranIslamicRepublicOf ||
            country == Iraq ||
            country == Lebanon ||
            country == Liberia ||
            country == Libya ||
            country == MacaoSARChina ||
            country == Myanmar ||
            country == KoreaNorth ||
            country == Sudan ||
            country == SyrianArabRepublicSyria ||
            country == Somalia ||
            country == VenezuelaBolivarianRepublic ||
            country == Yemen ||
            country == Zimbabwe
        ) {
            return false;
        }

        if (country == Ukraine) {
            bytes32 region = _getRegion(_addr);

            if (region == Crimea ||
                region == Donetsk ||
                region == Luhansk
            ) {
                return false;
            }
        }

        if (country == Switzerland ||
            country == Japan ||
            country == Singapore ||
            country == UnitedStatesOfAmerica
        ) {
            return false;
        }

        return true;
    }

    function _isKYCLevelReached(address _addr) internal view returns(bool) {
        return _hasPropertyIf(_addr, 'kyc', _greaterThanOrEqualToFive);
    }

    function _greaterThanOrEqualToFive(bytes32 _value) internal view returns(bool) {
        return uint(_value) >= 5;
    }

    function isTransferToICAPAllowed(address, bytes32 _icap, uint) public view returns(bool) {
        if (!isWhitelistedICAP(_icap)) {
            return false;
        }

        return true;
    }
}
