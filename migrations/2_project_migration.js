// const abi = require('ethereumjs-abi');
const Project = artifacts.require("Project");
// const PointsTokenStorageProxy = artifacts.require("PointsTokenStorageProxy");

module.exports = function (deployer, network, accounts) {
  let loyalty, proxy;
  deployer
    .deploy(Project, accounts[0], 0, 0, 0, 0, 0, true)
    // .then((instance) => {
    //     loyalty = instance;
    //     return PointsTokenStorageProxy.deployed();
    // })
    // .then((instance) => {
    //     proxy = instance;
    //     return instance;
    // })
    // .then((proxy) => {
    //     const methodId = abi.methodID('initialize', ['address']).toString('hex');
    //     const params = abi.rawEncode(['address'], [accounts[0]]).toString('hex');
    //     const initializeData = '0x' + methodId + params;
    //     return proxy.upgradeToAndCall('0', loyalty.address, initializeData, { from: accounts[0] });
    // });
};
