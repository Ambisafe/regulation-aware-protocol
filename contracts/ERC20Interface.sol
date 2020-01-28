pragma solidity 0.4.23;


contract ERC20BasicInterface {
    event Transfer(address indexed from, address indexed to, uint256 value);

    function decimals() public view returns (uint8);
    function name() public view returns (string);
    function symbol() public view returns (string);
    function totalSupply() public view returns (uint256 supply);
    function balanceOf(address _owner) public view returns (uint256 balance);
    // solhint-disable-next-line no-simple-event-func-name
    function transfer(address _to, uint256 _value) public returns (bool success);
}


contract ERC20Interface is ERC20BasicInterface {
    event Approval(address indexed owner, address indexed spender, uint256 value);

    function transferFrom(address _from, address _to, uint256 _value) public returns (bool success);
    function approve(address _spender, uint256 _value) public returns (bool success);
    function allowance(address _owner, address _spender) public view returns (uint256 remaining);
}
