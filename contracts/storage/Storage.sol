pragma solidity 0.4.23;

import '../Ambi2EnabledFull.sol';

/**
 * @title Storage
 *
 * This contract can store arbitrary data, managed by a single entity.
 */

contract Storage is Ambi2EnabledFull {
    mapping(bytes32 => mapping(bytes32 => bytes32)) internal crateCells;
    mapping(bytes32 => mapping(bytes32 => bytes)) internal crateBytes;
    mapping(bytes32 => mapping(address => bool)) internal crateAccess;

    event LogCrateAccess(bytes32 crate, address to, bool granted);

    modifier onlyAllowed(bytes32 _crate) {
        require(hasAccess(_crate, msg.sender));
        _;
    }

    function _setAccess(bytes32 _crate, address _to, bool _allowed) internal {
        crateAccess[_crate][_to] = _allowed;
        emit LogCrateAccess(_crate, _to, _allowed);
    }

    function grantAccess(bytes32 _crate, address _to) public onlyRole('admin') returns(bool) {
        _setAccess(_crate, _to, true);
        return true;
    }

    function revokeAccess(bytes32 _crate, address _to) public onlyRole('admin') returns(bool) {
        _setAccess(_crate, _to, false);
        return true;
    }

    function hasAccess(bytes32 _crate, address _to) public view returns(bool) {
        return crateAccess[_crate][_to];
    }

    function set(bytes32 _crate, bytes32 _key, bytes32 _value) public onlyAllowed(_crate) {
        crateCells[_crate][_key] = _value;
    }

    function get(bytes32 _crate, bytes32 _key) public view returns(bytes32) {
        return crateCells[_crate][_key];
    }

    function setBytes(bytes32 _crate, bytes32 _key, bytes memory _bytes)
        public
        onlyAllowed(_crate)
    {
        crateBytes[_crate][_key] = _bytes;
    }

    function getBytes(bytes32 _crate, bytes32 _key) public view returns(bytes) {
        return crateBytes[_crate][_key];
    }
}
