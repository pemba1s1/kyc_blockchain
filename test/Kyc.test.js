const { assert } = require('chai')

const Kyc = artifacts.require('./Kyc.sol')

require('chai').use(require('chai-as-promised')).should()

contract('KYC', (accounts) => {
  let kyc
  before(async () => {
    kyc = await Kyc.new()
  })
  describe('addOrg() and viewOrg()', async () => {
    it('Org added', async () => {
      await kyc.addOrg('Nabil', '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025')
      const name = await kyc.viewOrg(
        '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025'
      )
      assert.equal(name[0], 'Nabil')
    })
  })

  describe('registerKYC() &  requestKYC()', async () => {
    it('KYC added, request added', async () => {
      await kyc.registerKYC(
        '0x1e84892176f6aE044E620C61133Ce5532166d8DC',
        'json',
        'photo',
        'front',
        'back',
        true,
        12,
        12,
        { from: '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025' }
      )
    })
  })

  describe(' giveAccessKYC(), viewRequest() ,deleteRequest() & viewKYC()', async () => {
    it('Access given, request viewed,request deleted and kyc viewed', async () => {
      await kyc.giveAccessKYC(
        0,
        '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025',
        true,
        { from: '0x1e84892176f6aE044E620C61133Ce5532166d8DC' }
      )
      const name = await kyc.viewKYC(
        '0x1e84892176f6aE044E620C61133Ce5532166d8DC',
        { from: '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025' }
      )
      assert.equal(name[1], 'json')
    })
  })

  describe('updateKYC() & viewKYC()', async () => {
    it('KYC updated', async () => {
      await kyc.updateKYC(
        '0x1e84892176f6aE044E620C61133Ce5532166d8DC',
        'jsonupdated',
        'photo',
        'front',
        'back',
        true,
        12,
        12,
        { from: '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025' }
      )
      const name = await kyc.viewKYC(
        '0x1e84892176f6aE044E620C61133Ce5532166d8DC',
        { from: '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025' }
      )
      assert.equal(name[1], 'jsonupdated')
    })
  })

  describe('revokeAccess()', async () => {
    it('access revoked', async () => {
      await kyc.revokeAccessKYC('0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025', {
        from: '0x1e84892176f6aE044E620C61133Ce5532166d8DC',
      })
    })
  })
  describe('deleteRequestOrg()', async () => {
    it('Request deleted by org', async () => {
      await kyc.requestKYC('0x1e84892176f6aE044E620C61133Ce5532166d8DC', {
        from: '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025',
      })
      await kyc.deleteRequestOrg(0, {
        from: '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025',
      })
    })
  })
  describe('removeKYC()', async () => {
    it('kyc removed', async () => {
      await kyc.requestKYC('0x1e84892176f6aE044E620C61133Ce5532166d8DC', {
        from: '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025',
      })
      await kyc.giveAccessKYC(
        0,
        '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025',
        true,
        { from: '0x1e84892176f6aE044E620C61133Ce5532166d8DC' }
      )
      await kyc.removeKYC('0x1e84892176f6aE044E620C61133Ce5532166d8DC', {
        from: '0xD0B5BAED90404ADaB3163bFFa9Ba6543C9301025',
      })
    })
  })
})
