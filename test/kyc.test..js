const { assert } = require('chai');

const Kyc = artifacts.require("./Kyc.sol");

require('chai')
  .use(require('chai-as-promised'))
  .should()

contract('Kyc',([deployer,uploader])=>{
  let kyc

  before(async()=>{
    kyc = await Kyc.deployed()
  })

  describe('org creation',async ()=>{
    it('org created',async ()=>{
    })
  })
})