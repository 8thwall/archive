// @attr(npm_rule = "@npm-lambda//:npm-lambda")

// @ts-ignore
// eslint-disable-next-line import/no-unresolved
import {describe, it, assert} from 'bzl/js/chai-js'

import {
  _validateFunctionDefinition as validateFunctionDefinition,
  _validateProxyDefinition as validateProxyDefinition,
  validateGatewayDefinition,
} from './validate-gateway-definition'

describe('validateGatewayDefinition', () => {
  const VALID_PROXY = {
    baseUrl: 'https://example.com',
    title: 'Example Title'.padEnd(100),
    description: 'This is my description'.padEnd(1023),
    headers: {
      'Empty-Is-Ok': {type: 'literal', value: ''},
    },
    routes: [{
      id: 'example',
      name: 'routeName',
      url: '',
      methods: ['GET'],
      headers: {
        'Content-Type': {type: 'literal', value: 'application/json'},
        'Empty-Is-Ok': {type: 'literal', value: ''},
      },
    }],
  } as const

  const VALID_FUNCTION = {
    type: 'function',
    title: 'Example Title'.padEnd(100),
    description: 'This is my description'.padEnd(1023),
    entry: 'src/nested/dir/index.ts',
    headers: {
      'Empty-Is-Ok': {type: 'literal', value: ''},
    },
  } as const

  it('Rejects invalid definition format', () => {
    assert.isFalse(validateGatewayDefinition(null, {}))
  })

  it('Accepts valid proxy definition', () => {
    assert.isTrue(validateGatewayDefinition(VALID_PROXY, {}))
  })

  it('Accepts valid function definition', () => {
    assert.isTrue(validateGatewayDefinition(VALID_FUNCTION, {}))
  })

  it('Rejects function definition defined with type proxy', () => {
    assert.isFalse(validateGatewayDefinition({...VALID_FUNCTION, type: 'proxy'}, {}))
  })
})

describe('validateProxyDefinition', () => {
  const VALID_PROXY = {
    baseUrl: 'https://example.com',
    title: 'Example Title'.padEnd(100),
    description: 'This is my description'.padEnd(1023),
    headers: {
      'Empty-Is-Ok': {type: 'literal', value: ''},
    },
    routes: [{
      id: 'example',
      name: 'routeName',
      url: '',
      methods: ['GET'],
      headers: {
        'Content-Type': {type: 'literal', value: 'application/json'},
        'Empty-Is-Ok': {type: 'literal', value: ''},
      },
    }],
  } as const

  it('Accepts valid gateway', () => {
    assert.isTrue(validateProxyDefinition(VALID_PROXY, {}))
  })

  describe('name', () => {
    it('String', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        name: 42,
      }, {expectName: true}))
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        name: undefined,
      }, {expectName: true}))
    })

    it('Only allowed in some contexts', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        name: 'name',
      }, {}))
    })

    it('Can be required', () => {
      assert.isTrue(validateProxyDefinition({
        ...VALID_PROXY,
        name: 'my-name-1',
      }, {expectName: true}))
    })

    it('Not empty', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        name: '',
      }, {expectName: true}))
    })

    it('Limited length', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        name: 'n'.repeat(300),
      }, {expectName: true}))
    })

    it('Limited characters', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        name: '*',
      }, {expectName: true}))
    })
  })
  describe('title', () => {
    it('String', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        title: 42,
      }, {}))
    })

    it('Optional', () => {
      assert.isTrue(validateProxyDefinition({
        ...VALID_PROXY,
        title: undefined,
      }, {}))
    })

    it('Can be empty', () => {
      assert.isTrue(validateProxyDefinition({
        ...VALID_PROXY,
        title: '',
      }, {}))
    })

    it('Limited length', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        title: 'Title'.repeat(200),
      }, {}))
    })
  })

  describe('description', () => {
    it('String', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        description: 42,
      }, {}))
    })

    it('Optional', () => {
      assert.isTrue(validateProxyDefinition({
        ...VALID_PROXY,
        description: undefined,
      }, {}))
    })

    it('Can be empty', () => {
      assert.isTrue(validateProxyDefinition({
        ...VALID_PROXY,
        description: '',
      }, {}))
    })

    it('Limited length', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        description: '3'.repeat(2000),
      }, {}))
    })
  })

  describe('baseUrl', () => {
    it('String', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        baseUrl: {},
      }, {}))
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        baseUrl: undefined,
      }, {}))
    })

    it('Cannot be empty', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        baseUrl: '',
      }, {}))
    })

    it('Valid format', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        baseUrl: 'something-invalid',
      }, {}))
    })

    it('HTTPS only', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        baseUrl: 'http://example.com',
      }, {}))
    })

    it('Limited length', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        baseUrl: `https://example.com/${'a'.repeat(3000)}`,
      }, {}))
    })

    it('Limited characters', async () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        baseUrl: 'https://example.com/*',
      }, {}))
    })

    it('Can include uppercase', async () => {
      assert.isTrue(validateProxyDefinition({
        ...VALID_PROXY,
        baseUrl: 'https://example.com/ABC',
      }, {}))
    })
    it('Can include valid symbols', async () => {
      assert.isTrue(validateProxyDefinition({
        ...VALID_PROXY,
        baseUrl: 'https://example.com/ABC/GoodPath:Something-blah_blah.json?x=hello%20world',
      }, {}))
    })
  })

  describe('headers', () => {
    it('Object', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        headers: 3,
      }, {}))
    })

    it('Optional', () => {
      assert.isTrue(validateProxyDefinition({
        ...VALID_PROXY,
        headers: undefined,
      }, {}))
    })

    it('Supports slots', async () => {
      assert.isTrue(validateProxyDefinition({
        ...VALID_PROXY,
        headers: {
          ...VALID_PROXY.headers,
          'Authorization': {type: 'secretslot', slotId: 'my-slot-id', label: ''},
        },
      }, {allowSlot: true}))
    })

    it('Rejects slots by default', async () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        headers: {
          ...VALID_PROXY.headers,
          'Authorization': {type: 'secretslot', slotId: 'my-slot-id', label: ''},
        },
      }, {}))
    })

    it('Supports secrets', async () => {
      assert.isTrue(validateProxyDefinition({
        ...VALID_PROXY,
        headers: {
          ...VALID_PROXY.headers,
          'Authorization': {type: 'secret', secretId: 'my-secret-id'},
        },
      }, {allowSecret: true}))
    })

    it('Rejects secrets by default', async () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        headers: {
          ...VALID_PROXY.headers,
          'Authorization': {type: 'secret', secretId: 'my-secret-id'},
        },
      }, {}))
    })

    it('No unexpected values', async () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        headers: {
          ...VALID_PROXY.headers,
          'Authorization': {},
        },
      }, {}))
    })
  })

  describe('routes', () => {
    it('Array', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        routes: {},
      }, {}))

      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        routes: 42,
      }, {}))

      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        routes: undefined,
      }, {}))
    })

    it('Can be empty', () => {
      assert.isTrue(validateProxyDefinition({
        ...VALID_PROXY,
        routes: [],
      }, {}))
    })

    it('Elements must be valid', () => {
      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        routes: [...VALID_PROXY.routes, null],
      }, {}))

      assert.isFalse(validateProxyDefinition({
        ...VALID_PROXY,
        routes: [...VALID_PROXY.routes, {}],
      }, {}))
    })
  })

  it('Rejects invalid format', () => {
    assert.isFalse(validateProxyDefinition(undefined, {}))
    assert.isFalse(validateProxyDefinition(null, {}))
    assert.isFalse(validateProxyDefinition(false, {}))
    assert.isFalse(validateProxyDefinition(3, {}))
    assert.isFalse(validateProxyDefinition({}, {}))
  })
})

describe('validateFunctionDefinition', () => {
  const VALID_FUNCTION = {
    type: 'function',
    title: 'Example Title'.padEnd(100),
    description: 'This is my description'.padEnd(1023),
    entry: 'src/nested/dir/index.ts',
    headers: {
      'Empty-Is-Ok': {type: 'literal', value: ''},
    },
  } as const

  it('Accepts valid gateway', () => {
    assert.isTrue(validateFunctionDefinition(VALID_FUNCTION, {}))
  })

  describe('name', () => {
    it('String', () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        name: 42,
      }, {expectName: true}))
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        name: undefined,
      }, {expectName: true}))
    })

    it('Only allowed in some contexts', () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        name: 'name',
      }, {}))
    })

    it('Can be required', () => {
      assert.isTrue(validateFunctionDefinition({
        ...VALID_FUNCTION,
        name: 'my-name-1',
      }, {expectName: true}))
    })

    it('Not empty', () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        name: '',
      }, {expectName: true}))
    })

    it('Limited length', () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        name: 'n'.repeat(300),
      }, {expectName: true}))
    })

    it('Limited characters', () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        name: '*',
      }, {expectName: true}))
    })
  })

  describe('title', () => {
    it('String', () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        title: 42,
      }, {}))
    })

    it('Optional', () => {
      assert.isTrue(validateFunctionDefinition({
        ...VALID_FUNCTION,
        title: undefined,
      }, {}))
    })

    it('Can be empty', () => {
      assert.isTrue(validateFunctionDefinition({
        ...VALID_FUNCTION,
        title: '',
      }, {}))
    })

    it('Limited length', () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        title: 'Title'.repeat(200),
      }, {}))
    })
  })

  describe('description', () => {
    it('String', () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        description: 42,
      }, {}))
    })

    it('Optional', () => {
      assert.isTrue(validateFunctionDefinition({
        ...VALID_FUNCTION,
        description: undefined,
      }, {}))
    })

    it('Can be empty', () => {
      assert.isTrue(validateFunctionDefinition({
        ...VALID_FUNCTION,
        description: '',
      }, {}))
    })

    it('Limited length', () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        description: '3'.repeat(2000),
      }, {}))
    })
  })

  describe('headers', () => {
    it('Object', () => {
      assert.isTrue(validateFunctionDefinition({
        ...VALID_FUNCTION,
      }, {}))
    })

    it('Optional', () => {
      assert.isTrue(validateFunctionDefinition({
        ...VALID_FUNCTION,
        headers: undefined,
      }, {}))
    })

    it('Rejects secret slots by default', async () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        headers: {
          ...VALID_FUNCTION.headers,
          'Authorization': {type: 'secretslot', slotId: 'my-slot-id', label: ''},
        },
      }, {allowSlot: true}))
    })

    it('Rejects slots by default', async () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        headers: {
          ...VALID_FUNCTION.headers,
          'Authorization': {type: 'secretslot', slotId: 'my-slot-id', label: ''},
        },
      }, {}))
    })

    it('Rejects secrets regardless of option', async () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        headers: {
          ...VALID_FUNCTION.headers,
          'Authorization': {type: 'secret', secretId: 'my-secret-id'},
        },
      }, {allowSecret: true}))
    })

    it('Rejects secret slots regardless of option', async () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        headers: {
          ...VALID_FUNCTION.headers,
          'Authorization': {type: 'secret', secretId: 'my-secret-id'},
        },
      }, {allowSecretSlot: true}))
    })

    it('Rejects secrets by default', async () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        headers: {
          ...VALID_FUNCTION.headers,
          'Authorization': {type: 'secret', secretId: 'my-secret-id'},
        },
      }, {}))
    })

    it('Allows literal slots', async () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        headers: {
          ...VALID_FUNCTION.headers,
          'Content-Type': {type: 'literalslot', slotId: 'my-slot-id', label: ''},
        },
      }, {}))
    })

    it('No unexpected values', async () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        headers: {
          ...VALID_FUNCTION.headers,
          'Authorization': {},
        },
      }, {}))
    })
  })

  it('Rejects invalid format', () => {
    assert.isFalse(validateFunctionDefinition(undefined, {}))
    assert.isFalse(validateFunctionDefinition(null, {}))
    assert.isFalse(validateFunctionDefinition(false, {}))
    assert.isFalse(validateFunctionDefinition(3, {}))
    assert.isFalse(validateFunctionDefinition({}, {}))
  })

  describe('entry', () => {
    it('String', () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        entry: 42,
      }, {}))
    })

    it('Has no extension', () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        entry: 'index',
      }, {}))
    })

    it('Has invalid extension', () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        entry: 'index.py',
      }, {}))
    })

    it('Is not a nested path', () => {
      assert.isTrue(validateFunctionDefinition({
        ...VALID_FUNCTION,
        entry: 'index.ts',
      }, {}))
    })

    it('Is a nested path', () => {
      assert.isTrue(validateFunctionDefinition({
        ...VALID_FUNCTION,
        entry: 'src/deeply/nested/path/index.ts',
      }, {}))
    })

    it('Has invalid characters', () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        entry: 'src/invalid@path/index.ts',
      }, {}))
    })

    it('Can include uppercase', async () => {
      assert.isTrue(validateFunctionDefinition({
        ...VALID_FUNCTION,
        entry: 'src/ABC.ts',
      }, {}))
    })

    it('Can include valid symbols', async () => {
      assert.isTrue(validateFunctionDefinition({
        ...VALID_FUNCTION,
        entry: 'src/ABC/GoodPath-Something-blah_blah.ts',
      }, {}))
    })

    it('Cannot include nested extensions', async () => {
      assert.isFalse(validateFunctionDefinition({
        ...VALID_FUNCTION,
        entry: 'src/ABC/GoodPath-Something-blah_blah.js.ts',
      }, {}))
    })
  })
})
