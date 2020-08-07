System Administrator
Assignment: by software engineer when deploying the token platform.
Permissions:
1. Issue new tokens assigning the Issuer to it.
Source code: https://github.com/Ambisafe/etoken2/blob/master/contracts/EToken2.sol

Issuer
Assignment: by System administrator when deploying the token.
Permissions:
1. Increase issued token supply.
2. Transfer Issuer role.
Source code: https://github.com/Ambisafe/etoken2/blob/master/contracts/EToken2.sol
3. Propose basic token rules change.
4. Cancel not commited basic token rules change.
5. Commit basic token rules change.
Source code: https://github.com/Ambisafe/etoken2/blob/master/contracts/AssetProxy.sol
6. Manage Token Administrator role.
7. Manage Token Legal role.
Source code: https://github.com/Ambisafe/etoken2/blob/master/contracts/AssetWithCompliance.sol

Token Administrator
Assignment: by Issuer after token deployment.
Permissions:
1. Change token regulation compliance configuration, which will decide if particular transfer should be allowed or not based on the sender/receiver Country, Region, KYC/Accreditaion status, and preset limits such as maximum number of holders from particular country, maximum holder share, etc.
Source code: https://github.com/Ambisafe/etoken2/blob/master/contracts/AssetWithCompliance.sol
2. Manage trusted KYC Data Providers.
3. Manage token Whitelist Administrator role.
Source code: https://github.com/Ambisafe/regulation-aware-protocol/blob/master/contracts/compliance/ComplianceConfiguration.sol

Token Legal
Assignment: by Issuer after token deployment.
Permissions:
1. Forced transfer of tokens from any holder to any other holder.
Source code: https://github.com/Ambisafe/etoken2/blob/master/contracts/AssetWithCompliance.sol

KYC Data Provider
Assignment: by Token Administrator after token deployment.
Permissions:
1. Manage KYC data about Ethereum addresses, such as Country, Region, KYC/Accreditation status, etc.
Source code: https://github.com/Ambisafe/regulation-aware-protocol/blob/master/contracts/compliance/ComplianceProvider.sol

Whitelist Administrator
Assignment: by Token Administrator after token deployment.
Permissions:
1. Manage technical addresses whitelist that should allow them to send/receive tokens without additional checks.
Source code: https://github.com/Ambisafe/regulation-aware-protocol/blob/master/contracts/compliance/ComplianceConfiguration.sol
