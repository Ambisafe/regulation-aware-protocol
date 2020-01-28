pragma solidity 0.4.23;


interface ComplianceProviderInterface {
    function getProperty(address _addr, bytes32 _propertyKey) external view returns(bytes32);
}
