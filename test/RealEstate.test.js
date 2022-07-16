const { assert } = require('chai');
//const { FormControlStatic } = require('react-bootstrap');
//const { Item } = require('react-bootstrap/lib/Breadcrumb');
const { default: Web3 } = require('web3');

const RealEstate = artifacts.require("RealEstate");


require('chai')
  .use(require('chai-as-promised'))
  .should()

console.log("Hello")

const a1='0x567b215575986Cb9CbE15449bcE72D1F26061333'
const a2='0x33E7499e5d1f8320c89A948299fD23f9724710E0'
const a3 ='0x166A372B2e0F75D28DA3613D18F5c3D5Ed73dAF6'
const a4='0xc86D6DBeF6FeEE705f15bcDDa26FDe2C11901E56'

contract('RealEstate',(accounts)=>{

    let re

    before(async()=>{

      re = await RealEstate.new(10)
    })

    describe('Buy',async()=>{

      let buy

      it('a2 buys property 0',async()=>{

        buy = await re.buy(0,{from:a2,value:1})

        const event = buy.logs[0].args
        assert.equal(event.id,0)
        assert.equal(event.from,a1)
        assert.equal(event.to,a1)
        assert.equal(event.price,1)


      })
      
      
    })
})
