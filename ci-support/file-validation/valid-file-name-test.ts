/* eslint-disable import/no-unresolved */
// @ts-ignore
import {chai} from 'bzl/js/chai-js'
/* eslint-enable import/no-unresolved */

import {isBlockedFileName, isConventionalFileName} from './valid-file-name'

const {describe, it} = globalThis as any
const {assert} = chai

const VALID_NAMES = [
  'foo',
  'FOO.BAR',
  'foo.bar',
  'foo space bar',
  'foo-bar',
  'foo_bar',
  'foo/bar',
  // Over 1000 of these types of files
  'AppIcon.appiconset/Icon-App-20x20@2x.png',
  'ScanningFramework~/MockSavedScan/depth/00000.dmp',
  // Next.js App Router dynamic route segments
  'platform/gamesite/frontend/src/app/[lang]/layout.tsx',
]

const UNCONVENTIONAL_NAMES = [
  'TestApp/AWSCore.framework/Headers/AWSMTLModel+NSCoding.h',
  'TextMesh Pro/Resources/Fonts & Materials.meta',
  '1920px-Niantic_(software_company_logo).svg.png',
  'Assets/UI/Fonts/Inter-VariableFont_slnt,wght.ttf.meta',
  'LocalizationUX/Animations/ftue-coaching-ui_#[540,504]_0.controller',
  'ReleaseNotesQueue/UnityEditor-Bug-Don\'t-dispose-s.md',
  '164-357-10-DUwANX-bPOZ3dpUasWzZGveQ8Ww=.png',
]

const INVALID_NAMES = [
  'foo?',
  'foo"',
  'foo$',
  'foo*',
  'foo{',
  'foo<',
  'foo>',
  'foo|',
  'foo:',
  'foo;',
  'foo\\',
  'foo😀',
  'föö',
  'fonts/pfennigMultiByte🚀.ttf',
  'SuperMapper Icon 180 – iOS.png',  // wider dash, not hyphen
] as const

describe('isBlockedFileName', () => {
  it('should return true for invalid filenames', () => {
    INVALID_NAMES.forEach((name) => {
      assert.isTrue(isBlockedFileName(name), name)
    })
  })

  it('should return false for valid filenames', () => {
    VALID_NAMES.forEach((name) => {
      assert.isFalse(isBlockedFileName(name), name)
    })
  })

  it('should return false for unconventional filenames which are already present', () => {
    UNCONVENTIONAL_NAMES.forEach((name) => {
      assert.isFalse(isBlockedFileName(name), name)
    })
  })
})

describe('isConventionalFileName', () => {
  it('should return true for normal-looking filenames', () => {
    VALID_NAMES.forEach((name) => {
      assert.isTrue(isConventionalFileName(name), name)
    })
  })

  it('should return false for unconventional filenames', () => {
    UNCONVENTIONAL_NAMES.forEach((name) => {
      assert.isFalse(isConventionalFileName(name), name)
    })
  })

  it('should return false for invalid filenames', () => {
    INVALID_NAMES.forEach((name) => {
      assert.isFalse(isConventionalFileName(name), name)
    })
  })
})
