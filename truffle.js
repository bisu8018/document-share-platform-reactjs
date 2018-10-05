/*
 * NB: since truffle-hdwallet-provider 0.0.5 you must wrap HDWallet providers in a
 * function when declaring them. Failure to do so will cause commands to hang. ex:
 * ```
 * mainnet: {
 *     provider: function() {
 *       return new HDWalletProvider(mnemonic, 'https://mainnet.infura.io/<infura-key>')
 *     },
 *     network_id: '1',
 *     gas: 4500000,
 *     gasPrice: 10000000000,
 *   },
 */
var HDWalletProvider = require("truffle-hdwallet-provider");

 module.exports = {
   networks: {
     development: {
       host: "localhost",
       port: 8545,
       network_id: "*" // Match any network id
     },
     rinkeby: {
       provider: function() {
         return new HDWalletProvider("pride mystery round monitor put young blush comfort rack live tenant razor",
          "https://rinkeby.infura.io/v3/43132d938aaa4d96a453fd1c708b7f6c")
       },
       //from: "0xa4dA09DF8E5D0E05775c2C26ABCdFB97f3e84e15", // default address to use for any transaction Truffle makes during migrations
       network_id: 1,
       gas: 4612388 // Gas limit used for deploys
    }
   }
 };
