const { assert } = require('chai');

const Kyc = artifacts.require("./Kyc.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should();

contract('KYC',accounts=>{
    let kyc
    before(async()=>{
        kyc = await Kyc.new()
    })
    describe('addOrg() and viewOrg()',async()=>{
        it('Org added',async()=>{
            await kyc.addOrg('Nabil','0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025')
            const name = await kyc.viewOrg('0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025')
            assert.equal(name,"Nabil")
        })
    })

    describe("registerKYC() , giveAccessKYC(), viewRequest() , requestKYC() & viewKYC()",async() => {
        it('KYC added, request added, KYC access given, KYC viewed, Request viewed',async()=>{
            await kyc.registerKYC(1,'Pemba','Kapan',true,{from : '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025'})
            const name = await kyc.viewKYC(0,1,{from:'0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025'})
            const val = await kyc.viewRequest(0,{from:'0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025'});
            console.log(name)
            assert.equal(val[3],true)
            assert.equal(val[1],'0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025')
            assert.equal(name[1],'Pemba')
            assert.equal(name[4][0],'0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025')
        })
    })

    describe("updateKYC() & viewKYC()",async() => {
        it("KYC updated",async()=>{
            await kyc.updateKYC(1,'Updated','Kapan',true,{from : '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025'})
            const name = await kyc.viewKYC(0,1,{from:'0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025'})
            assert.equal(name[1],'Updated')
        })
    })

    describe("deleteRequest() & giveAccessKYC()",async()=>{
        it("Request deleted & access revoked",async()=>{
            await kyc.giveAccessKYC(0,1,'0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025',false,{from:'0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025'})
            const val = await kyc.viewRequest(0,{from:'0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025'});
            assert.equal(val[3],false)
            await kyc.deleteRequest(0,{from : '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025'})
        })
    })

})