var Patient = artifacts.require("./Patient.sol");
var WhoToken = artifacts.require("./WhoToken.sol");

module.exports = function(deployer) {
    deployer.deploy(Patient, {
        gas: 500000
    });
    deployer.deploy(WhoToken, 1000, web3.toWei('0.1', 'ether'), {
        gas: 750000
    });
};
