pragma solidity 0.4.23;

import './StorageLib.sol';


contract StorageAdapter {
    using StorageLib for *;

    StorageLib.Config internal store;

    constructor(StorageInterface _store, bytes32 _crate) public {
        store.init(_store, _crate);
    }
}
