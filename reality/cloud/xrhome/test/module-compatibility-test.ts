import {describe, it} from 'mocha'
import {assert} from 'chai'

import {
  filterCompatibleModules, isModuleCompatible, isValidCompatibility, packCompatibility,
  unpackCompatibility,
} from '../src/shared/module-compatibility'

describe('isModuleCompatible', () => {
  describe('UNSET', () => {
    it('compatible with editor', () => {
      assert.isTrue(isModuleCompatible({compatibility: 'UNSET'}, false, 'CLOUD_EDITOR'))
      assert.isTrue(isModuleCompatible({compatibility: 'UNSET'}, false, 'UNSET'))
      assert.isTrue(isModuleCompatible({compatibility: 'UNSET'}, false, 'AD'))
    })
    it('not compatible with the rest', () => {
      assert.isFalse(isModuleCompatible({compatibility: 'UNSET'}, false, 'CLOUD_STUDIO'))
      assert.isFalse(isModuleCompatible({compatibility: 'UNSET'}, true, 'SELF'))
      assert.isFalse(isModuleCompatible({compatibility: 'UNSET'}, true, 'UNSET'))
    })
  })
  describe('CLOUD_EDITOR_ONLY', () => {
    it('compatible with editor', () => {
      assert.isTrue(
        isModuleCompatible({compatibility: 'CLOUD_EDITOR_ONLY'}, false, 'CLOUD_EDITOR')
      )
      assert.isTrue(isModuleCompatible({compatibility: 'CLOUD_EDITOR_ONLY'}, false, 'UNSET'))
      assert.isTrue(isModuleCompatible({compatibility: 'CLOUD_EDITOR_ONLY'}, false, 'AD'))
    })
    it('not compatible with the rest', () => {
      assert.isFalse(
        isModuleCompatible({compatibility: 'CLOUD_EDITOR_ONLY'}, false, 'CLOUD_STUDIO')
      )
      assert.isFalse(isModuleCompatible({compatibility: 'CLOUD_EDITOR_ONLY'}, true, 'SELF'))
      assert.isFalse(isModuleCompatible({compatibility: 'CLOUD_EDITOR_ONLY'}, true, 'UNSET'))
    })
  })

  describe('SELF_ONLY', () => {
    it('compatible with self', () => {
      assert.isTrue(isModuleCompatible({compatibility: 'SELF_ONLY'}, true, 'SELF'))
      assert.isTrue(isModuleCompatible({compatibility: 'SELF_ONLY'}, true, 'UNSET'))
    })
    it('not compatible with the rest', () => {
      assert.isFalse(isModuleCompatible({compatibility: 'SELF_ONLY'}, false, 'AD'))
      assert.isFalse(isModuleCompatible({compatibility: 'SELF_ONLY'}, false, 'CLOUD_EDITOR'))
      assert.isFalse(isModuleCompatible({compatibility: 'SELF_ONLY'}, false, 'CLOUD_STUDIO'))
      assert.isFalse(isModuleCompatible({compatibility: 'SELF_ONLY'}, false, 'UNSET'))
    })
  })

  describe('ANY', () => {
    it('compatible with all', () => {
      assert.isTrue(isModuleCompatible({compatibility: 'ANY'}, false, 'CLOUD_EDITOR'))
      assert.isTrue(isModuleCompatible({compatibility: 'ANY'}, false, 'CLOUD_STUDIO'))
      assert.isTrue(isModuleCompatible({compatibility: 'ANY'}, false, 'AD'))
      assert.isTrue(isModuleCompatible({compatibility: 'ANY'}, false, 'UNSET'))
      assert.isTrue(isModuleCompatible({compatibility: 'ANY'}, true, 'SELF'))
      assert.isTrue(isModuleCompatible({compatibility: 'ANY'}, false, 'UNSET'))
    })
  })

  describe('CLOUD_STUDIO_ONLY', () => {
    it('compatible with studio', () => {
      assert.isTrue(isModuleCompatible({compatibility: 'CLOUD_STUDIO_ONLY'}, false, 'CLOUD_STUDIO'))
    })
    it('not compatible with the rest', () => {
      assert.isFalse(
        isModuleCompatible({compatibility: 'CLOUD_STUDIO_ONLY'}, false, 'CLOUD_EDITOR')
      )
      assert.isFalse(isModuleCompatible({compatibility: 'CLOUD_STUDIO_ONLY'}, false, 'AD'))
      assert.isFalse(isModuleCompatible({compatibility: 'CLOUD_STUDIO_ONLY'}, true, 'SELF'))
      assert.isFalse(isModuleCompatible({compatibility: 'CLOUD_STUDIO_ONLY'}, true, 'UNSET'))
      assert.isFalse(isModuleCompatible({compatibility: 'CLOUD_STUDIO_ONLY'}, false, 'UNSET'))
    })
  })

  describe('EDITOR_SELF', () => {
    it('compatible with editor or self', () => {
      assert.isTrue(isModuleCompatible({compatibility: 'EDITOR_SELF'}, false, 'CLOUD_EDITOR'))
      assert.isTrue(isModuleCompatible({compatibility: 'EDITOR_SELF'}, false, 'UNSET'))
      assert.isTrue(isModuleCompatible({compatibility: 'EDITOR_SELF'}, false, 'AD'))
      assert.isTrue(isModuleCompatible({compatibility: 'EDITOR_SELF'}, true, 'SELF'))
      assert.isTrue(isModuleCompatible({compatibility: 'EDITOR_SELF'}, true, 'UNSET'))
    })
    it('not compatible with the rest', () => {
      assert.isFalse(isModuleCompatible({compatibility: 'EDITOR_SELF'}, false, 'CLOUD_STUDIO'))
    })
  })

  describe('EDITOR_STUDIO', () => {
    it('compatible with editor or studio', () => {
      assert.isTrue(isModuleCompatible({compatibility: 'EDITOR_STUDIO'}, false, 'CLOUD_EDITOR'))
      assert.isTrue(isModuleCompatible({compatibility: 'EDITOR_STUDIO'}, false, 'UNSET'))
      assert.isTrue(isModuleCompatible({compatibility: 'EDITOR_STUDIO'}, false, 'AD'))
      assert.isTrue(isModuleCompatible({compatibility: 'EDITOR_STUDIO'}, false, 'CLOUD_STUDIO'))
    })
    it('not compatible with the rest', () => {
      assert.isFalse(isModuleCompatible({compatibility: 'EDITOR_STUDIO'}, true, 'SELF'))
      assert.isFalse(isModuleCompatible({compatibility: 'EDITOR_STUDIO'}, true, 'UNSET'))
    })
  })

  describe('SELF_STUDIO', () => {
    it('compatible with self or studio', () => {
      assert.isTrue(isModuleCompatible({compatibility: 'SELF_STUDIO'}, false, 'CLOUD_STUDIO'))
      assert.isTrue(isModuleCompatible({compatibility: 'SELF_STUDIO'}, true, 'SELF'))
      assert.isTrue(isModuleCompatible({compatibility: 'SELF_STUDIO'}, true, 'UNSET'))
    })
    it('not compatible with the rest', () => {
      assert.isFalse(isModuleCompatible({compatibility: 'SELF_STUDIO'}, false, 'CLOUD_EDITOR'))
      assert.isFalse(isModuleCompatible({compatibility: 'SELF_STUDIO'}, false, 'UNSET'))
      assert.isFalse(isModuleCompatible({compatibility: 'SELF_STUDIO'}, false, 'AD'))
    })
  })
})

describe('isValidCompatibility', () => {
  it('returns true if the compatibility is valid', () => {
    assert.isTrue(isValidCompatibility('ANY'))
    assert.isTrue(isValidCompatibility('CLOUD_EDITOR_ONLY'))
    assert.isTrue(isValidCompatibility('SELF_ONLY'))
    assert.isTrue(isValidCompatibility('CLOUD_STUDIO_ONLY'))
    assert.isTrue(isValidCompatibility('EDITOR_SELF'))
    assert.isTrue(isValidCompatibility('SELF_STUDIO'))
    assert.isTrue(isValidCompatibility('EDITOR_STUDIO'))
    assert.isTrue(isValidCompatibility('UNSET'))
  })

  it('returns false if the compatibility is invalid', () => {
    assert.isFalse(isValidCompatibility('INVALID'))
    assert.isFalse(isValidCompatibility('NONE'))
  })
})

describe('filterCompatibleModules', () => {
  const modules = [
    {compatibility: 'UNSET'},
    {compatibility: 'CLOUD_EDITOR_ONLY'},
    {compatibility: 'SELF_ONLY'},
    {compatibility: 'ANY'},
    {compatibility: 'CLOUD_STUDIO_ONLY'},
    {compatibility: 'EDITOR_SELF'},
    {compatibility: 'EDITOR_STUDIO'},
    {compatibility: 'SELF_STUDIO'},
  ] as const

  it('returns only compatible modules for editor', () => {
    assert.deepEqual(filterCompatibleModules(modules, false, 'CLOUD_EDITOR'), [
      {compatibility: 'UNSET'},
      {compatibility: 'CLOUD_EDITOR_ONLY'},
      {compatibility: 'ANY'},
      {compatibility: 'EDITOR_SELF'},
      {compatibility: 'EDITOR_STUDIO'},
    ])
  })
  it('returns only compatible modules for studio', () => {
    assert.deepEqual(filterCompatibleModules(modules, false, 'CLOUD_STUDIO'), [
      {compatibility: 'ANY'},
      {compatibility: 'CLOUD_STUDIO_ONLY'},
      {compatibility: 'EDITOR_STUDIO'},
      {compatibility: 'SELF_STUDIO'},
    ])
  })

  it('returns only compatible modules for self-hosted', () => {
    assert.deepEqual(filterCompatibleModules(modules, true, 'UNSET'), [
      {compatibility: 'SELF_ONLY'},
      {compatibility: 'ANY'},
      {compatibility: 'EDITOR_SELF'},
      {compatibility: 'SELF_STUDIO'},
    ])
    assert.deepEqual(filterCompatibleModules(modules, true, 'SELF'), [
      {compatibility: 'SELF_ONLY'},
      {compatibility: 'ANY'},
      {compatibility: 'EDITOR_SELF'},
      {compatibility: 'SELF_STUDIO'},
    ])
  })
})

describe('packCompatibility', () => {
  it('returns the correct compatibility', () => {
    assert.equal(packCompatibility({self: true, editor: true, studio: true}), 'ANY')
    assert.equal(packCompatibility({self: false, editor: true, studio: false}), 'CLOUD_EDITOR_ONLY')
    assert.equal(packCompatibility({self: true, editor: false, studio: false}), 'SELF_ONLY')
    assert.equal(packCompatibility({self: false, editor: false, studio: true}), 'CLOUD_STUDIO_ONLY')
    assert.equal(packCompatibility({self: true, editor: true, studio: false}), 'EDITOR_SELF')
    assert.equal(packCompatibility({self: false, editor: true, studio: true}), 'EDITOR_STUDIO')
    assert.equal(packCompatibility({self: true, editor: false, studio: true}), 'SELF_STUDIO')
    assert.equal(packCompatibility({self: false, editor: false, studio: false}), 'NONE')
  })
})

describe('unpackCompatibility', () => {
  it('returns the correct compatibility', () => {
    assert.deepEqual(
      unpackCompatibility('UNSET'),
      {self: false, editor: true, studio: false}
    )

    assert.deepEqual(
      unpackCompatibility('CLOUD_EDITOR_ONLY'),
      {self: false, editor: true, studio: false}
    )

    assert.deepEqual(
      unpackCompatibility('SELF_ONLY'),
      {self: true, editor: false, studio: false}
    )

    assert.deepEqual(
      unpackCompatibility('ANY'),
      {self: true, editor: true, studio: true}
    )

    assert.deepEqual(
      unpackCompatibility('CLOUD_STUDIO_ONLY'),
      {self: false, editor: false, studio: true}
    )

    assert.deepEqual(
      unpackCompatibility('EDITOR_SELF'),
      {self: true, editor: true, studio: false}
    )

    assert.deepEqual(
      unpackCompatibility('EDITOR_STUDIO'),
      {self: false, editor: true, studio: true}
    )

    assert.deepEqual(
      unpackCompatibility('SELF_STUDIO'),
      {self: true, editor: false, studio: true}
    )
  })
})
