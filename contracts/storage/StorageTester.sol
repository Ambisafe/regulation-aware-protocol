pragma solidity 0.4.23;

import './StorageAdapter.sol';


contract StorageTester is StorageAdapter {
    StorageLib.UInt internal uintVar;
    StorageLib.Int internal intVar;
    StorageLib.Address internal addressVar;
    StorageLib.Bool internal boolVar;
    StorageLib.Bytes32 internal bytes32Var;
    StorageLib.Mapping internal mappingVar;
    StorageLib.AddressUIntMapping internal addressUIntMappingVar;
    StorageLib.Set internal setVar;
    StorageLib.AddressesSet internal addressesSetVar;

    constructor(StorageInterface _store, bytes32 _crate)
        public
        StorageAdapter(_store, _crate)
    // solhint-disable-next-line bracket-align
    {
        reinit();
    }

    function reinit() public {
        uintVar.init('uintVar');
        intVar.init('intVar');
        addressVar.init('addressVar');
        boolVar.init('boolVar');
        bytes32Var.init('bytes32Var');
        mappingVar.init('mappingVar');
        addressUIntMappingVar.init('addressUIntMappingVar');
        setVar.init('setVar');
        addressesSetVar.init('addressesSetVar');
    }

    function setUInt(uint _value) public {
        store.set(uintVar, _value);
    }

    function getUInt() public view returns(uint) {
        return store.get(uintVar);
    }

    function setInt(int _value) public {
        store.set(intVar, _value);
    }

    function getInt() public view returns(int) {
        return store.get(intVar);
    }

    function setAddress(address _value) public {
        store.set(addressVar, _value);
    }

    function getAddress() public view returns(address) {
        return store.get(addressVar);
    }

    function setBool(bool _value) public {
        store.set(boolVar, _value);
    }

    function getBool()public view returns(bool) {
        return store.get(boolVar);
    }

    function setBytes32(bytes32 _value) public {
        store.set(bytes32Var, _value);
    }

    function getBytes32() public view returns(bytes32) {
        return store.get(bytes32Var);
    }

    function setMapping(bytes32 _key, bytes32 _value) public {
        store.set(mappingVar, _key, _value);
    }

    function getMapping(bytes32 _key) public view returns(bytes32) {
        return store.get(mappingVar, _key);
    }

    function setAddressUIntMapping(address _key, uint _value) public {
        store.set(addressUIntMappingVar, _key, _value);
    }

    function getAddressUIntMapping(address _key) public view returns(uint) {
        return store.get(addressUIntMappingVar, _key);
    }

    function addSet(bytes32 _value) public {
        store.insert(setVar, _value);
    }

    function removeSet(bytes32 _value) public {
        store.remove(setVar, _value);
    }

    function includesSet(bytes32 _value) public view returns(bool) {
        return store.includes(setVar, _value);
    }

    function countSet() public view returns(uint) {
        return store.count(setVar);
    }

    function getSet() public view returns(bytes32[]) {
        return store.get(setVar);
    }

    function addAddressesSet(address _value) public {
        store.insert(addressesSetVar, _value);
    }

    function removeAddressesSet(address _value) public {
        store.remove(addressesSetVar, _value);
    }

    function includesAddressesSet(address _value) public view returns(bool) {
        return store.includes(addressesSetVar, _value);
    }

    function countAddressesSet() public view returns(uint) {
        return store.count(addressesSetVar);
    }

    function getAddressesSet() public view returns(address[]) {
        return store.get(addressesSetVar);
    }
}
