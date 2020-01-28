pragma solidity 0.4.23;

import './ReturnData.sol';

/**
 * @title Mock
 *
 * This contract serves to simplify contract testing.
 *
 * When some contract makes call to another contract
 * and it's no need to check does the other contract works right
 * this contract allows to simulate an external call and to set what this call will return
 * and it allows to test a functionality only the first one contract.
 */

contract Mock is ReturnData {
    byte constant public REVERT_FLAG = 0xff;

    event UnexpectedCall(uint index, address from, uint value, bytes input, bytes32 callHash);

    struct Expect {
        bytes32 callHash;
        bytes callReturn;
    }

    uint public expectationsCount;
    uint public nextExpectation = 1;
    uint public callsCount;
    mapping(uint => Expect) public expectations;
    mapping(bytes4 => bool) public ignores;
    mapping(address => mapping(bytes4 => bool)) public ignoresFrom;
    mapping(address => bool) public ignoresAllFrom;
    bool public revertAllCalls;

    function () public payable {
        if (revertAllCalls) {
            revert('This is Mock');
        }
        if (msg.data.length == 1 && msg.data[0] == REVERT_FLAG) {
            revert('This is Mock');
        }
        if (ignores[msg.sig] || ignoresAllFrom[msg.sender] || ignoresFrom[msg.sender][msg.sig]) {
            returnBool(true);
        }
        callsCount++;
        bytes32 callHash = keccak256(msg.sender, msg.value, msg.data);
        if (expectations[nextExpectation].callHash != callHash) {
            emit UnexpectedCall(nextExpectation, msg.sender, msg.value, msg.data, callHash);
            returnBool(false);
        }
        returnBytes(expectations[nextExpectation++].callReturn);
    }

    function ignore(bytes4 _sig, bool _enabled) public {
        ignores[_sig] = _enabled;
    }

    function ignoreFrom(address _from, bytes4 _sig, bool _enabled) public {
        ignoresFrom[_from][_sig] = _enabled;
    }

    function ignoreAllFrom(address _from, bool _enabled) public {
        ignoresAllFrom[_from] = _enabled;
    }

    function setRevertAllCalls(bool _enabled) public {
        revertAllCalls = _enabled;
    }

    function expect(address _from, uint _value, bytes _input, bytes _return) public {
        expectations[++expectationsCount] = Expect(keccak256(_from, _value, _input), _return);
    }

    function forward(address _to, bytes _input) public payable {
        _returnReturnData(_assemblyCall(_to, msg.value, _input));
    }

    function assertExpectations() public view {
        require(expectationsLeft() == 0 && callsCount == expectationsCount);
    }

    function expectationsLeft() public view returns(uint) {
        return expectationsCount - (nextExpectation - 1);
    }

    function resetCallsCount() public returns(bool) {
        callsCount = 0;
    }

    function returnBool(bool _result) public pure returns(bool) {
        uint result = _result ? 1 : 0;
        assembly {
            mstore(0, result)
            return(0, 32)
        }
    }

    function returnBytes(bytes memory _result) public pure returns(bytes) {
        assembly {
            return(add(_result, 32), mload(_result))
        }
    }
}
