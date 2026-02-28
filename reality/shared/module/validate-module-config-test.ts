// @attr(npm_rule = "@npm-lambda//:npm-lambda")
import {describe, it, assert} from 'bzl/js/chai-js'

import type {DeepReadonly as RO} from 'ts-essentials'

import {isValidModuleConfig} from './validate-module-config'
import type {ModuleConfig} from './module-config'

const assertIsValidModuleConfig = (isValid: boolean, config: any) => (
  assert.strictEqual(
    isValidModuleConfig(config), isValid,
    `This config should be ${isValid ? 'valid' : 'invalid'}:\n${JSON.stringify(config, null, 2)}`
  )
)

describe('isValidModuleConfig', () => {
  it('Returns true for undefined', () => {
    assert.isTrue(isValidModuleConfig(undefined))
  })

  it('Returns true for an empty objects', () => {
    assert.isTrue(isValidModuleConfig({}))
    assert.isTrue(isValidModuleConfig({fields: {}}))
    assert.isTrue(isValidModuleConfig({groups: {}}))
    assert.isTrue(isValidModuleConfig({fields: {}, groups: {}}))
  })

  it('Returns true for basic config ', () => {
    const config: RO<ModuleConfig> = {
      fields: {
        field: {fieldName: 'field', type: 'string', label: 'My Label'},
      },
    } as const

    assertIsValidModuleConfig(true, config)
  })

  it('Returns true for config with basic fields', () => {
    const config: RO<ModuleConfig> = {
      fields: {
        baseString: {fieldName: 'baseString', type: 'string', label: ''},
        baseBoolean: {fieldName: 'baseBoolean', type: 'boolean', label: 'This is a boolean'},
        baseNumber: {fieldName: 'baseNumber', type: 'number', label: ''},
        baseResource: {fieldName: 'baseResource', type: 'resource', label: ''},
      },
    } as const

    assertIsValidModuleConfig(true, config)
  })

  it('Returns true for config with fields with defaults', () => {
    const config: RO<ModuleConfig> = {
      fields: {
        defaultString: {fieldName: 'defaultString', type: 'string', label: '', default: ''},
        defaultString2: {fieldName: 'defaultString2', type: 'string', label: '', default: 'value'},
        defaultBoolean: {fieldName: 'defaultBoolean', type: 'boolean', label: '', default: false},
        defaultBoolean2: {fieldName: 'defaultBoolean2', type: 'boolean', label: '', default: true},
        defaultNumber: {fieldName: 'defaultNumber', type: 'number', label: '', default: 42},
        defaultResourceUrl: {
          fieldName: 'defaultResourceUrl',
          type: 'resource',
          label: '',
          default: {type: 'url', url: 'https://example.com/image.png'},
        },
        defaultResourceAsset: {
          fieldName: 'defaultResourceAsset',
          type: 'resource',
          label: '',
          default: {type: 'asset', asset: 'assets/my-file.png'},
        },
        defaultResourceUrlNull: {
          fieldName: 'defaultResourceUrlNull',
          type: 'resource',
          label: '',
          default: {type: 'url', url: null},
        },
        defaultResourceAssetNull: {
          fieldName: 'defaultResourceAssetNull',
          type: 'resource',
          label: '',
          default: {type: 'asset', asset: null},
        },
        defaultResourceAssetUndefined: {
          fieldName: 'defaultResourceAssetUndefined',
          type: 'resource',
          label: '',
          default: {type: 'asset', asset: undefined},
        },
        defaultResourceAssetEmpty: {
          fieldName: 'defaultResourceAssetEmpty',
          type: 'resource',
          label: '',
          default: {type: 'asset', asset: ''},
        },
      },
    } as const

    assertIsValidModuleConfig(true, config)
  })

  it('Returns true for config with extra config on fields', () => {
    const config: RO<ModuleConfig> = {
      fields: {
        number: {
          fieldName: 'number',
          type: 'number',
          label: '',
          min: 0,
          max: 100,
        },
        boolean: {
          fieldName: 'boolean',
          type: 'boolean',
          label: '',
          trueDescription: 'The value is true.',
          falseDescription: 'The value is false.',
        },
        resource: {
          fieldName: 'resource',
          type: 'resource',
          label: '',
          extensions: ['jpg', 'png'],
        },
        resourceEmptyExtensions: {
          fieldName: 'resourceEmptyExtensions',
          type: 'resource',
          label: '',
          extensions: [],  // This is the same as extensions not being set
        },
      },
    } as const

    assertIsValidModuleConfig(true, config)
  })

  it('Returns true for a valid config object with groups', () => {
    const config: RO<ModuleConfig> = {
      fields: {
        groupedField: {
          fieldName: 'groupedField',
          type: 'string',
          label: '',
          groupId: 'groupA',
        },
        groupedField2: {
          fieldName: 'groupedField2',
          type: 'string',
          label: '',
          groupId: 'groupA',
          order: 1,
        },
        groupedField3: {
          fieldName: 'groupedField3',
          type: 'string',
          label: '',
          groupId: 'groupC',  // Being inside a non-existent group is not disallowed.
          order: 42,
        },
      },
      groups: {
        groupA: {
          groupId: 'groupA',
          name: 'A',
          order: 0,
        },
        groupB: {
          groupId: 'groupB',
          name: '',
          order: 1,
        },
      },
    } as const

    assertIsValidModuleConfig(true, config)
  })

  it('Returns false for incorrect structure', () => {
    assertIsValidModuleConfig(false, '')
    assertIsValidModuleConfig(false, 42)
    assertIsValidModuleConfig(false, {fields: 42})
    assertIsValidModuleConfig(false, {fields: ''})
    assertIsValidModuleConfig(false, {fields: []})
    assertIsValidModuleConfig(false, {fields: {}, groups: 42})
    assertIsValidModuleConfig(false, {fields: {}, groups: ''})
    assertIsValidModuleConfig(false, {fields: {}, groups: []})
  })

  it('Returns false for fields with invalid defaults', () => {
    const invalidFields = [
      {fieldName: 'field', type: 'string', label: '', default: false},
      {fieldName: 'field', type: 'string', label: '', default: null},
      {fieldName: 'field', type: 'boolean', label: '', default: null},
      {fieldName: 'field', type: 'boolean', label: '', default: ''},
      {fieldName: 'field', type: 'number', label: '', default: '42'},
      {fieldName: 'field', type: 'number', label: '', default: null},
      {fieldName: 'field', type: 'resource', label: '', default: 42},
      {fieldName: 'field', type: 'resource', label: '', default: {type: 'url', url: 42}},
      {fieldName: 'field', type: 'resource', label: '', default: {type: 'asset', asset: false}},
    ]

    invalidFields.forEach((field) => {
      assertIsValidModuleConfig(false, {fields: {[field.fieldName]: field}})
    })
  })

  it('Returns false when a field is invalid', () => {
    const invalidFields = [
      ['field', 42],
      ['field', []],
      ['field', true],
      ['myField', {fieldName: 'yourField', type: 'string', label: ''}],
    ] as const

    invalidFields.forEach(([key, field]) => {
      assertIsValidModuleConfig(false, {fields: {[key]: field}})
    })
  })

  it('Returns false for invalid field has invalid properties', () => {
    const invalidFields = [
      {fieldName: '', type: 'string', label: ''},
      {fieldName: 'field', type: 'string', label: '', groupId: 42},
      {fieldName: 'field', type: 'string', label: '', order: '0'},
      {fieldName: 'field', type: 'string'},
      {fieldName: 'field', type: 'string', label: true},
      {fieldName: 'field', type: 'not-a-type', label: ''},
      {fieldName: 'field', type: 'number', label: '', min: 'hello'},
      {fieldName: 'field', type: 'number', label: '', max: 'hello'},
      {fieldName: 'field', type: 'boolean', label: '', trueDescription: 42},
      {fieldName: 'field', type: 'boolean', label: '', falseDescription: 42},
      {fieldName: 'field', type: 'resource', label: '', extensions: 42},
      {fieldName: 'field', type: 'resource', label: '', extensions: {}},
      {fieldName: 'field', type: 'resource', label: '', extensions: [42]},
      {fieldName: 'field', type: 'resource', label: '', extensions: false},
      {fieldName: 'field', type: 'resource', label: '', labelForDefault: 42},
    ] as const

    invalidFields.forEach((field) => {
      assertIsValidModuleConfig(false, {fields: {[field.fieldName]: field}})
    })
  })
})
