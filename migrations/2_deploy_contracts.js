const RealEstate = artifacts.require("RealEstate");




module.exports = async function(deployer) {
  
  
 
  await  deployer.deploy(RealEstate,10);
 // const carTrade = await CarTrade.deployed();

  

 
};