pragma solidity 0.4.23;


contract StorageInterface {
    function set(bytes32 _crate, bytes32 _key, bytes32 _value) public;
    function get(bytes32 _crate, bytes32 _key) public view returns(bytes32);
    function setBytes(bytes32 _crate, bytes32 _key, bytes memory _bytes) public;
    function getBytes(bytes32 _crate, bytes32 _key) public;
}


// Typesafe interface for remote Storage.
library StorageLib {
    struct Config {
        StorageInterface store;
        bytes32 crate;
    }

    struct UInt {
        bytes32 id;
    }

    struct UInt8 {
        bytes32 id;
    }

    struct Int {
        bytes32 id;
    }

    struct Address {
        bytes32 id;
    }

    struct Bool {
        bytes32 id;
    }

    struct Bytes32 {
        bytes32 id;
    }

    struct Bytes {
        bytes32 id;
    }

    struct String {
        Bytes innerBytes;
    }

    struct Mapping {
        bytes32 id;
    }

    struct AddressBoolMapping {
        Mapping innerMapping;
    }

    struct Bytes4BoolMapping {
        Mapping innerMapping;
    }

    struct UintAddressBoolMapping {
        Mapping innerMapping;
    }

    struct AddressBytes32Mapping {
        Mapping innerMapping;
    }

    struct AddressUIntMapping {
        Mapping innerMapping;
    }

    struct AddressUIntUInt8Mapping {
        Mapping innerMapping;
    }

    struct UIntUIntBoolMapping {
        Mapping innerMapping;
    }

    struct AddressBytes4BoolMapping {
        Mapping innerMapping;
    }

    struct AddressBytes4Bytes32Mapping {
        Mapping innerMapping;
    }

    struct AddressUIntUIntMapping {
        Mapping innerMapping;
    }

    struct AddressUIntUIntUIntMapping {
        Mapping innerMapping;
    }

    struct AddressAddressUIntMapping {
        Mapping innerMapping;
    }

    struct AddressAddressUInt8Mapping {
        Mapping innerMapping;
    }

    struct AddressBytes32Bytes32Mapping {
        Mapping innerMapping;
    }

    struct UIntAddressMapping {
        Mapping innerMapping;
    }

    struct UIntAddressAddressMapping {
        Mapping innerMapping;
    }

    struct UIntAddressUIntMapping {
        Mapping innerMapping;
    }

    struct UIntBoolMapping {
        Mapping innerMapping;
    }

    struct UIntUIntMapping {
        Mapping innerMapping;
    }

    struct UIntEnumMapping {
        Mapping innerMapping;
    }

    struct AddressUIntAddressUInt8Mapping {
        Mapping innerMapping;
    }

    struct AddressUIntUIntAddressUInt8Mapping {
        Mapping innerMapping;
    }

    struct AddressUIntUIntUIntAddressUInt8Mapping {
        Mapping innerMapping;
    }

    struct UIntBytes32Mapping {
        Mapping innerMapping;
    }

    struct UIntUIntBytes32Mapping {
        Mapping innerMapping;
    }

    struct UIntUIntUIntBytes32Mapping {
        Mapping innerMapping;
    }

    struct Set {
        UInt count;
        Mapping indexes;
        Mapping values;
    }

    struct AddressesSet {
        Set innerSet;
    }
    
    modifier sanityCheck(bytes32 _currentId, bytes32 _newId) {
        require(_currentId == 0 && _newId != 0);
        _;
    }

    function init(Config storage self, StorageInterface _store, bytes32 _crate) internal {
        assert(address(self.store) == 0);
        assert(self.crate == 0);
        assert(address(_store) != 0);
        assert(_crate != 0);
        self.store = _store;
        self.crate = _crate;
    }

    function init(UInt storage self, bytes32 _id) internal sanityCheck(self.id, _id) {
        self.id = _id;
    }

    function init(UInt8 storage self, bytes32 _id) internal sanityCheck(self.id, _id) {
        self.id = _id;
    }

    function init(Int storage self, bytes32 _id) internal sanityCheck(self.id, _id) {
        self.id = _id;
    }

    function init(Address storage self, bytes32 _id) internal sanityCheck(self.id, _id) {
        self.id = _id;
    }

    function init(Bool storage self, bytes32 _id) internal sanityCheck(self.id, _id) {
        self.id = _id;
    }

    function init(Bytes32 storage self, bytes32 _id) internal sanityCheck(self.id, _id) {
        self.id = _id;
    }

    function init(Bytes storage self, bytes32 _id) internal sanityCheck(self.id, _id) {
        self.id = _id;
    }

    function init(String storage self, bytes32 _id) internal {
        init(self.innerBytes, _id);
    }

    function init(Mapping storage self, bytes32 _id) internal sanityCheck(self.id, _id) {
        self.id = _id;
    }

    function init(AddressBoolMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(Bytes4BoolMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(UintAddressBoolMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(AddressBytes32Mapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(AddressUIntMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(AddressUIntUInt8Mapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(UIntUIntBoolMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(AddressBytes4BoolMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(AddressBytes4Bytes32Mapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(AddressUIntUIntMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(AddressUIntUIntUIntMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(AddressAddressUIntMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(AddressAddressUInt8Mapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(AddressBytes32Bytes32Mapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(UIntBytes32Mapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(UIntAddressMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(UIntAddressAddressMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(UIntAddressUIntMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(UIntBoolMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(UIntUIntMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(UIntEnumMapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(AddressUIntAddressUInt8Mapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(AddressUIntUIntAddressUInt8Mapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(AddressUIntUIntUIntAddressUInt8Mapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(UIntUIntBytes32Mapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(UIntUIntUIntBytes32Mapping storage self, bytes32 _id) internal {
        init(self.innerMapping, _id);
    }

    function init(Set storage self, bytes32 _id) internal {
        init(self.count, keccak256(_id, 'count'));
        init(self.indexes, keccak256(_id, 'indexes'));
        init(self.values, keccak256(_id, 'values'));
    }

    function init(AddressesSet storage self, bytes32 _id) internal {
        init(self.innerSet, _id);
    }

    function set(Config storage self, bytes32 _id, bytes32 _value) internal {
        self.store.set(self.crate, _id, _value);
    }

    function set(Config storage self, UInt storage _item, uint _value) internal {
        set(self, _item.id, bytes32(_value));
    }

    function set(Config storage self, UInt8 storage _item, uint8 _value) internal {
        set(self, _item.id, bytes32(_value));
    }

    function set(Config storage self, Int storage _item, int _value) internal {
        set(self, _item.id, bytes32(_value));
    }

    function set(Config storage self, Address storage _item, address _value) internal {
        set(self, _item.id, bytes32(_value));
    }

    function set(Config storage self, Bool storage _item, bool _value) internal {
        set(self, _item.id, toBytes32(_value));
    }

    function set(Config storage self, Bytes32 storage _item, bytes32 _value) internal {
        set(self, _item.id, _value);
    }

    function set(Config storage self, Bytes storage _item, bytes memory _value) internal {
        self.store.setBytes(self.crate, _item.id, _value);
    }

    function set(Config storage self, String storage _item, string memory _value) internal {
        set(self, _item.innerBytes, bytes(_value));
    }

    function set(Config storage self, Mapping storage _item, bytes32 _key, bytes32 _value)
        internal
    {
        set(self, keccak256(_item.id, _key), _value);
    }

    function set(
        Config storage self,
        Mapping storage _item,
        bytes32 _key,
        bytes32 _key2,
        bytes32 _value
    ) internal {
        set(self, keccak256(_item.id, _key, _key2), _value);
    }

    function set(
        Config storage self,
        Mapping storage _item,
        bytes32 _key,
        bytes32 _key2,
        bytes32 _key3,
        bytes32 _value
    ) internal {
        set(self, keccak256(_item.id, _key, _key2, _key3), _value);
    }

    function set(
        Config storage self,
        AddressBoolMapping storage _item,
        address _key,
        bool _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), toBytes32(_value));
    }

    function set(
        Config storage self,
        Bytes4BoolMapping storage _item,
        bytes4 _key,
        bool _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), toBytes32(_value));
    }

    function set(
        Config storage self,
        UintAddressBoolMapping storage _item,
        uint _key,
        address _key2,
        bool _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_key2), toBytes32(_value));
    }

    function set(
        Config storage self,
        AddressBytes32Mapping storage _item,
        address _key,
        bytes32 _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), _value);
    }

    function set(
        Config storage self,
        AddressUIntMapping storage _item,
        address _key,
        uint _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_value));
    }

    function set(
        Config storage self,
        AddressUIntUInt8Mapping storage _item,
        address _key,
        uint _key2,
        uint8 _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_key2), bytes32(_value));
    }

    function set(
        Config storage self,
        UIntUIntBoolMapping storage _item,
        uint _key,
        uint _key2,
        bool _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_key2), toBytes32(_value));
    }

    function set(
        Config storage self,
        AddressBytes4BoolMapping storage _item,
        address _key,
        bytes4 _key2,
        bool _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_key2), toBytes32(_value));
    }

    function set(
        Config storage self,
        AddressBytes4Bytes32Mapping storage _item,
        address _key,
        bytes4 _key2,
        bytes32 _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_key2), _value);
    }

    function set(
        Config storage self,
        AddressUIntUIntMapping storage _item,
        address _key,
        uint _key2,
        uint _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_key2), bytes32(_value));
    }

    function set(
    Config storage self,
        AddressUIntUIntUIntMapping storage _item,
        address _key,
        uint _key2,
        uint _key3,
        uint _value
    ) internal {
        set(
            self,
            _item.innerMapping,
            bytes32(_key),
            bytes32(_key2),
            bytes32(_key3),
            bytes32(_value)
        );
    }

    function set(
        Config storage self,
        AddressAddressUIntMapping storage _item,
        address _key,
        address _key2,
        uint _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_key2), bytes32(_value));
    }

    function set(
        Config storage self,
        AddressAddressUInt8Mapping storage _item,
        address _key,
        address _key2,
        uint8 _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_key2), bytes32(_value));
    }

    function set(
        Config storage self,
        AddressBytes32Bytes32Mapping storage _item,
        address _key,
        bytes32 _key2,
        bytes32 _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), _key2, _value);
    }

    function set(
        Config storage self,
        UIntBytes32Mapping storage _item,
        uint _key,
        bytes32 _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), _value);
    }

    function set(
        Config storage self,
        UIntAddressMapping storage _item,
        uint _key,
        address _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_value));
    }

    function set(
        Config storage self,
        UIntBoolMapping storage _item,
        uint _key,
        bool _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), toBytes32(_value));
    }

    function set(
        Config storage self,
        UIntAddressAddressMapping storage _item,
        uint _key,
        address _key2,
        address _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_key2), bytes32(_value));
    }

    function set(
        Config storage self,
        UIntAddressUIntMapping storage _item,
        uint _key,
        address _key2,
        uint _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_key2), bytes32(_value));
    }

    function set(
        Config storage self,
        UIntUIntMapping storage _item,
        uint _key,
        uint _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_value));
    }

    function set(
        Config storage self,
        UIntEnumMapping storage _item,
        uint _key,
        uint8 _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_value));
    }

    function set(
        Config storage self,
        AddressUIntAddressUInt8Mapping storage _item,
        address _key,
        uint _key2,
        address _key3,
        uint8 _value
    ) internal {
        set(self, _item.innerMapping, keccak256(_key, _key2, _key3), bytes32(_value));
    }

    function set(
    Config storage self,
        AddressUIntUIntAddressUInt8Mapping storage _item,
        address _key,
        uint _key2,
        uint _key3,
        address _key4,
        uint8 _value
    ) internal {
        set(self, _item.innerMapping, keccak256(_key, _key2, _key3, _key4), bytes32(_value));
    }

    function set(
        Config storage self,
        AddressUIntUIntUIntAddressUInt8Mapping storage _item,
        address _key,
        uint _key2,
        uint _key3,
        uint _key4,
        address _key5,
        uint8 _value
    ) internal {
        set(self, _item.innerMapping, keccak256(_key, _key2, _key3, _key4, _key5), bytes32(_value));
    }

    function set(
        Config storage self,
        UIntUIntBytes32Mapping storage _item,
        uint _key,
        uint _key2,
        bytes32 _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_key2), _value);
    }

    function set(
        Config storage self,
        UIntUIntUIntBytes32Mapping storage _item,
        uint _key,
        uint _key2,
        uint _key3,
        bytes32 _value
    ) internal {
        set(self, _item.innerMapping, bytes32(_key), bytes32(_key2), bytes32(_key3), _value);
    }

    function insert(Config storage self, Set storage _item, bytes32 _value) internal {
        if (includes(self, _item, _value)) {
            return;
        }
        uint newCount = count(self, _item) + 1;
        set(self, _item.values, bytes32(newCount), _value);
        set(self, _item.indexes, _value, bytes32(newCount));
        set(self, _item.count, newCount);
    }

    function insert(Config storage self, AddressesSet storage _item, address _value) internal {
        insert(self, _item.innerSet, bytes32(_value));
    }

    function remove(Config storage self, Set storage _item, bytes32 _value) internal {
        if (!includes(self, _item, _value)) {
            return;
        }
        uint lastIndex = count(self, _item);
        bytes32 lastValue = get(self, _item.values, bytes32(lastIndex));
        uint index = uint(get(self, _item.indexes, _value));
        if (index < lastIndex) {
            set(self, _item.indexes, lastValue, bytes32(index));
            set(self, _item.values, bytes32(index), lastValue);
        }
        set(self, _item.indexes, _value, bytes32(0));
        set(self, _item.values, bytes32(lastIndex), bytes32(0));
        set(self, _item.count, lastIndex - 1);
    }

    function remove(Config storage self, AddressesSet storage _item, address _value) internal {
        remove(self, _item.innerSet, bytes32(_value));
    }

    function clear(Config storage self, Set storage _item) internal {
        uint _itemsCount = count(self, _item);
        if (_itemsCount == 0) {
            return;
        }
        for (uint i = 1; i <= _itemsCount; i++) {
            set(self, _item.indexes, get(self, _item.values, bytes32(i)), bytes32(0));
            set(self, _item.values, bytes32(i), bytes32(0));
        }
        set(self, _item.count, 0);
    }

    function clear(Config storage self, AddressesSet storage _item) internal {
        clear(self, _item.innerSet);
    }

    function get(Config storage self, bytes32 _id) internal view returns(bytes32) {
        return self.store.get(self.crate, _id);
    }

    function get(Config storage self, UInt storage _item) internal view returns(uint) {
        return uint(get(self, _item.id));
    }

    function get(Config storage self, UInt8 storage _item) internal view returns(uint8) {
        return uint8(get(self, _item.id));
    }

    function get(Config storage self, Int storage _item) internal view returns(int) {
        return int(get(self, _item.id));
    }

    function get(Config storage self, Address storage _item) internal view returns(address) {
        return address(get(self, _item.id));
    }

    function get(Config storage self, Bool storage _item) internal view returns(bool) {
        return toBool(get(self, _item.id));
    }

    function get(Config storage self, Bytes32 storage _item) internal view returns(bytes32) {
        return get(self, _item.id);
    }

    function get(Config storage self, Bytes _item) internal returns(bytes) {
        self.store.getBytes(self.crate, _item.id);
        return getBytes();
    }

    function get(Config storage self, String _item) internal returns(string) {
        return string(get(self, _item.innerBytes));
    }

    function get(
        Config storage self,
        Mapping storage _item,
        bytes32 _key
    ) internal view returns(bytes32) {
        return get(self, keccak256(_item.id, _key));
    }

    function get(
        Config storage self,
        Mapping storage _item,
        bytes32 _key,
        bytes32 _key2
    ) internal view returns(bytes32) {
        return get(self, keccak256(_item.id, _key, _key2));
    }

    function get(
        Config storage self,
        Mapping storage _item,
        bytes32 _key,
        bytes32 _key2,
        bytes32 _key3
    ) internal view returns(bytes32) {
        return get(self, keccak256(_item.id, _key, _key2, _key3));
    }

    function get(
        Config storage self,
        AddressBoolMapping storage _item,
        address _key
    ) internal view returns(bool) {
        return toBool(get(self, _item.innerMapping, bytes32(_key)));
    }

    function get(
        Config storage self,
        Bytes4BoolMapping storage _item,
        bytes4 _key
    ) internal view returns(bool) {
        return toBool(get(self, _item.innerMapping, bytes32(_key)));
    }

    function get(
        Config storage self,
        UintAddressBoolMapping storage _item,
        uint _key,
        address _key2
    ) internal view returns(bool) {
        return toBool(get(self, _item.innerMapping, bytes32(_key), bytes32(_key2)));
    }

    function get(
        Config storage self,
        AddressBytes32Mapping storage _item,
        address _key
    ) internal view returns(bytes32) {
        return get(self, _item.innerMapping, bytes32(_key));
    }

    function get(
        Config storage self,
        AddressUIntMapping storage _item,
        address _key
    ) internal view returns(uint) {
        return uint(get(self, _item.innerMapping, bytes32(_key)));
    }

    function get(
        Config storage self,
        AddressUIntUInt8Mapping storage _item,
        address _key,
        uint _key2
    ) internal view returns(uint) {
        return uint8(get(self, _item.innerMapping, bytes32(_key), bytes32(_key2)));
    }

    function get(
        Config storage self,
        UIntUIntBoolMapping storage _item,
        uint _key,
        uint _key2
    ) internal view returns(bool) {
        return toBool(get(self, _item.innerMapping, bytes32(_key), bytes32(_key2)));
    }

    function get(
        Config storage self,
        AddressBytes4BoolMapping storage _item,
        address _key,
        bytes4 _key2
    ) internal view returns(bool) {
        return toBool(get(self, _item.innerMapping, bytes32(_key), bytes32(_key2)));
    }

    function get(
        Config storage self,
        AddressBytes4Bytes32Mapping storage _item,
        address _key,
        bytes4 _key2
    ) internal view returns(bytes32) {
        return get(self, _item.innerMapping, bytes32(_key), bytes32(_key2));
    }

    function get(
        Config storage self,
        AddressUIntUIntMapping storage _item,
        address _key,
        uint _key2
    ) internal view returns(uint) {
        return uint(get(self, _item.innerMapping, bytes32(_key), bytes32(_key2)));
    }

    function get(
        Config storage self,
        AddressUIntUIntUIntMapping storage _item,
        address _key,
        uint _key2,
        uint _key3
    ) internal view returns(uint) {
        return uint(get(self, _item.innerMapping, bytes32(_key), bytes32(_key2), bytes32(_key3)));
    }

    function get(
        Config storage self,
        AddressAddressUIntMapping storage _item,
        address _key,
        address _key2
    ) internal view returns(uint) {
        return uint(get(self, _item.innerMapping, bytes32(_key), bytes32(_key2)));
    }

    function get(
        Config storage self,
        AddressAddressUInt8Mapping storage _item,
        address _key,
        address _key2
    ) internal view returns(uint8) {
        return uint8(get(self, _item.innerMapping, bytes32(_key), bytes32(_key2)));
    }

    function get(
        Config storage self,
        AddressBytes32Bytes32Mapping storage _item,
        address _key,
        bytes32 _key2
    ) internal view returns(bytes32) {
        return get(self, _item.innerMapping, bytes32(_key), _key2);
    }

    function get(
        Config storage self,
        UIntBytes32Mapping storage _item,
        uint _key
    ) internal view returns(bytes32) {
        return get(self, _item.innerMapping, bytes32(_key));
    }

    function get(
        Config storage self,
        UIntAddressMapping storage _item,
        uint _key
    ) internal view returns(address) {
        return address(get(self, _item.innerMapping, bytes32(_key)));
    }

    function get(
        Config storage self,
        UIntBoolMapping storage _item,
        uint _key
    ) internal view returns(bool) {
        return toBool(get(self, _item.innerMapping, bytes32(_key)));
    }

    function get(
        Config storage self,
        UIntAddressAddressMapping storage _item,
        uint _key,
        address _key2
    ) internal view returns(address) {
        return address(get(self, _item.innerMapping, bytes32(_key), bytes32(_key2)));
    }

    function get(
        Config storage self,
        UIntAddressUIntMapping storage _item,
        uint _key,
        address _key2
    ) internal view returns(uint) {
        return uint(get(self, _item.innerMapping, bytes32(_key), bytes32(_key2)));
    }

    function get(
        Config storage self,
        UIntUIntMapping storage _item,
        uint _key
    ) internal view returns(uint) {
        return uint(get(self, _item.innerMapping, bytes32(_key)));
    }

    function get(
        Config storage self,
        UIntEnumMapping storage _item,
        uint _key
    ) internal view returns(uint8) {
        return uint8(get(self, _item.innerMapping, bytes32(_key)));
    }

    function get(
        Config storage self,
        AddressUIntAddressUInt8Mapping storage _item,
        address _key,
        uint _key2,
        address _key3
    ) internal view returns(uint8) {
        return uint8(get(self, _item.innerMapping, keccak256(_key, _key2, _key3)));
    }

    function get(
        Config storage self,
        AddressUIntUIntAddressUInt8Mapping storage _item,
        address _key,
        uint _key2,
        uint _key3,
        address _key4
    ) internal view returns(uint8) {
        return uint8(get(self, _item.innerMapping, keccak256(_key, _key2, _key3, _key4)));
    }

    function get(
        Config storage self,
        AddressUIntUIntUIntAddressUInt8Mapping storage _item,
        address _key,
        uint _key2,
        uint _key3,
        uint _key4,
        address _key5
    ) internal view returns(uint8) {
        return uint8(get(self, _item.innerMapping, keccak256(_key, _key2, _key3, _key4, _key5)));
    }

    function get(
        Config storage self,
        UIntUIntBytes32Mapping storage _item,
        uint _key,
        uint _key2
    ) internal view returns(bytes32) {
        return get(self, _item.innerMapping, bytes32(_key), bytes32(_key2));
    }

    function get(
        Config storage self,
        UIntUIntUIntBytes32Mapping storage _item,
        uint _key,
        uint _key2,
        uint _key3
    ) internal view returns(bytes32) {
        return get(self, _item.innerMapping, bytes32(_key), bytes32(_key2), bytes32(_key3));
    }

    function includes(
        Config storage self,
        Set storage _item,
        bytes32 _value
    ) internal view returns(bool) {
        return get(self, _item.indexes, _value) != 0;
    }

    function includes(
        Config storage self,
        AddressesSet storage _item,
        address _value
    ) internal view returns(bool) {
        return includes(self, _item.innerSet, bytes32(_value));
    }

    function count(
        Config storage self,
        Set storage _item
    ) internal view returns(uint) {
        return get(self, _item.count);
    }

    function count(
        Config storage self,
        AddressesSet storage _item
    ) internal view returns(uint) {
        return count(self, _item.innerSet);
    }

    function get(Config storage self, Set storage _item) internal view returns(bytes32[]) {
        uint valuesCount = count(self, _item);
        bytes32[] memory result = new bytes32[](valuesCount);
        for (uint i = 0; i < valuesCount; i++) {
            result[i] = get(self, _item, i);
        }
        return result;
    }

    function get(Config storage self, AddressesSet storage _item)
        internal
        view
        returns(address[])
    {
        return toAddresses(get(self, _item.innerSet));
    }

    function get(Config storage self, Set storage _item, uint _index)
        internal
        view
        returns(bytes32)
    {
        assert(count(self, _item) > _index);
        return get(self, _item.values, bytes32(_index+1));
    }

    function get(Config storage self, AddressesSet storage _item, uint _index)
        internal
        view
        returns(address)
    {
        return address(get(self, _item.innerSet, _index));
    }

    function toBool(bytes32 self) public pure returns(bool) {
        return self != bytes32(0);
    }

    function toBytes32(bool self) public pure returns(bytes32) {
        return bytes32(self ? 1 : 0);
    }

    function toAddresses(bytes32[] memory self) public pure returns(address[]) {
        address[] memory result = new address[](self.length);
        for (uint i = 0; i < self.length; i++) {
            result[i] = address(self[i]);
        }
        return result;
    }

    // When call returns bytes/string the data looks like this:
    // 32 bytes length of the position of the data start
    // 32 bytes length of the data
    // data
    function getBytes() public pure returns(bytes) {
        uint returnDataSize;
        assembly {
            // Get the size of actual data, without length prefixes
            returnDataSize := sub(returndatasize, 64)
        }
        // Allocate memory for the actual data
        // Memory starting at result pointer will look like this:
        // 32 bytes length of the data
        // data
        bytes memory result = new bytes(returnDataSize);
        assembly {
            // Copy data skipping the length of the length prefix
            // in memory starting at the result pointer
            returndatacopy(result, 32, sub(returndatasize, 32))
        }
        return result;
    }
}
