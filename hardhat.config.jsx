require('@nomiclabs/hardhat-waffle');

module.export = {
  solidity: '0.8.0',
  networks: {
    rinkeby: {
      url: 'YOUR ALCHEMY_API_URL',
      accounts: ['YOUR_PRIVATE_RINKEBY_ACCOUNT_KEY'],
    },
  },
};