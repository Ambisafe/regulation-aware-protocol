pragma solidity 0.4.23;


contract Ambi2 {
    function hasRole(address, bytes32, address) public view returns(bool);
    function claimFor(address, address) public returns(bool);
    function isOwner(address, address) public view returns(bool);
}


contract Ambi2Enabled {
    Ambi2 internal ambi2;

    modifier onlyRole(bytes32 _role) {
        if (address(ambi2) != 0x0 && ambi2.hasRole(this, _role, msg.sender)) {
            _;
        }
    }

    // Perform only after claiming the node, or claim in the same tx.
    function setupAmbi2(Ambi2 _ambi2) public returns(bool) {
        if (address(ambi2) != 0x0) {
            return false;
        }

        ambi2 = _ambi2;
        return true;
    }
}

/**
 * @title Ambi2EnabledFull
 *
 * This contract represents an Ambi2 node.
 * It allows to set role requirements for function calls.
 *
 * In order for the contract to function,
 * it needs to be setup first specifying the address of the Ambi2 contract.
 * Caller of the setup function will become an owner of the contract
 * if it is not owned yet in the specified Ambi2 contract.
 */

contract Ambi2EnabledFull is Ambi2Enabled {
    // Setup and claim atomically.
    function setupAmbi2(Ambi2 _ambi2) public returns(bool) {
        if (address(ambi2) != 0x0) {
            return false;
        }
        if (!_ambi2.claimFor(this, msg.sender) && !_ambi2.isOwner(this, msg.sender)) {
            return false;
        }

        ambi2 = _ambi2;
        return true;
    }
}
