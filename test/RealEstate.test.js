const { assert, AssertionError } = require('chai');
//const { FormControlStatic } = require('react-bootstrap');
//const { Item } = require('react-bootstrap/lib/Breadcrumb');
const { default: Web3 } = require('web3');

const RealEstate = artifacts.require("RealEstate");


require('chai')
  .use(require('chai-as-promised'))
  .should()

console.log("Hello")

const a1='0x1091a34b9f40Af505bFFA9D3692305ab0D85c5D3'
const a2='0xd181c2402C8791B3D8172FFb98be27C52B2a3FF7'
const a3 ='0x37991C07D88a3FB6be25607AAf82c1d88E60AE23'
const a4='0x20ef82ab8Ac6aD7F5C9994fFf983e000e5254eE8'
const a5 = '0x1270426aeDa82E4d0C532E6772336776b6102165'


contract('RealEstate',(accounts)=>{

    let re

    before(async()=>{

      re = await RealEstate.new(10)
    })

  /*  describe('RealEstate Deployment',async()=>{

      const p0 = await re.get_property(0);

      const event = p0.logs[0].args

      assert.equal(p0==1)
      assert.equal(event.id==0)
      assert.equal(event.owner==a1)
      assert.equal(event.price==1)
      assert.equal(event.balance==10**18)
      assert.equal(event.onSale==false)

    })*/

    describe('Buy',async()=>{

      let buy,post

      it('a1 post property 0 ',async()=>{

        post  = await re.postProperty(0,{from:a1})
        const event = post.logs[0].args

        assert.equal(event.id,0)
        assert.equal(event.owner,a1)
      })

      it('a2 buys property 0',async()=>{

       // let balance = await re.balanceOf(a1)
       // console.log(balance.toString())

       // await re.increaseAllowance(a2, 10,{from:a1})
        buy = await re.buy(0,{from:a2,value:10})

        let balance_a1 = await re.balanceOf(a1)
        let balance_a2 = await re.balanceOf(a2)

       // console.log(balance_a1.toString())

        assert.equal(balance_a1.toString(),90)
        assert.equal(balance_a2.toString(),10)

        

        //const event = buy.logs[0].args
       /* assert.equal(event,event)
        assert.equal(event.from,a1)
        assert.equal(event.to,a1)
        assert.equal(event.price,1)*/


      })

      it('a2 buys its own property',async()=>{
        await re.buy(0,{from:a2,value:10}).should.be.rejected

      })

      it('a3 buys non posted property',async()=>{

        await re.buy(1,{from:a3,value:2}).should.be.rejected
      })
      
      
    })

    describe('Rent',async()=>{

      it('a3 rents one part of property 0',async()=>{

        //await re.increaseAllowance(a3,1,{from:a2})
        let rent = await re.rent(0,1,{from:a3,value:1})

        let balance_a2 = await re.balanceOf(a2)
        let balance_a3 = await re.balanceOf(a3)

        assert.equal(balance_a2.toString(),9)
        assert.equal(balance_a3.toString(),1)

      })

      it('a4 rents 2 parts of property 1',async()=>{

        //await re.increaseAllowance(a4,2,{from:a1})
        let rent = await re.rent(1,2,{from:a4,value:4})

        let balance_a1 = await re.balanceOf(a1) //90 - 2 = 88
        let balance_a4 = await re.balanceOf(a4)

        assert.equal(balance_a1.toString(),88)
        assert.equal(balance_a4.toString(),2)


      })

      it('a5 rents 1 part of property 9',async()=>{

        //await re.increaseAllowance(a5,1,{from:a1})
        let rent = await re.rent(9,1,{from:a5,value:10})

        let balance_a1 = await re.balanceOf(a1) // 88 - 1 = 87
        let balance_a5 = await re.balanceOf(a5)

        assert.equal(balance_a1.toString(),87)
        assert.equal(balance_a5.toString(),1)

      })

      it('a5 rents 9 parts of property 1',async()=>{

       // await re.increaseAllowance(a5,9,{from:a1})
         await re.rent(1,9,{from:a5,value:18}).should.be.rejected //this amount of 
         //property cannot be rented


      })
    })


  describe('Pay Rent',async()=>{

    it('a3 pays rent for property 0',async()=>{

      let pay = await re.pay_rent(0,{from:a3,value:1})
    })

    it('a4 pays rent for property 1',async()=>{

      let pay = await re.pay_rent(1,{from:a4,value:4})
    })

    it('a4 pays rent for property 5',async()=>{
      await re.pay_rent(5,{from:a4,value:4}).should.be.rejected

    })
  })

  describe('De Rent',async()=>{

    it('a3 de rents property 0',async()=>{

      // await re.increaseAllowance(a2,1,{from:a3})
       await re.de_rent(0,{from:a3})

       let balance_a2 = await re.balanceOf(a2)
        let balance_a3 = await re.balanceOf(a3)

        assert.equal(balance_a2.toString(),10)
        assert.equal(balance_a3.toString(),0)

    })

    it('a1 de rents property 3',async()=>{
      await re.de_rent(0,{from:a3}).should.be.rejected

    })

    
  })

  describe('Throw Faulty tenant',async()=>{

    it('a1 throws a5',async()=>{
      await re.throw_faulty_tenant(9,a5,{from:a1})

      let balance_a5 = await re.balanceOf(a5)
      let balance_a1 = await re.balanceOf(a1)

      assert.equal(balance_a1.toString(),88)
      assert.equal(balance_a5.toString(),0)


    })
  })
})
