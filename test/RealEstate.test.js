const { FormControlStatic } = require('react-bootstrap');
const { default: Web3 } = require('web3');

const RealEstate = artifacts.require("RealEstate");


require('chai')
  .use(require('chai-as-promised'))
  .should()

console.log("Hello")

contract('RealEstate',(accounts)=>{

    let re

    before(async()=>{

      re = await RealEstate.new(10)
    })

    describe('RealEstate deployment',async()=>{
      
      

    })
})
