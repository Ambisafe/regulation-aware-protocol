pragma solidity 0.4.23;

import '../Ambi2EnabledFull.sol';
import './ComplianceProviderInterface.sol';

/**
 * @title ComplianceProvider
 *
 * This contract provides information about properties.
 * It is used in the ComplianceConfiguration contract
 * when it needs to check if an user has a property
 * or to get this property and use it.
 *
 * Property consist of
 * - address of whose this property
 * - property key which has bytes32 type. For example 'kyc' or 'country'.
 * - property value which is essence of property.
 * In case of key 'country' this is the name of the country.
 *
 * Only admin can set property and anyone can see it.
 */

contract ComplianceProvider is Ambi2EnabledFull, ComplianceProviderInterface {
    mapping(address => mapping(bytes32 => bytes32)) internal properties;

    event PropertySet(address addr, bytes32 propertyKey, bytes32 propertyValue);

    function setProperty(address _addr, bytes32 _propertyKey, bytes32 _propertyValue)
        public
        onlyRole('admin')
        returns(bool)
    {
        _setProperty(_addr, _propertyKey, _propertyValue);
        return true;
    }

    function setProperties(address[] _addresses, bytes32[] _keys, bytes32[] _values)
        public
        onlyRole('admin')
        returns(bool)
    {
        uint length = _addresses.length;
        require(length == _keys.length, 'Invalid input');
        require(length == _values.length, 'Invalid input');
        for (uint i = 0; i < length; i++) {
            _setProperty(_addresses[i], _keys[i], _values[i]);
        }
        return true;
    }

    function getProperty(address _addr, bytes32 _propertyKey) public view returns(bytes32) {
        return properties[_addr][_propertyKey];
    }

    function _setProperty(address _addr, bytes32 _propertyKey, bytes32 _propertyValue)
        internal
    {
        properties[_addr][_propertyKey] = _propertyValue;
        emit PropertySet(_addr, _propertyKey, _propertyValue);
    }
}
