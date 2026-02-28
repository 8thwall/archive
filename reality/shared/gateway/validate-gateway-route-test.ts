// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

// @dep(//reality/shared/gateway:validate-gateway-definition)
// @inliner-skip-next
import {validateGatewayRoute} from './validate-gateway-route'

describe('validateGatewayRoute', () => {
  const VALID_ROUTE = {
    id: 'example',
    name: 'routeName',
    url: '/example/url',
    methods: ['GET'],
    headers: {
      'Content-Type': {type: 'literal', value: 'application/json'},
      'Empty-Is-Ok': {type: 'literal', value: ''},
    },
  } as const

  it('Accepts valid route', async () => {
    assert.isTrue(validateGatewayRoute(VALID_ROUTE, {}))
  })

  describe('name', () => {
    it('String', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        name: undefined,
      }, {}))
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        name: 42,
      }, {}))
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        name: {},
      }, {}))
    })

    it('Not empty', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        name: '',
      }, {}))
    })

    it('Limited length', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        name: 'a'.repeat(300),
      }, {}))
    })

    it('Limited characters', async () => {
      assert.isTrue(validateGatewayRoute({
        ...VALID_ROUTE,
        name: 'Something_valid$0',
      }, {}))
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        name: 'a space',
      }, {}))
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        name: 'a/slash',
      }, {}))

      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        name: 'a-dash',
      }, {}))
    })
  })

  describe('id', () => {
    it('String', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        id: undefined,
      }, {}))
    })

    it('Not empty', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        id: '',
      }, {}))
    })

    it('Limited length', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        id: 'a'.repeat(300),
      }, {}))
    })
  })

  describe('url', () => {
    it('String', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        url: undefined,
      }, {}))
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        url: 42,
      }, {}))
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        url: {},
      }, {}))
    })

    it('Can be empty', async () => {
      assert.isTrue(validateGatewayRoute({
        ...VALID_ROUTE,
        url: '',
      }, {}))
    })

    it('Limited length', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        url: 'a'.repeat(3000),
      }, {}))
    })
    it('Limited characters', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        url: '/bad-wildcard/*',
      }, {}))
    })

    it('Can include uppercase', async () => {
      assert.isTrue(validateGatewayRoute({
        ...VALID_ROUTE,
        url: '/GoodPath/',
      }, {}))
    })
    it('Can include valid symbols', async () => {
      assert.isTrue(validateGatewayRoute({
        ...VALID_ROUTE,
        url: '/GoodPath:Something-blah_blah.json?x=hello%20world',
      }, {}))
    })
  })

  describe('methods', () => {
    it('Requires array', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        methods: undefined,
      }, {}))
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        methods: 42,
      }, {}))
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        methods: {},
      }, {}))
    })

    it('Not empty', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        methods: [],
      }, {}))
    })

    it('No repeats', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        methods: ['GET', 'POST', 'GET'],
      }, {}))
    })

    it('No unexpected values', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        methods: ['GET', 'INVALID'],
      }, {}))
    })
  })

  describe('headers', () => {
    it('Object', () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        headers: 3,
      }, {}))
    })

    it('Optional', () => {
      assert.isTrue(validateGatewayRoute({
        ...VALID_ROUTE,
        headers: undefined,
      }, {}))
    })

    it('Supports slots', async () => {
      assert.isTrue(validateGatewayRoute({
        ...VALID_ROUTE,
        headers: {
          ...VALID_ROUTE.headers,
          'Authorization': {type: 'secretslot', slotId: 'my-slot-id', label: ''},
        },
      }, {allowSlot: true}))
    })

    it('Rejects slots by default', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        headers: {
          ...VALID_ROUTE.headers,
          'Authorization': {type: 'secretslot', slotId: 'my-slot-id', label: ''},
        },
      }, {}))
    })

    it('Supports secrets', async () => {
      assert.isTrue(validateGatewayRoute({
        ...VALID_ROUTE,
        headers: {
          ...VALID_ROUTE.headers,
          'Authorization': {type: 'secret', secretId: 'my-secret-id'},
        },
      }, {allowSecret: true}))
    })

    it('Rejects secrets by default', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        headers: {
          ...VALID_ROUTE.headers,
          'Authorization': {type: 'secret', secretId: 'my-secret-id'},
        },
      }, {}))
    })

    it('No unexpected values', async () => {
      assert.isFalse(validateGatewayRoute({
        ...VALID_ROUTE,
        headers: {
          ...VALID_ROUTE.headers,
          'Authorization': {},
        },
      }, {}))
    })
  })

  it('Rejects invalid format', () => {
    assert.isFalse(validateGatewayRoute(undefined, {}))
    assert.isFalse(validateGatewayRoute(null, {}))
    assert.isFalse(validateGatewayRoute(false, {}))
    assert.isFalse(validateGatewayRoute(3, {}))
    assert.isFalse(validateGatewayRoute({}, {}))
  })
})
