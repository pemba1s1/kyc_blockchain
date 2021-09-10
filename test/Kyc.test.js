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

    describe("registerKYC() , giveAccessKYC(), viewRequest() , requestKYC(),deleteRequest() & viewKYC()",async() => {
        it('KYC added, request added, KYC access given, KYC viewed, Request viewed,Request Deleted',async()=>{
            await kyc.registerKYC(1,'Pemba','Kapan',true,{from : '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025'})
            const name = await kyc.viewKYC(1,{from:'0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025'})
            assert.equal(name[1],'Pemba')
            assert.equal(name[4][0],'0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025')
        })
    })

    describe("updateKYC() & viewKYC()",async() => {
        it("KYC updated",async()=>{
            await kyc.updateKYC(1,'Updated','Kapan',true,{from : '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025'})
            const name = await kyc.viewKYC(1,{from:'0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025'})
            assert.equal(name[1],'Updated')
        })
    })

    describe("revokeAccess()",async()=>{
        it("kyc removed and access revoked",async()=>{
            await kyc.revokeAccessKYC(1,'0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025',{from:'0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025'})
        })
    })

})