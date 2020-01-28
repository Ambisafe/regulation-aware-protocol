# Regulation Aware Protocol

## Operation mechanics

RAP tokens in general and USPX in particular works as follows:
When transfer happens, Token contract makes a call to the Compliance Configuration (CC) contract (which is dynamically changeable by Token Issuer), CC contract has a list of KYC/AML Data Providers (DP) contracts (which is also dynamically changeable by Token Issuer), so CC contract starts to poll DPs to get the information about the Sender and the Receiver, it continues to poll every next DP till the data is returned or the list of DPs is ended. If there is not enough information, than transfer is rejected, if there is enough information, then all the data go through a set of rules (e. g. only US accredited investors allowed to receive the token) specified in this CC which in the end decides if transfer should be allowed or not. DPs in turn are operated by a trusted (by Token Issuer) third-party that supplies information (e. g. nationality, KYC/AML level, etc.) about actors to it.

So in a nutshell, Token contract asks the permission from Compliance Configuration which is controlled by Token Issuer, so in the end, Token Issuer is accountable for the compliance of every token transfer.

### Installation

**NodeJS 6.x+ must be installed along with build-essential as a prerequisite.**
```
$ npm install
```

### Running blockchain (other terminal)
```
$ npm run testrpc
```

### Running tests

```
$ npm run compile
$ npm run test
```

### Running eslint and solhint code style validation
```
$ npm run validate
```
