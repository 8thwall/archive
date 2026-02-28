// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

// @dep(//reality/shared/gateway:validate-gateway-definition)
// @inliner-skip-next
import {validateGatewayHeaders} from './validate-gateway-headers'

describe('validateGatewayHeaders', () => {
  const VALID_LITERAL = {type: 'literal', value: 'application/json'} as const
  const VALID_SECRET = {type: 'secret', secretId: 'my-secret-id'} as const
  const VALID_LITERAL_SLOT = {type: 'literalslot', slotId: 'example-slot-2', label: ''} as const
  const VALID_SECRET_SLOT = {type: 'secretslot', slotId: 'example-slot-1', label: ''} as const

  it('Accepts valid headers', async () => {
    assert.isTrue(validateGatewayHeaders({
      'Content-Type': VALID_LITERAL,
      'Authorization': VALID_SECRET,
      'Content-Type2': VALID_LITERAL_SLOT,
      'Authorization2': VALID_SECRET_SLOT,
      'Origin': {type: 'passthrough'},
    }, {allowSecret: true, allowSlot: true}))
  })

  it('Accepts empty headers', () => {
    assert.isTrue(validateGatewayHeaders(undefined, {}))
    assert.isTrue(validateGatewayHeaders(null, {}))
    assert.isTrue(validateGatewayHeaders({}, {}))
  })

  describe('keys', () => {
    it('No duplicates', async () => {
      assert.isFalse(validateGatewayHeaders({
        'Content-Type': VALID_LITERAL,
        'CoNtEnT-tYpE': VALID_LITERAL,
      }, {allowSlot: true}))
    })

    it('Limited length', async () => {
      assert.isFalse(validateGatewayHeaders({
        ['C'.repeat(300)]: VALID_LITERAL,
      }, {}))
    })

    it('Cannot be empty', async () => {
      assert.isFalse(validateGatewayHeaders({
        '': VALID_LITERAL,
      }, {}))
    })

    it('Limited characters', async () => {
      assert.isFalse(validateGatewayHeaders({
        'X:Z:Y': VALID_LITERAL,
      }, {}))
    })
  })

  describe('slots', () => {
    it('Supports slots', async () => {
      assert.isTrue(validateGatewayHeaders({
        'Content-Type': VALID_LITERAL_SLOT,
        'Authorization': VALID_SECRET_SLOT,
      }, {allowSlot: true}))
    })

    it('Rejects slots by default', async () => {
      assert.isFalse(validateGatewayHeaders({
        'Content-Type': VALID_LITERAL_SLOT,
      }, {}))
      assert.isFalse(validateGatewayHeaders({
        'Authorization': VALID_SECRET_SLOT,
      }, {}))
    })

    describe('label', () => {
      it('String', async () => {
        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_LITERAL_SLOT, label: undefined},
        }, {allowSlot: true}))
        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET_SLOT, label: undefined},
        }, {allowSlot: true}))

        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_LITERAL_SLOT, label: 42},
        }, {allowSlot: true}))
        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET_SLOT, label: 42},
        }, {allowSlot: true}))
      })

      it('Can be empty', () => {
        assert.isTrue(validateGatewayHeaders({
          'Content-Type': {...VALID_LITERAL_SLOT, label: ''},
        }, {allowSlot: true}))
        assert.isTrue(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET_SLOT, label: ''},
        }, {allowSlot: true}))
      })

      it('Limited length', () => {
        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_LITERAL_SLOT, label: 'l'.repeat(300)},
        }, {allowSlot: true}))
        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET_SLOT, label: 'l'.repeat(300)},
        }, {allowSlot: true}))
      })
    })

    describe('prefix', () => {
      it('String', async () => {
        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET_SLOT, prefix: null},
        }, {allowSlot: true}))
        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET_SLOT, prefix: 42},
        }, {allowSlot: true}))
      })

      it('Optional', async () => {
        assert.isTrue(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET_SLOT, prefix: undefined},
        }, {allowSlot: true}))
      })

      it('Can be empty', () => {
        assert.isTrue(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET_SLOT, prefix: ''},
        }, {allowSlot: true}))
      })

      it('Limited length', () => {
        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET_SLOT, prefix: 'l'.repeat(300)},
        }, {allowSlot: true}))
      })
    })

    describe('slotId', () => {
      it('String', async () => {
        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_LITERAL_SLOT, slotId: undefined},
        }, {allowSlot: true}))
        assert.isFalse(validateGatewayHeaders({
          'Authorization': {...VALID_SECRET_SLOT, slotId: undefined},
        }, {allowSlot: true}))
        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_LITERAL_SLOT, slotId: 42},
        }, {allowSlot: true}))
        assert.isFalse(validateGatewayHeaders({
          'Authorization': {...VALID_SECRET_SLOT, slotId: 42},
        }, {allowSlot: true}))
      })

      it('Cannot be empty', async () => {
        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_LITERAL_SLOT, slotId: ''},
        }, {allowSlot: true}))
        assert.isFalse(validateGatewayHeaders({
          'Authorization': {...VALID_SECRET_SLOT, slotId: ''},
        }, {allowSlot: true}))
      })

      it('Limited length', async () => {
        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_LITERAL_SLOT, slotId: 'x'.repeat(300)},
        }, {allowSlot: true}))
        assert.isFalse(validateGatewayHeaders({
          'Authorization': {...VALID_SECRET_SLOT, slotId: 'x'.repeat(300)},
        }, {allowSlot: true}))
      })
    })
  })

  describe('secret', () => {
    const options = {allowSecret: true}
    it('Supports secrets', async () => {
      assert.isTrue(validateGatewayHeaders({
        'Authorization': VALID_SECRET,
      }, options))
    })

    it('Rejects secrets by default', async () => {
      assert.isFalse(validateGatewayHeaders({
        'Authorization': VALID_SECRET,
      }, {}))
    })

    it('secretId is required', async () => {
      assert.isFalse(validateGatewayHeaders({
        'Content-Type': {...VALID_SECRET, secretId: undefined},
      }, options))
      assert.isFalse(validateGatewayHeaders({
        'Content-Type': {...VALID_SECRET, secretId: 42},
      }, options))
      assert.isFalse(validateGatewayHeaders({
        'Content-Type': {...VALID_SECRET, secretId: ''},
      }, options))
    })

    describe('allowedOrigin', async () => {
      it('String', () => {
        assert.isTrue(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET, allowedOrigin: 'https://example.com'},
        }, options))
        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET, allowedOrigin: 42},
        }, options))

        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET, allowedOrigin: {}},
        }, options))
      })

      it('Optional', () => {
        assert.isTrue(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET, allowedOrigin: undefined},
        }, options))
      })

      it('Can be empty', () => {
        assert.isTrue(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET, allowedOrigin: ''},
        }, options))
      })
      it('Limited length', async () => {
        assert.isFalse(validateGatewayHeaders({
          'Content-Type': {...VALID_SECRET, allowedOrigin: 'a'.repeat(3000)},
        }, options))
      })
    })
  })

  describe('literal', () => {
    it('String', () => {
      assert.isFalse(validateGatewayHeaders({
        'Example': {...VALID_LITERAL, value: 42},
      }, {}))
      assert.isFalse(validateGatewayHeaders({
        'Example': {...VALID_LITERAL, value: {}},
      }, {}))
      assert.isFalse(validateGatewayHeaders({
        'Example': {...VALID_LITERAL, value: undefined},
      }, {}))
      assert.isFalse(validateGatewayHeaders({
        'Example': {...VALID_LITERAL, value: null},
      }, {}))
    })
    it('Can be empty', () => {
      assert.isTrue(validateGatewayHeaders({
        'Empty-Is-Ok': {...VALID_LITERAL, value: ''},
      }, {}))
    })
    it('Limited length', async () => {
      assert.isFalse(validateGatewayHeaders({
        'Content-Type': {type: 'literal', value: 'a'.repeat(2000)},
      }, {}))
    })
  })

  it('Rejects if header limit is exceeded', async () => {
    assert.isFalse(validateGatewayHeaders(Object.fromEntries(Array.from({length: 17}, (_, i) => (
      [`Content-Type-${i}`, {type: 'literal', value: 'application/json'}]
    ))), {}))
  })

  it('Rejects slot with invalid label', async () => {
    assert.isFalse(validateGatewayHeaders({
      'Content-Type': {type: 'literalslot', slotId: 'bad-label', label: 42},
    }, {allowSlot: true}))
    assert.isFalse(validateGatewayHeaders({
      'Content-Type': {type: 'secretslot', slotId: 'bad-label', label: 42},
    }, {allowSlot: true}))
  })

  it('Rejects unexpected data types', async () => {
    assert.isFalse(validateGatewayHeaders('string', {}))
    assert.isFalse(validateGatewayHeaders(42, {}))
    assert.isFalse(validateGatewayHeaders(true, {}))
    assert.isFalse(validateGatewayHeaders(false, {}))
    assert.isFalse(validateGatewayHeaders({example: {}}, {}))
    assert.isFalse(validateGatewayHeaders({example: null}, {}))
    assert.isFalse(validateGatewayHeaders({example: 42}, {}))
  })
})
