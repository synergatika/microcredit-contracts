# Funding Contract

[![Build Status](https://travis-ci.org/synergatika/microcredit-contracts.svg?branch=master)](https://travis-ci.org/synergatika/microcredit-contracts)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://www.gnu.org/licenses/gpl-3.0)

## Getting started

### Development steps

```
# Install package
$ npm install

# Start the Ethereum emulator
$ npx ganache-cli --gasPrice 0 -l 100000000 -m "candy maple cake sugar pudding cream honey rich smooth crumble sweet treat"

# Then open a new terminal, first run the contracts migrations
$ px truffle migrate

# Last, run all the tests
$ npx truffle test
```

### Go to production 

```

# Update your settings on truffle-config.js according your prouduction enviroment. e.g., mine was: 
# 
#    production: {
#      host: "localhost",
#      port: 22000, // was 8545
#      network_id: "*", // Match any network id
#      gasPrice: 0,
#      // gas: 10000000,
#      type: "quorum" // needed for Truffle to support Quorum
#    }

$ npx truffle migrate --network production

# Now, you can run tests into the production

$ npx truffle test --network production
```


## Contract Interface

### Model

The description of every structure is used by the Microcredit Contract.

**Project ()** 

| Type    | Name            |
| ------- | --------------- |
| address | memberAddress   |
| uint    | points          |
| bool    | isRegistered    |

## Contributing
Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

Please make sure to update tests as appropriate.

## License
[GPLv3](https://choosealicense.com/licenses/gpl-3.0/)

This application is part of a project that has received funding from the European Union’s Horizon 2020 research and innovation programme under grant agreement No 825268”.
