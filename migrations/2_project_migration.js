const Project = artifacts.require("Project");

module.exports = function (deployer, network, accounts) {
  let loyalty, proxy;
  deployer
    .deploy(Project, accounts[0], 0, 0);
};
