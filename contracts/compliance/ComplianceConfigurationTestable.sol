pragma solidity 0.4.23;

import './ComplianceConfiguration.sol';


contract ComplianceConfigurationTestable is ComplianceConfiguration {

    constructor(
        StorageInterface _store,
        bytes32 _crate
    // solhint-disable-next-line no-empty-blocks
    ) public ComplianceConfiguration(_store, _crate) {}

    function isTransferAllowed(address, address, uint) public view returns(bool) {
        return true;
    }

    function isTransferToICAPAllowed(address, bytes32, uint) public view returns(bool) {
        return true;
    }
}