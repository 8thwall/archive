import {describe, it} from 'mocha'
import {assert} from 'chai'

import {deriveConfigGrouping} from '../src/client/editor/module-config/derive-config-grouping'

describe('deriveConfigGrouping', () => {
  const noFields = [{
    groupId: '[DEFAULT]',
    name: 'New Group',
    isDefault: true,
    fields: [],
  }]

  it('Returns empty group for no config or fields', () => {
    assert.deepEqual(deriveConfigGrouping(null), noFields)
    assert.deepEqual(deriveConfigGrouping({fields: null}), noFields)
    assert.deepEqual(deriveConfigGrouping({fields: {}}), noFields)
    assert.deepEqual(deriveConfigGrouping({fields: {}, groups: {}}), noFields)
  })

  it('Returns default group for fields with no group', () => {
    const config = {
      fields: {
        myField: {fieldName: 'myField', label: 'My String', type: 'string' as const},
      },
    }
    const expected = [{
      groupId: '[DEFAULT]',
      name: 'New Group',
      isDefault: true,
      fields: [{
        fieldName: 'myField',
        label: 'My String',
        type: 'string' as const,
      }],
    }]

    assert.deepEqual(deriveConfigGrouping(config), expected)
  })
  it('Returns fields inside specified group', () => {
    const myField = {
      fieldName: 'myField',
      label: 'My String',
      type: 'string' as const,
      groupId: 'my-id',
    }

    const config = {
      fields: {
        myField,
      },
      groups: {
        'my-id': {
          groupId: 'my-id',
          name: 'My Group',
          order: 1,
        },
      },
    }

    const expected = [{
      groupId: 'my-id',
      name: 'My Group',
      fields: [myField],
      order: 1,
    }]

    assert.deepEqual(deriveConfigGrouping(config), expected)
  })
  it('Returns multiple groups including empty and default groups', () => {
    const myField = {
      fieldName: 'myField',
      label: 'My String',
      type: 'string' as const,
      groupId: 'my-id',
    }

    const unGroupedField = {
      fieldName: 'unGroupedField',
      label: 'Other String',
      type: 'string' as const,
      groupId: 'missing-id',
    }

    const config = {
      fields: {
        myField,
        unGroupedField,
      },
      groups: {
        'my-id': {
          groupId: 'my-id',
          name: 'My Group',
          order: 2,
        },
        'other-id': {
          groupId: 'other-id',
          name: 'Other Group',
          order: 1,
        },
      },
    }

    const expected = [{
      groupId: '[DEFAULT]',
      name: 'New Group',
      isDefault: true,
      fields: [unGroupedField],
    },
    {
      groupId: 'other-id',
      name: 'Other Group',
      fields: [],
      order: 1,
    },
    {
      groupId: 'my-id',
      name: 'My Group',
      fields: [myField],
      order: 2,
    }]

    assert.deepEqual(deriveConfigGrouping(config), expected)
  })

  it('Sorts fields alphabetically within a group', () => {
    const field1 = {
      fieldName: 'field1',
      label: 'My String',
      type: 'string' as const,
      groupId: 'my-id',
    }
    const field2 = {
      fieldName: 'field2',
      label: 'My String',
      type: 'string' as const,
      groupId: 'my-id',
    }
    const field3 = {
      fieldName: 'field3',
      label: 'My String',
      type: 'string' as const,
      groupId: 'my-id',
    }

    const config = {
      fields: {
        field2,
        field3,
        field1,
      },
      groups: {
        'my-id': {
          groupId: 'my-id',
          name: 'My Group',
          order: 2,
        },
      },
    }

    const expected = [{
      groupId: 'my-id',
      name: 'My Group',
      fields: [field1, field2, field3],
      order: 2,
    }]

    assert.deepEqual(deriveConfigGrouping(config), expected)
  })

  it('Sorts ordered fields', () => {
    const field1 = {
      fieldName: 'bbbField',
      label: 'My String',
      type: 'string' as const,
      groupId: 'my-id',
      order: 1,
    }
    const field2 = {
      fieldName: 'cccField',
      label: 'My String',
      type: 'string' as const,
      groupId: 'my-id',
      order: 2,
    }
    const field3 = {
      fieldName: 'aaaField',
      label: 'My String',
      type: 'string' as const,
      groupId: 'my-id',
      order: 3,
    }

    const config = {
      fields: {
        field2,
        field3,
        field1,
      },
    }

    const expected = [{
      groupId: '[DEFAULT]',
      name: 'New Group',
      isDefault: true,
      fields: [field1, field2, field3],
    }]

    assert.deepEqual(deriveConfigGrouping(config), expected)
  })

  it('Places fields with specified order before others', () => {
    const field1 = {
      fieldName: 'zzzField',
      label: 'My String',
      type: 'string' as const,
      groupId: 'my-id',
      order: 1,
    }
    const field2 = {
      fieldName: 'bbbField',
      label: 'My String',
      type: 'string' as const,
      groupId: 'my-id',
    }
    const field3 = {
      fieldName: 'aaaField',
      label: 'My String',
      type: 'string' as const,
      groupId: 'my-id',
    }
    const field4 = {
      fieldName: '000Field',
      label: 'My String',
      type: 'string' as const,
      groupId: 'my-id',
      order: 0.5,
    }

    const config = {
      fields: {
        field2,
        field3,
        field4,
        field1,
      },
    }

    const expected = [{
      groupId: '[DEFAULT]',
      name: 'New Group',
      isDefault: true,
      fields: [field4, field1, field3, field2],
    }]

    assert.deepEqual(deriveConfigGrouping(config), expected)
  })

  it('Uses fieldName as a tiebreaker', () => {
    const field1 = {
      fieldName: 'zzzField',
      label: 'My String',
      type: 'string' as const,
      groupId: 'my-id',
      order: 1,
    }
    const field2 = {
      fieldName: 'aaaField',
      label: 'My String',
      type: 'string' as const,
      groupId: 'my-id',
      order: 1,
    }

    const config = {
      fields: {
        field1,
        field2,
      },
    }

    const expected = [{
      groupId: '[DEFAULT]',
      name: 'New Group',
      isDefault: true,
      fields: [field2, field1],
    }]

    assert.deepEqual(deriveConfigGrouping(config), expected)
  })
})
