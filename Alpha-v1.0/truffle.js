require('babel-register')

module.exports = {
  networks: {
    development: {
      host: 'localhost',
      port: 8545,
      gas: 6600000,
      network_id: '*'
    }
  }
}
