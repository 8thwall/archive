// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)
// @package(npm-ecr)

import type {QueryCommandOutput} from '@aws-sdk/client-dynamodb'

import {describe, it, assert} from '@nia/bzl/js/chai-js'

import {
  validateAppName,
  validateAppDisplayName,
  validateBundleIdUtil,
  validateVersionNameUtil,
  validateExportType,
  validateBuildMode,
  naeS3Bucket,
  naeS3Key,
  getPreviewIconUrl,
  naeDdbTableName,
  makeNaeNameForEnv,
  sanitizeBundleId,
  getBundleIdAndDisplayNameWithSuffix,
  cleanupStringForBundleId,
  getSigningConfigs,
  createSigningInfoFromSeparateData,
  getCertificatesForAccount,
  getAuthKeyInfo,
  createSigningInfoFromConfig,
  validatePermissionUsageDescriptionUtil,
  getCsrPem,
  NAE_PERMISSION_USAGE_DESCRIPTION_MAX_CHARACTERS,
} from '@nia/reality/shared/nae/nae-utils'
import type {
  AppleSigningType,
  HtmlShell,
  Permissions,
  RefHead,
} from '../../shared/nae/nae-types'

describe('validateAppName', () => {
  it('generic app name with dashes is valid', async () => {
    const validAppName = 'valid-app-name'

    assert.isTrue(validateAppName(validAppName), `Expected "${validAppName}" to be valid`)
  })

  it('app name starting with `-` is invalid', async () => {
    const invalidAppName = '-invalid-app-name'

    assert.isFalse(validateAppName(invalidAppName), `Expected "${invalidAppName}" to be invalid`)
  })

  it('app name ending with `-` is valid', async () => {
    const validAppName = 'valid-app-name-'

    assert.isTrue(validateAppName(validAppName), `Expected "${validAppName}" to be valid`)
  })

  it('app name with multiple dashes is valid', async () => {
    const validAppName = 'valid--app--name'

    assert.isTrue(validateAppName(validAppName), `Expected "${validAppName}" to be valid`)
  })

  it('app name with numbers is valid', async () => {
    const validAppName = 'valid123app456name'

    assert.isTrue(validateAppName(validAppName), `Expected "${validAppName}" to be valid`)
  })

  it('app name with uppercase letters is invalid', async () => {
    const invalidAppName = 'InvalidAppName'

    assert.isFalse(validateAppName(invalidAppName), `Expected "${invalidAppName}" to be invalid`)
  })

  it('app name with special characters is invalid', async () => {
    const invalidAppName = 'invalid@app#name'

    assert.isFalse(validateAppName(invalidAppName), `Expected "${invalidAppName}" to be invalid`)
  })

  it('app name with spaces is invalid', async () => {
    const invalidAppName = 'invalid app name'

    assert.isFalse(validateAppName(invalidAppName), `Expected "${invalidAppName}" to be invalid`)
  })

  it('app name with empty string is invalid', async () => {
    const invalidAppName = ''

    assert.isFalse(validateAppName(invalidAppName), `Expected "${invalidAppName}" to be invalid`)
  })

  it('app name with only dashes is invalid', async () => {
    const invalidAppName = '-----'

    assert.isFalse(validateAppName(invalidAppName), `Expected "${invalidAppName}" to be invalid`)
  })

  it('app name with only numbers is valid', async () => {
    const validAppName = '123456'

    assert.isTrue(validateAppName(validAppName), `Expected "${validAppName}" to be valid`)
  })
})

describe('validateBuildMode', () => {
  it('validates a standard build mode', () => {
    const validBuildModes = ['hot-reload', 'static']
    validBuildModes.forEach((mode) => {
      assert.isTrue(validateBuildMode(mode), `Expected "${mode}" to be a valid build mode`)
    })
  })

  it('fails on invalid build mode', () => {
    const invalidBuildModes = ['invalid-mode', 'hot reload', 'static-build', 'UNKNOWN']
    invalidBuildModes.forEach((mode) => {
      assert.isFalse(validateBuildMode(mode), `Expected "${mode}" to be an invalid build mode`)
    })
  })
})

describe('validateBundleIdUtil', () => {
  const platforms: HtmlShell[] = ['android', 'ios', 'osx', 'quest'] as const
  for (const platform of platforms) {
    const separator = (platform === 'android' || platform === 'quest') ? '_' : '-'

    it(`for ${platform}, validates a standard bundle ID`, async () => {
      const valid = 'com.example.myapp'
      assert.equal(validateBundleIdUtil(platform, valid), 'success')
    })
    it(`for ${platform}, fails on empty string`, async () => {
      assert.equal(validateBundleIdUtil(platform, ''), 'empty')
    })
    it(`for ${platform}, fails with no dot segments`, async () => {
      assert.equal(validateBundleIdUtil(platform, 'comexample'), 'too-few-parts')
    })
    it(`for ${platform}, fails with segment starting with digit`, async () => {
      assert.equal(
        validateBundleIdUtil(platform, 'com.123example.app'), 'first-char-of-part-not-letter'
      )
    })
    it(`for ${platform}, fails with special characters`, async () => {
      assert.equal(validateBundleIdUtil(platform, 'com.exa$mple.app'), 'invalid-char')
      assert.equal(validateBundleIdUtil(platform, 'com.exa-mple.app'),
        (platform === 'android' || platform === 'quest')
          ? 'invalid-char'
          : 'success')
    })
    it(`for ${platform}, fails with many different special characters`, async () => {
      const specials = '!@#$%^&*()=+[]{}|;:\'",<>?/\\~`'.split('')
      for (const char of specials) {
        const invalid = `com.exam${char}ple.app`
        assert.equal(
          validateBundleIdUtil(platform, invalid),
          'invalid-char'
        )
      }
    })

    it(`for ${platform}, fails with segment starting with underscore`, async () => {
      assert.equal(
        validateBundleIdUtil(platform, 'com._example.app'), 'first-char-of-part-not-letter'
      )
    })
    it(`for ${platform}, passes with separator and digits after first letter`, async () => {
      const valid = `com.exa${separator}mple123.app${separator}1`
      assert.equal(validateBundleIdUtil(platform, valid), 'success')
    })
    it(`for ${platform}, is case-sensitive and allows uppercase`, async () => {
      const valid = 'Com.Example.MyApp'
      assert.equal(
        validateBundleIdUtil(platform, valid), 'success'
      )
    })
    it(`for ${platform}, fails with trailing dot`, async () => {
      assert.equal(validateBundleIdUtil(platform, 'com.example.'), 'empty-part')
    })
    it(`for ${platform}, fails with empty segment`, async () => {
      assert.equal(validateBundleIdUtil(platform, '..comexample'), 'empty-part')
      assert.equal(validateBundleIdUtil(platform, 'com..example'), 'empty-part')
      assert.equal(validateBundleIdUtil(platform, 'comexample..'), 'empty-part')
    })
    it(`for ${platform}, fails with too long bundle ID`, async () => {
      const tooLong = 'a'.repeat(151)
      assert.equal(validateBundleIdUtil(platform, tooLong), 'too-long')
    })
  }
})

describe('validateAppDisplayName', () => {
  it('validates a standard app name', async () => {
    const valid = 'Whaddup, This is an App Name!'
    assert.equal(validateAppDisplayName(valid), 'success')
  })
  it('fails on empty string', async () => {
    assert.equal(validateAppDisplayName(''), 'empty')
  })
  it('fails with tab character', async () => {
    assert.equal(validateAppDisplayName('Example\tApp'), 'invalid-char')
  })
  it('fails with newline character', async () => {
    assert.equal(validateAppDisplayName('Example\nApp'), 'invalid-char')
  })
  it('fails with character that needs escape', async () => {
    assert.equal(validateAppDisplayName('Lucas" App'), 'char-needs-escape')
    assert.equal(validateAppDisplayName('Lucas& App'), 'char-needs-escape')
    assert.equal(validateAppDisplayName('Lucas < App'), 'char-needs-escape')
    assert.equal(validateAppDisplayName('Lucas > App'), 'char-needs-escape')

    // eslint-disable-next-line quotes
    assert.equal(validateAppDisplayName("Lucas ' App"), 'char-needs-escape')
  })
  it('succeeds with escaped characters', async () => {
    assert.equal(validateAppDisplayName('Lucas\\\' App'), 'success')

    /* eslint-disable no-useless-escape */
    assert.equal(validateAppDisplayName('Lucas \\\& App'), 'success')
    assert.equal(validateAppDisplayName('Lucas \\\< App'), 'success')
    assert.equal(validateAppDisplayName('Lucas \\\> App'), 'success')
    assert.equal(validateAppDisplayName('Lucas \\\" App'), 'success')
    /* eslint-enable no-useless-escape */
  })
  it('fails with unicode chars', async () => {
    assert.equal(validateAppDisplayName('My U+8888 App'), 'unicode-char')
    assert.equal(validateAppDisplayName('My U+AB8DAAAAAA App'), 'unicode-char')
    assert.equal(validateAppDisplayName('My U+ab88A App'), 'unicode-char')
    assert.equal(validateAppDisplayName('My U+8Aab88A App'), 'unicode-char')
  })
  it('succeeds with escaped unicode chars', async () => {
    assert.equal(validateAppDisplayName('My \u8888 App'), 'success')
    assert.equal(validateAppDisplayName('My \uAB8DAAAAAA App'), 'success')
    assert.equal(validateAppDisplayName('My \uab88A App'), 'success')
    assert.equal(validateAppDisplayName('My \u8Aab88A App'), 'success')
  })
  it('fails with leading or trailing whitespace', async () => {
    assert.equal(validateAppDisplayName(' My App'), 'leading-or-trailing-whitespace')
    assert.equal(validateAppDisplayName(' My App '), 'leading-or-trailing-whitespace')
    assert.equal(validateAppDisplayName('My App '), 'leading-or-trailing-whitespace')
  })
  it('fails with name longer than max', async () => {
    const longName = 'This is a very long app name that exceeds the maximum length allowed'
    assert.equal(validateAppDisplayName(longName), 'too-long')
  })
})

describe('validateVersionNameUtil', () => {
  it('validates a standard semantic version', async () => {
    const validTestCases = [
      '1.0.0',
      '2.3.4',
      '2.0.0',
      '10.20.30',
    ]
    const invalidTestCases = [
      '1.0',
      '2.3.1-alpha',
      '1.0.0-beta.1',
      '1.2.3-rc.2+build.123',
      'not a version',
      '!@@$*@($%*@)!$!',
      '',
      null,
      undefined,
    ]

    validTestCases.forEach((validVersion) => {
      assert.isTrue(validateVersionNameUtil(validVersion),
        `Expected "${validVersion}" to be valid`)
    })
    invalidTestCases.forEach((invalidVersion) => {
      assert.isFalse(validateVersionNameUtil(invalidVersion!),
        `Expected "${invalidVersion}" to be invalid`)
    })
  })
})

describe('validateExportType', () => {
  it('validates a standard export type', () => {
    const validExportTypes = ['apk', 'aab', 'ipa', 'zip']
    validExportTypes.forEach((type) => {
      assert.isTrue(validateExportType(type), `Expected "${type}" to be a valid export type`)
    })
  })
  it('fails on invalid export type', () => {
    const invalidExportTypes = ['invalid', 'fake', 'ignore']
    invalidExportTypes.forEach((type) => {
      assert.isFalse(
        validateExportType(type),
        `Expected "${type}" to be an invalid export type`
      )
    })
  })
})

describe('naeS3Bucket', () => {
  it('does not crash with invalid input', async () => {
    assert.equal(naeS3Bucket(''), '8w-us-west-2-nae-builds-lambda-')
  })

  it('returns a bucket with valid input', async () => {
    assert.equal(naeS3Bucket('foo'), '8w-us-west-2-nae-builds-lambda-foo')
  })
})

describe('naeS3Key', () => {
  it('does not crash with invalid input', async () => {
    assert.equal(naeS3Key('', '', ''), '/.')
  })

  it('returns a key with valid input', async () => {
    assert.equal(naeS3Key('foo', 'bar', 'apk'), 'foo/bar.apk')
  })
})

describe('makeNaeNameForEnv', () => {
  it('generates the correct name with valid inputs', async () => {
    const result = makeNaeNameForEnv('builder', 'prod')
    assert.equal(result, 'nae-lambda-builder-builder-prod')
  })

  it('handles empty name input', async () => {
    const result = makeNaeNameForEnv('', 'dev')
    assert.equal(result, 'nae-lambda-builder--dev')
  })

  it('handles empty dataRealm input', async () => {
    const result = makeNaeNameForEnv('builder', '')
    assert.equal(result, 'nae-lambda-builder-builder-')
  })

  it('handles both name and dataRealm being empty', async () => {
    const result = makeNaeNameForEnv('', '')
    assert.equal(result, 'nae-lambda-builder--')
  })
})

describe('naeDdbTableName', () => {
  it('generates correct table name for given dataRealm', async () => {
    const result = naeDdbTableName('prod')
    assert.equal(result, 'nae-lambda-builder-historical-build-table-prod')
  })

  it('handles empty dataRealm input', async () => {
    const result = naeDdbTableName('')
    assert.equal(result, 'nae-lambda-builder-historical-build-table-')
  })
})

describe('getPreviewIconUrl', () => {
  it('does not crash with invalid input', async () => {
    assert.equal(getPreviewIconUrl(''), 'https://cdn.8thwall.com/images/nae/icons/-512x512')
  })

  it('returns a URL with valid input', async () => {
    assert.equal(getPreviewIconUrl('foo'), 'https://cdn.8thwall.com/images/nae/icons/foo-512x512')
  })
})

describe('sanitizeBundleId', () => {
  const platforms: HtmlShell[] = ['android', 'ios', 'osx', 'quest'] as const
  for (const platform of platforms) {
    const separator = (platform === 'android' || platform === 'quest') ? '_' : '-'
    it(`for ${platform}, handles both leading digits and hyphens`, () => {
      const testCases = [
        {input: 'com.1example.my-app', expected: `com.oneexample.my${separator}app`},
        {
          input: 'com.8th-wall.test-app',
          expected: `com.eightth${separator}wall.test${separator}app`,
        },
        {input: 'com.3d-studio.vr-app', expected: `com.threed${separator}studio.vr${separator}app`},
      ]

      testCases.forEach(({input, expected}) => {
        assert.equal(sanitizeBundleId(platform, input), expected,
          `Expected "${input}" to be sanitized to "${expected}"`)
      })
    })

    it(`for ${platform}, it only converts leading digits, not digits elsewhere in segment`, () => {
      const testCases = [
        {input: 'com.example123.app', expected: 'com.example123.app'},
        {input: 'com.test1app.name', expected: 'com.test1app.name'},
        {input: 'com.1app2test3.name', expected: 'com.oneapp2test3.name'},
      ]

      testCases.forEach(({input, expected}) => {
        assert.equal(sanitizeBundleId(platform, input), expected,
          `Expected "${input}" to be sanitized to "${expected}"`)
      })
    })

    it(`for ${platform}, it handles all digits 0-9 correctly`, () => {
      const digitWords = [
        'zero', 'one', 'two', 'three', 'four', 'five', 'six', 'seven', 'eight', 'nine',
      ]

      digitWords.forEach((word, index) => {
        const input = `com.${index}example.app`
        const expected = `com.${word}example.app`
        assert.equal(sanitizeBundleId(platform, input), expected,
          `Expected digit "${index}" to be converted to "${word}"`)
      })
    })

    it(`for ${platform}, it preserves valid bundle IDs unchanged`, () => {
      const validBundleIds = [
        'com.example.app',
        'com.mycompany.myapp',
      ]

      validBundleIds.forEach((bundleId) => {
        assert.equal(sanitizeBundleId(platform, bundleId), bundleId,
          `Expected valid bundle ID "${bundleId}" to remain unchanged`)
      })
    })

    it(`for ${platform}, it handles separators correctly`, () => {
      const testCases = [
        {
          input: 'com.a_b-c__d--.name',
          expected:
          `com.a${separator}b${separator}c${separator}${separator}d${separator}${separator}.name`,
        },
        {
          input: 'com.___.name',
          expected: `com.${separator}${separator}${separator}.name`,
        },
      ]
      testCases.forEach(({input, expected}) => {
        assert.equal(sanitizeBundleId(platform, input), expected,
          `Expected "${input}" to be sanitized to "${expected}"`)
      })
    })
  }
})

describe('getBundleIdAndDisplayNameWithSuffix', () => {
  const baseBundleId = 'com.example.app'
  const baseDisplayName = 'Example App'

  it('returns unchanged values for iOS platform regardless of refHead', () => {
    const refHeads = [
      'production', 'staging', 'master', 'dev', 'feature-branch', '', null, undefined,
    ]

    refHeads.forEach((refHead) => {
      const result = getBundleIdAndDisplayNameWithSuffix(
        baseBundleId,
        baseDisplayName,
        'ios',
        refHead as any
      )
      assert.deepEqual(result, {
        bundleId: baseBundleId,
        displayName: baseDisplayName,
      }, `Expected no change for iOS with refHead: ${refHead}`)
    })
  })

  it('adds ".staging" and " (Staging)" for android + staging', () => {
    const result = getBundleIdAndDisplayNameWithSuffix(
      baseBundleId,
      baseDisplayName,
      'android',
      'staging'
    )
    assert.deepEqual(result, {
      bundleId: 'com.example.app.staging',
      displayName: 'Example App (Staging)',
    })
  })

  it('adds ".latest" and " (Latest)" for android + master', () => {
    const result = getBundleIdAndDisplayNameWithSuffix(
      baseBundleId,
      baseDisplayName,
      'android',
      'master'
    )
    assert.deepEqual(result, {
      bundleId: 'com.example.app.latest',
      displayName: 'Example App (Latest)',
    })
  })

  it('adds ".dev" and " (Dev)" for android + non-production non-staging/master refHeads', () => {
    const devRefs = ['dev', 'feature-branch', 'hotfix', 'qa', 'test']

    devRefs.forEach((refHead) => {
      const result = getBundleIdAndDisplayNameWithSuffix(
        baseBundleId,
        baseDisplayName,
        'android',
        refHead as any
      )
      assert.deepEqual(result, {
        bundleId: 'com.example.app.dev',
        displayName: 'Example App (Dev)',
      }, `Expected .dev suffix for android with refHead: ${refHead}`)
    })
  })

  it('returns unchanged values for android + production refHead', () => {
    const result = getBundleIdAndDisplayNameWithSuffix(
      baseBundleId,
      baseDisplayName,
      'android',
      'production'
    )
    assert.deepEqual(result, {
      bundleId: baseBundleId,
      displayName: baseDisplayName,
    })
  })

  it('handles non-stating/latest/production refHead as dev', () => {
    const result = getBundleIdAndDisplayNameWithSuffix(
      baseBundleId,
      baseDisplayName,
      'android',
      'foo' as RefHead
    )
    assert.deepEqual(result, {
      bundleId: 'com.example.app.dev',
      displayName: 'Example App (Dev)',
    })
  })

  it('handles null/undefined refHead on android as dev', () => {
    const resultNull = getBundleIdAndDisplayNameWithSuffix(
      baseBundleId,
      baseDisplayName,
      'android',
      null as any
    )
    assert.deepEqual(resultNull, {
      bundleId: 'com.example.app.dev',
      displayName: 'Example App (Dev)',
    })

    const resultUndef = getBundleIdAndDisplayNameWithSuffix(
      baseBundleId,
      baseDisplayName,
      'android',
      undefined as any
    )
    assert.deepEqual(resultUndef, {
      bundleId: 'com.example.app.dev',
      displayName: 'Example App (Dev)',
    })
  })
})

describe('cleanupStringForBundleId', () => {
  const platforms: HtmlShell[] = ['android', 'ios'] as const
  for (const platform of platforms) {
    const separator = (platform === 'android' || platform === 'quest') ? '_' : '-'

    it(`for ${platform}, normalizes to lowercase for alphanumeric-only strings`, () => {
      assert.equal(cleanupStringForBundleId(platform, 'Alpha123'), 'alpha123')
    })

    it(`for ${platform}, replaces spaces with underscores`, () => {
      assert.equal(cleanupStringForBundleId(platform, 'hello world'), `hello${separator}world`)
      assert.equal(
        cleanupStringForBundleId(platform, '  leading and  trailing  '),
        `${
          separator}${
          separator}leading${separator}and${separator}${separator}trailing${separator}${separator}`
      )
    })

    it(`for ${platform}, replaces common punctuation with underscores`, () => {
      assert.equal(cleanupStringForBundleId(platform, 'a-b'), `a${separator}b`)
      assert.equal(cleanupStringForBundleId(platform, 'a.b'), `a${separator}b`)
      assert.equal(
        cleanupStringForBundleId(platform, 'a/b\\c'), `a${separator}b${separator}c`
      )
      assert.equal(
        cleanupStringForBundleId(platform, 'a,b;c:'), `a${separator}b${separator}c${separator}`
      )
      assert.equal(
        cleanupStringForBundleId(platform, 'a@b#c!'), `a${separator}b${separator}c${separator}`
      )
    })

    it(`for ${platform}, replaces underscores with underscores (no change)`, () => {
      assert.equal(cleanupStringForBundleId(platform, 'a_b_c'), `a${separator}b${separator}c`)
      assert.equal(cleanupStringForBundleId(platform, '_'), `${separator}`)
    })

    it(`for ${
      platform}, replaces multiple consecutive non-alphanumerics with multiple underscores`, () => {
      assert.equal(
        cleanupStringForBundleId(platform, 'a--b..c!!'),
        `a${separator}${separator}b${separator}${separator}c${separator}${separator}`
      )
      assert.equal(
        cleanupStringForBundleId(platform, '---'), `${separator}${separator}${separator}`
      )
    })

    it(`for ${platform}, handles empty strings`, () => {
      assert.equal(cleanupStringForBundleId(platform, ''), '')
    })

    it(`for ${platform}, handles leading and trailing non-alphanumeric characters`, () => {
      assert.equal(cleanupStringForBundleId(platform, '-a-'), `${separator}a${separator}`)
      assert.equal(cleanupStringForBundleId(platform, '.abc.'), `${separator}abc${separator}`)
    })

    it(`for ${platform}, preserves digits and normalizes letters to lowercase`, () => {
      assert.equal(cleanupStringForBundleId(platform, 'AbC123'), 'abc123')
      assert.equal(cleanupStringForBundleId(platform, 'v2.0'), `v2${separator}0`)
    })

    it(`for ${platform}, replaces whitespace characters (tabs, newlines) with underscores`, () => {
      assert.equal(cleanupStringForBundleId(platform, 'a\tb'), `a${separator}b`)
      assert.equal(cleanupStringForBundleId(platform, 'a\nb'), `a${separator}b`)
      assert.equal(cleanupStringForBundleId(platform, 'a\r\nb'), `a${separator}${separator}b`)
    })

    it(`for ${platform}, replaces emoji and non-Latin characters with underscores`, () => {
      // Many emoji are UTF-16 surrogate pairs -> two underscores
      assert.equal(cleanupStringForBundleId(platform, 'a😀b'), `a${separator}${separator}b`)
      assert.equal(cleanupStringForBundleId(platform, 'Café'), `caf${separator}`)
      assert.equal(cleanupStringForBundleId(platform, '中文'), `${separator}${separator}`)
      assert.equal(
        cleanupStringForBundleId(
          platform, 'שלום'
        ), `${separator}${separator}${separator}${separator}`
      )
      assert.equal(
        cleanupStringForBundleId(platform, 'абв'), `${separator}${separator}${separator}`
      )
    })

    it(`for ${platform}, is idempotent (running twice yields the same result)`, () => {
      const input = `a${separator}b c.d/e`
      const once = cleanupStringForBundleId(platform, input)
      const twice = cleanupStringForBundleId(platform, once)
      assert.equal(twice, once)
    })

    it(`for ${platform}, keeps output length equal to input length`, () => {
      const input = 'a!b@c#d$e%f^g&h*i(j)k l'
      const output = cleanupStringForBundleId(platform, input)
      assert.equal(output.length, input.length)
    })

    it(`for ${platform}, handles very long inputs`, () => {
      const input = ('abc-123 !@#').repeat(1000)
      const output = cleanupStringForBundleId(platform, input)
      assert.equal(output.includes('-'), platform !== 'android')
      assert.equal(output.includes(' '), false)
      assert.equal(output.includes('!'), false)
      assert.equal(output.includes('@'), false)
      assert.equal(output.includes('#'), false)
      assert.equal(output.length, input.length)
    })
  }
})

describe('getSigningConfigs', () => {
  it('returns both development and distribution configs when both exist', async () => {
    const ddbClient = {
      query: async () => ({
        $metadata: {},
        Items: [
          {
            pk: {S: 'app-uuid'},
            sk: {S: 'development'},
            provisioningProfileExpirationDate: {S: new Date(Date.now() + 100000).toISOString()},
            provisioningProfileName: {S: 'DevProfile'},
            certificateUuid: {S: 'cert-uuid-dev'},
            provisioningProfileBase64: {S: 'base64dev'},
            teamIdentifier: {S: 'team-dev'},
          },
          {
            pk: {S: 'app-uuid'},
            sk: {S: 'distribution'},
            provisioningProfileExpirationDate: {S: new Date(Date.now() + 200000).toISOString()},
            provisioningProfileName: {S: 'DistProfile'},
            certificateUuid: {S: 'cert-uuid-dist'},
            provisioningProfileBase64: {S: 'base64dist'},
            teamIdentifier: {S: 'team-dist'},
          },
        ],
      } as QueryCommandOutput),
    }

    const result = await getSigningConfigs(ddbClient, 'tableName', 'app-uuid')
    assert.isDefined(result.developmentConfig)
    assert.isDefined(result.distributionConfig)
    assert.equal(result.developmentConfig.provisioningProfileName, 'DevProfile')
    assert.equal(result.distributionConfig.provisioningProfileName, 'DistProfile')
    assert.equal(result.developmentConfig.certificateUuid, 'cert-uuid-dev')
    assert.equal(result.distributionConfig.certificateUuid, 'cert-uuid-dist')
  })

  it('returns only development config when only development exists', async () => {
    const ddbClient = {
      query: async () => ({
        $metadata: {},
        Items: [
          {
            pk: {S: 'app-uuid'},
            sk: {S: 'development'},
            provisioningProfileExpirationDate: {S: new Date(Date.now() + 100000).toISOString()},
            provisioningProfileName: {S: 'DevProfile'},
            certificateUuid: {S: 'cert-uuid-dev'},
            provisioningProfileBase64: {S: 'base64dev'},
            teamIdentifier: {S: 'team-dev'},
          },
        ],
      } as QueryCommandOutput),
    }

    const result = await getSigningConfigs(ddbClient, 'tableName', 'app-uuid')
    assert.isDefined(result.developmentConfig)
    assert.isUndefined(result.distributionConfig)
    assert.equal(result.developmentConfig.provisioningProfileName, 'DevProfile')
    assert.equal(result.developmentConfig.certificateUuid, 'cert-uuid-dev')
  })

  it('returns only distribution config when only distribution exists', async () => {
    const ddbClient = {
      query: async () => ({
        $metadata: {},
        Items: [
          {
            pk: {S: 'app-uuid'},
            sk: {S: 'distribution'},
            provisioningProfileExpirationDate: {S: new Date(Date.now() + 200000).toISOString()},
            provisioningProfileName: {S: 'DistProfile'},
            certificateUuid: {S: 'cert-uuid-dist'},
            provisioningProfileBase64: {S: 'base64dist'},
            teamIdentifier: {S: 'team-dist'},
          },
        ],
      } as QueryCommandOutput),
    }

    const result = await getSigningConfigs(ddbClient, 'tableName', 'app-uuid')
    assert.isUndefined(result.developmentConfig)
    assert.isDefined(result.distributionConfig)
    assert.equal(result.distributionConfig.provisioningProfileName, 'DistProfile')
    assert.equal(result.distributionConfig.certificateUuid, 'cert-uuid-dist')
  })

  it('returns empty configs when no items exist', async () => {
    const ddbClient = {
      query: async () => ({
        $metadata: {},
        Items: [],
      } as QueryCommandOutput),
    }

    const result = await getSigningConfigs(ddbClient, 'tableName', 'app-uuid')
    assert.isUndefined(result.developmentConfig)
    assert.isUndefined(result.distributionConfig)
  })
})

describe('createSigningInfoFromSeparateData', () => {
  it('returns signing info with valid certificate and config', () => {
    const config = {
      accountUuid: 'account-uuid',
      appUuid: 'app-uuid',
      certificateUuid: 'cert-uuid',
      provisioningProfileBase64: 'base64',
      provisioningProfileExpirationDate: new Date(Date.now() + 100000).toISOString(),
      provisioningProfileName: 'ProfileName',
      teamIdentifier: 'team-id',
      deviceUdids: ['device-uuid-1', 'device-uuid-2'],
      entitlements: {
        'com.apple.developer.team-identifier': 'team-id',
        'application-identifier': 'team-id.com.example.app',
      },
    }
    const certificateData = {
      certificateCommonName: 'CertName',
      certificateExpirationDate: new Date(Date.now() + 200000).toISOString(),
      cerCertificateBase64: '',
      p12CertificateBase64: '',
      p12CertificatePassword: '',
      certificateSigningRequestBase64: '',
      certificateSigningRequestPrivateKeyBase64: '',
      certificateUuid: 'cert-uuid',
      signingType: 'development' as AppleSigningType,
    }
    const availableCertificates = [
      {
        certificateUuid: 'uuid1',
        certificateCommonName: 'Cert1',
        certificateExpirationDate: new Date(Date.now() + 300000).toISOString(),
        signingType: 'development' as AppleSigningType,
      },
    ]

    const result = createSigningInfoFromSeparateData(config, certificateData, availableCertificates)
    assert.equal(result.certificateUuid, 'cert-uuid')
    assert.equal(result.certificateCommonName, 'CertName')
    assert.equal(result.provisioningProfileName, 'ProfileName')
    assert.equal(result.status, 'valid')
    assert.deepEqual(result.availableCertificates, availableCertificates)
    assert.instanceOf(result.certificateExpiration, Date)
    assert.instanceOf(result.provisioningProfileExpiration, Date)
  })

  it('returns only availableCertificates when config and certificateData are missing', () => {
    const availableCertificates = [
      {
        certificateUuid: 'uuid1',
        certificateCommonName: 'Cert1',
        certificateExpirationDate: new Date(Date.now() + 300000).toISOString(),
        signingType: 'development' as AppleSigningType,
      },
    ]
    const result = createSigningInfoFromSeparateData(undefined, undefined, availableCertificates)
    assert.deepEqual(result, {availableCertificates})
  })

  it('returns expired status when certificate and profile are expired', () => {
    const config = {
      accountUuid: 'account-uuid',
      appUuid: 'app-uuid',
      certificateUuid: 'cert-uuid',
      provisioningProfileBase64: 'base64',
      provisioningProfileExpirationDate: new Date(Date.now() - 100000).toISOString(),
      provisioningProfileName: 'ProfileName',
      teamIdentifier: 'team-id',
      deviceUdids: ['device-uuid-1'],
      entitlements: {
        'com.apple.developer.team-identifier': 'team-id',
      },
    }
    const certificateData = {
      certificateCommonName: 'CertName',
      certificateExpirationDate: new Date(Date.now() - 200000).toISOString(),
      cerCertificateBase64: '',
      p12CertificateBase64: '',
      p12CertificatePassword: '',
      certificateSigningRequestBase64: '',
      certificateSigningRequestPrivateKeyBase64: '',
      certificateUuid: 'cert-uuid',
      signingType: 'development' as AppleSigningType,
    }
    const availableCertificates: any[] = []
    const result = createSigningInfoFromSeparateData(config, certificateData, availableCertificates)
    assert.equal(result.status, 'both-signing-files-expired')
  })

  it('returns certificate-expired status when only certificate is expired', () => {
    const config = {
      accountUuid: 'account-uuid',
      appUuid: 'app-uuid',
      certificateUuid: 'cert-uuid',
      provisioningProfileBase64: 'base64',
      provisioningProfileExpirationDate: new Date(Date.now() + 100000).toISOString(),
      provisioningProfileName: 'ProfileName',
      teamIdentifier: 'team-id',
      deviceUdids: ['device-uuid-1', 'device-uuid-2'],
      entitlements: {
        'com.apple.developer.team-identifier': 'team-id',
        'get-task-allow': true,
      },
    }
    const certificateData = {
      certificateCommonName: 'CertName',
      certificateExpirationDate: new Date(Date.now() - 200000).toISOString(),
      cerCertificateBase64: '',
      p12CertificateBase64: '',
      p12CertificatePassword: '',
      certificateSigningRequestBase64: '',
      certificateSigningRequestPrivateKeyBase64: '',
      certificateUuid: 'cert-uuid',
      signingType: 'development' as AppleSigningType,
    }
    const availableCertificates: any[] = []
    const result = createSigningInfoFromSeparateData(config, certificateData, availableCertificates)
    assert.equal(result.status, 'certificate-expired')
  })

  it('returns provisioning-profile-expired status when only profile is expired', () => {
    const config = {
      accountUuid: 'account-uuid',
      appUuid: 'app-uuid',
      certificateUuid: 'cert-uuid',
      provisioningProfileBase64: 'base64',
      provisioningProfileExpirationDate: new Date(Date.now() - 100000).toISOString(),
      provisioningProfileName: 'ProfileName',
      teamIdentifier: 'team-id',
      deviceUdids: [],
      entitlements: {
        'aps-environment': 'production',
      },
    }
    const certificateData = {
      certificateCommonName: 'CertName',
      certificateExpirationDate: new Date(Date.now() + 200000).toISOString(),
      cerCertificateBase64: '',
      p12CertificateBase64: '',
      p12CertificatePassword: '',
      certificateSigningRequestBase64: '',
      certificateSigningRequestPrivateKeyBase64: '',
      certificateUuid: 'cert-uuid',
      signingType: 'development' as AppleSigningType,
    }
    const availableCertificates: any[] = []
    const result = createSigningInfoFromSeparateData(config, certificateData, availableCertificates)
    assert.equal(result.status, 'provisioning-profile-expired')
  })
})

describe('getCertificatesForAccount', () => {
  it('returns certificate info for valid account', async () => {
    const ddbClient = {
      query: async () => ({
        $metadata: {},
        Items: [
          {
            pk: {S: 'account-uuid'},
            sk: {S: 'cert-uuid-1'},
            certificateCommonName: {S: 'Cert1'},
            certificateExpirationDate: {S: new Date(Date.now() + 100000).toISOString()},
            signingType: {S: 'development'},
          },
          {
            pk: {S: 'account-uuid'},
            sk: {S: 'cert-uuid-2'},
            certificateCommonName: {S: 'Cert2'},
            certificateExpirationDate: {S: new Date(Date.now() + 200000).toISOString()},
            signingType: {S: 'distribution'},
          },
        ],
      }),
    }
    const result = await getCertificatesForAccount(ddbClient, 'tableName', 'account-uuid')
    assert.lengthOf(result, 2)
    assert.equal(result[0].certificateCommonName, 'Cert1')
    assert.equal(result[1].certificateCommonName, 'Cert2')
    assert.equal(result[0].signingType, 'development')
    assert.equal(result[1].signingType, 'distribution')
  })

  it('returns empty array when no certificates exist', async () => {
    const allItems = [
      {
        pk: {S: 'account-uuid-2'},
        sk: {S: 'cert-uuid-1'},
        certificateCommonName: {S: 'Cert1'},
        certificateExpirationDate: {S: new Date(Date.now() + 100000).toISOString()},
        signingType: {S: 'development'},
      },
      {
        pk: {S: 'account-uuid-2'},
        sk: {S: 'cert-uuid-2'},
        certificateCommonName: {S: 'Cert2'},
        certificateExpirationDate: {S: new Date(Date.now() + 200000).toISOString()},
        signingType: {S: 'distribution'},
      },
      {
        pk: {S: 'account-uuid-2'},
        sk: {S: 'cert-uuid-3'},
        certificateCommonName: {S: 'Cert3'},
        certificateExpirationDate: {S: new Date(Date.now() + 300000).toISOString()},
        signingType: {S: 'development'},
      },
    ]

    const ddbClient = {
      query: async input => ({
        $metadata: {},
        Items: allItems.filter(item => item.pk.S === input.ExpressionAttributeValues![':pk'].S),
      }),
    }
    const result = await getCertificatesForAccount(ddbClient, 'tableName', 'account-uuid')
    assert.deepEqual(result, [])
  })
})

describe('getAuthKeyInfo', () => {
  it('returns auth key info for valid app', async () => {
    const ddbClient = {
      query: async () => ({
        $metadata: {},
        Items: [
          {
            pk: {S: 'app-uuid'},
            sk: {S: 'auth-key-uuid'},
            keyId: {S: 'KEYID123'},
            issuerId: {S: 'ISSUER456'},
            authKeyFileName: {S: 'AuthKeyFile.p8'},
          },
        ],
      }),
    }
    const result = await getAuthKeyInfo(ddbClient, 'tableName', 'app-uuid')
    assert.isDefined(result)
    assert.equal(result.keyId, 'KEYID123')
    assert.equal(result.issuerId, 'ISSUER456')
    assert.equal(result.keyFileName, 'AuthKeyFile.p8')
  })

  it('returns undefined when no auth key exists', async () => {
    const ddbClient = {
      query: async () => ({
        $metadata: {},
        Items: [],
      }),
    }
    const result = await getAuthKeyInfo(ddbClient, 'tableName', 'app-uuid')
    assert.isUndefined(result)
  })
})

describe('createSigningInfoFromConfig', () => {
  it('returns signing info for valid config and certificate', async () => {
    const config = {
      accountUuid: 'account-uuid',
      appUuid: 'app-uuid',
      certificateUuid: 'cert-uuid',
      provisioningProfileBase64: 'base64',
      provisioningProfileExpirationDate: new Date(Date.now() + 100000).toISOString(),
      provisioningProfileName: 'ProfileName',
      teamIdentifier: 'team-id',
      deviceUdids: ['device-uuid-1', 'device-uuid-2'],
      entitlements: {
        'com.apple.developer.team-identifier': 'team-id',
        'application-identifier': 'team-id.com.example.app',
      },
    }
    const availableCertificates = [
      {
        certificateUuid: 'cert-uuid',
        certificateCommonName: 'CertName',
        certificateExpirationDate: new Date(Date.now() + 200000).toISOString(),
        signingType: 'development' as AppleSigningType,
      },
    ]
    const result = await createSigningInfoFromConfig(
      config, 'development' as AppleSigningType, availableCertificates
    )
    assert.equal(result.certificateCommonName, 'CertName')
    assert.equal(result.provisioningProfileName, 'ProfileName')
    assert.equal(result.status, 'valid')
    assert.deepEqual(result.availableCertificates, availableCertificates)
    assert.instanceOf(result.certificateExpiration, Date)
    assert.instanceOf(result.provisioningProfileExpiration, Date)
  })

  it('returns only availableCertificates when config is missing', async () => {
    const availableCertificates = [
      {
        certificateUuid: 'uuid1',
        certificateCommonName: 'Cert1',
        certificateExpirationDate: new Date(Date.now() + 300000).toISOString(),
        signingType: 'development' as AppleSigningType,
      },
    ]
    const result = await createSigningInfoFromConfig(
      undefined, 'development' as AppleSigningType, availableCertificates
    )
    assert.deepEqual(result, {availableCertificates})
  })

  it('returns only availableCertificates when certificateUuid is missing', async () => {
    const config = {
      accountUuid: 'account-uuid',
      appUuid: 'app-uuid',
      certificateUuid: 'missing-cert-uuid',
      provisioningProfileBase64: 'base64',
      provisioningProfileExpirationDate: new Date(Date.now() + 100000).toISOString(),
      provisioningProfileName: 'ProfileName',
      teamIdentifier: 'team-id',
      deviceUdids: ['device-uuid-1'],
      entitlements: {
        'com.apple.developer.team-identifier': 'team-id',
      },
    }
    const availableCertificates = [
      {
        certificateUuid: 'uuid1',
        certificateCommonName: 'Cert1',
        certificateExpirationDate: new Date(Date.now() + 300000).toISOString(),
        signingType: 'development' as AppleSigningType,
      },
    ]
    const result = await createSigningInfoFromConfig(
      config, 'development' as AppleSigningType, availableCertificates
    )
    assert.deepEqual(result, {availableCertificates})
  })

  it('returns undefined when both config and availableCertificates are missing', async () => {
    const result = await createSigningInfoFromConfig(
      undefined, 'development' as AppleSigningType, []
    )
    assert.isUndefined(result)
  })
})

describe('validate permission type', () => {
  it('returns success when all permission fields are valid', () => {
    const permissions: Permissions = {
      camera: {requestStatus: 'REQUESTED', usageDescription: 'Camera permission'},
      location: {requestStatus: 'REQUESTED', usageDescription: 'Location permission'},
      microphone: {requestStatus: 'REQUESTED', usageDescription: 'Microphone permission'},
    }
    assert.isObject(permissions)
  })

  it('returns success when leave out one or more fields', () => {
    const permissions: Permissions = {
      camera: {requestStatus: 'REQUESTED', usageDescription: 'Camera permission'},
      location: {requestStatus: 'REQUESTED', usageDescription: 'Location permission'},
    }
    assert.isObject(permissions)
  })

  it('returns success when permissions is empty', () => {
    const permissions: Permissions = {}
    assert.isObject(permissions)
  })

  it('returns success when usageDescription is not provided', () => {
    const permissions: Permissions = {
      camera: {requestStatus: 'REQUESTED'},
      location: {requestStatus: 'REQUESTED'},
      microphone: {requestStatus: 'REQUESTED'},
    }
    assert.isObject(permissions)
  })

  it('should throw when a permission field is invalid', () => {
    const permissions: Permissions = {
      camera: {requestStatus: 'REQUESTED', usageDescription: 'Camera permission'},
      location: {requestStatus: 'REQUESTED', usageDescription: 'Location permission'},
      // @ts-expect-error invalid permission field
      invalid: {requestStatus: 'REQUESTED', usageDescription: 'Microphone permission'},
    }
    assert.isObject(permissions)
  })
})
describe('validatePermissionUsageDescription', () => {
  it('succeeds on empty string', async () => {
    assert.equal(validatePermissionUsageDescriptionUtil(''), 'success')
  })
  it('fails with tab character', async () => {
    assert.equal(validatePermissionUsageDescriptionUtil('Example\tApp'), 'invalid-char')
  })
  it('fails with newline character', async () => {
    assert.equal(validatePermissionUsageDescriptionUtil('Example\nApp'), 'invalid-char')
  })
  it('fails with character that needs escape', async () => {
    assert.equal(validatePermissionUsageDescriptionUtil('Lucas" App'), 'char-needs-escape')
    assert.equal(validatePermissionUsageDescriptionUtil('Lucas& App'), 'char-needs-escape')
    assert.equal(validatePermissionUsageDescriptionUtil('Lucas < App'), 'char-needs-escape')
    assert.equal(validatePermissionUsageDescriptionUtil('Lucas > App'), 'char-needs-escape')

    // eslint-disable-next-line quotes
    assert.equal(validatePermissionUsageDescriptionUtil("Lucas ' App"), 'char-needs-escape')
  })
  it('succeeds with escaped characters', async () => {
    assert.equal(validatePermissionUsageDescriptionUtil('Lucas\\\' App'), 'success')

    /* eslint-disable no-useless-escape */
    assert.equal(validatePermissionUsageDescriptionUtil('Lucas \\\& App'), 'success')
    assert.equal(validatePermissionUsageDescriptionUtil('Lucas \\\< App'), 'success')
    assert.equal(validatePermissionUsageDescriptionUtil('Lucas \\\> App'), 'success')
    assert.equal(validatePermissionUsageDescriptionUtil('Lucas \\\" App'), 'success')
    /* eslint-enable no-useless-escape */
  })
  it('fails with unicode chars', async () => {
    assert.equal(validatePermissionUsageDescriptionUtil('My U+8888 App'), 'unicode-char')
    assert.equal(validatePermissionUsageDescriptionUtil('My U+AB8DAAAAAA App'), 'unicode-char')
    assert.equal(validatePermissionUsageDescriptionUtil('My U+ab88A App'), 'unicode-char')
    assert.equal(validatePermissionUsageDescriptionUtil('My U+8Aab88A App'), 'unicode-char')
  })
  it('succeeds with escaped unicode chars', async () => {
    assert.equal(validatePermissionUsageDescriptionUtil('My \u8888 App'), 'success')
    assert.equal(validatePermissionUsageDescriptionUtil('My \uAB8DAAAAAA App'), 'success')
    assert.equal(validatePermissionUsageDescriptionUtil('My \uab88A App'), 'success')
    assert.equal(validatePermissionUsageDescriptionUtil('My \u8Aab88A App'), 'success')
  })
  it('fails with leading or trailing whitespace', async () => {
    assert.equal(
      validatePermissionUsageDescriptionUtil(' My App'), 'leading-or-trailing-whitespace'
    )
    assert.equal(
      validatePermissionUsageDescriptionUtil(' My App '), 'leading-or-trailing-whitespace'
    )
    assert.equal(
      validatePermissionUsageDescriptionUtil('My App '), 'leading-or-trailing-whitespace'
    )
  })
  it('returns mleading-or-trailing-whitespace for empty or whitespace-only strings', () => {
    const cases = [' ', '   ']
    cases.forEach((str) => {
      assert.equal(validatePermissionUsageDescriptionUtil(str), 'leading-or-trailing-whitespace')
    })
  })
  it('returns success for normal sentences with punctuation and spaces', () => {
    const cases = [
      'We need access to your camera to let you take photos.',
      'Your location helps us show nearby restaurants!',
      'Enable microphone access — this lets you record voice notes.',
      'Bluetooth access is required to connect to nearby devices.',
    ]
    cases.forEach((str) => {
      assert.equal(validatePermissionUsageDescriptionUtil(str), 'success')
    })
  })
  it('returns success for strings containing numbers and symbols', () => {
    const cases = [
      'Access to Bluetooth 2.0 devices is required.',
      'Allow access so you can share #moments with friends :)',
      'Your PIN (4-6 digits) is needed to secure your account.',
    ]
    cases.forEach((str) => {
      assert.equal(validatePermissionUsageDescriptionUtil(str), 'success')
    })
  })
  it('returns success for strings with emojis and unicode characters', () => {
    const cases = [
      'Take a 📸 to upload your profile photo.',
      'Allow access so you can share moments ❤️ with friends.',
      '位置情報を利用して近くのお店を表示します。',  // Japanese
      'Utilisez votre caméra pour scanner les QR codes.',  // French
    ]
    cases.forEach((str) => {
      assert.equal(validatePermissionUsageDescriptionUtil(str), 'success')
    })
  })
  it('returns too-long for strings exceeding the max character limit', () => {
    const longString = 'a'.repeat(NAE_PERMISSION_USAGE_DESCRIPTION_MAX_CHARACTERS + 1)
    assert.equal(validatePermissionUsageDescriptionUtil(longString), 'too-long')
  })
  it('returns success for strings exactly at the max character limit', () => {
    const maxLengthString = 'a'.repeat(NAE_PERMISSION_USAGE_DESCRIPTION_MAX_CHARACTERS)
    assert.equal(validatePermissionUsageDescriptionUtil(maxLengthString), 'success')
  })
  it('returns invalid-char for strings containing newlines', () => {
    const str = 'Allow access to your camera.\nThis lets you scan barcodes.'
    assert.equal(validatePermissionUsageDescriptionUtil(str), 'invalid-char')
  })
  it('returns invalid-char for strings containing tabs', () => {
    const str = 'Enable\taccess to microphone.'
    assert.equal(validatePermissionUsageDescriptionUtil(str), 'invalid-char')
  })
  it('returns invalid-char for strings containing carriage returns', () => {
    const str = 'Enable access to microphone.\rMore info here.'
    assert.equal(validatePermissionUsageDescriptionUtil(str), 'invalid-char')
  })
  it('returns char-needs-escape for strings containing quotes and apostrophes', () => {
    const str = 'We need access to your friends\' photos for "shared albums".'
    assert.equal(validatePermissionUsageDescriptionUtil(str), 'char-needs-escape')
  })
  it('returns char-needs-escape for strings containing angle brackets', () => {
    const str = 'Grant access so <feature> can work properly.'
    assert.equal(validatePermissionUsageDescriptionUtil(str), 'char-needs-escape')
  })
  it('returns success for strings containing SQL-like content', () => {
    const str = 'Access required for user_id=123; DROP TABLE users;'
    assert.equal(validatePermissionUsageDescriptionUtil(str), 'success')
  })
  it('returns missing-letter-or-digit for strings containing only non-printable characters', () => {
    const str = '\u0000\u0001\u0002'  // null + control chars
    assert.equal(validatePermissionUsageDescriptionUtil(str), 'missing-letter-or-digit')
  })
  it('returns unicode-char for strings containing bidi override characters', () => {
    const str = 'Hello\u202EWorld'
    assert.equal(validatePermissionUsageDescriptionUtil(str), 'unicode-char')
  })
  it('returns unicode-char for strings containing zero-width characters', () => {
    const str = 'Hello\u200BWorld'
    assert.equal(validatePermissionUsageDescriptionUtil(str), 'unicode-char')
  })
  it('returns unicode-char for strings containing line/paragraph separators', () => {
    const str = 'Hello\u2028World'
    assert.equal(validatePermissionUsageDescriptionUtil(str), 'unicode-char')
  })
  it('returns unicode-char for strings containing private-use characters', () => {
    const str = 'Hello\uE000World'
    assert.equal(validatePermissionUsageDescriptionUtil(str), 'unicode-char')
  })
})

describe('getCsrPem', () => {
  it('converts short base64 string to PEM format', () => {
    const base64Input = 'SGVsbG9Xb3JsZA=='  // 'HelloWorld' in base64
    const expectedOutput = `-----BEGIN CERTIFICATE REQUEST-----
SGVsbG9Xb3JsZA==
-----END CERTIFICATE REQUEST-----
`

    const result = getCsrPem(base64Input)
    assert.equal(result, expectedOutput)
  })

  it('splits long base64 string into 64-character lines', () => {
    // Create a 128-character base64 string (2 lines when split)
    const base64Input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/' +
                       'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'

    const expectedOutput = `-----BEGIN CERTIFICATE REQUEST-----
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
-----END CERTIFICATE REQUEST-----
`

    const result = getCsrPem(base64Input)
    assert.equal(result, expectedOutput)
  })

  it('handles base64 string that is exactly 64 characters', () => {
    const base64Input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/'
    const expectedOutput = `-----BEGIN CERTIFICATE REQUEST-----
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
-----END CERTIFICATE REQUEST-----
`

    const result = getCsrPem(base64Input)
    assert.equal(result, expectedOutput)
  })

  it('handles base64 string with length not divisible by 64', () => {
    // 70 character string - should result in one 64-char line and one 6-char line
    const base64Input = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/ABCDEF'
    const expectedOutput = `-----BEGIN CERTIFICATE REQUEST-----
ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/
ABCDEF
-----END CERTIFICATE REQUEST-----
`

    const result = getCsrPem(base64Input)
    assert.equal(result, expectedOutput)
  })

  it('handles empty string input', () => {
    const base64Input = ''
    const expectedOutput = `-----BEGIN CERTIFICATE REQUEST-----

-----END CERTIFICATE REQUEST-----
`

    const result = getCsrPem(base64Input)
    assert.equal(result, expectedOutput)
  })

  it('handles realistic CSR base64 input', () => {
    // Simulate a more realistic (but shorter) CSR base64 string
    const base64Input = 'MIICXTCCAUUCAQAwGTEXMBUGA1UEAwwOdGVzdC5leGFtcGxlLmNvbTCCASIwDQYJ' +
                       'KoZIhvcNAQEBBQADggEPADCCAQoCggEBAL4d8TGz5QHrU8tP5wP+JKVqR3Xt2nWl'

    const expectedOutput = `-----BEGIN CERTIFICATE REQUEST-----
MIICXTCCAUUCAQAwGTEXMBUGA1UEAwwOdGVzdC5leGFtcGxlLmNvbTCCASIwDQYJ
KoZIhvcNAQEBBQADggEPADCCAQoCggEBAL4d8TGz5QHrU8tP5wP+JKVqR3Xt2nWl
-----END CERTIFICATE REQUEST-----
`

    const result = getCsrPem(base64Input)
    assert.equal(result, expectedOutput)
  })

  it('preserves valid base64 characters including padding', () => {
    const base64Input = 'dGVzdA=='  // 'test' in base64 with padding
    const expectedOutput = `-----BEGIN CERTIFICATE REQUEST-----
dGVzdA==
-----END CERTIFICATE REQUEST-----
`

    const result = getCsrPem(base64Input)
    assert.equal(result, expectedOutput)
  })

  it('handles very long base64 string (multiple 64-char lines)', () => {
    // Create a 200+ character string to test multiple line breaks
    const longBase64 = 'A'.repeat(200)
    const result = getCsrPem(longBase64)

    // Should start and end with proper PEM headers
    assert.isTrue(result.startsWith('-----BEGIN CERTIFICATE REQUEST-----\n'))
    assert.isTrue(result.endsWith('\n-----END CERTIFICATE REQUEST-----\n'))

    // Split the content between headers and check line lengths
    const lines = result.split('\n')
    const contentLines = lines.slice(1, -2)  // Remove header, footer, and empty lines

    // All lines except potentially the last should be 64 characters
    for (let i = 0; i < contentLines.length - 1; i++) {
      assert.equal(contentLines[i].length, 64,
        `Line ${i + 1} should be 64 characters, but was ${contentLines[i].length}`)
    }

    // Last line should be <= 64 characters
    const lastLine = contentLines[contentLines.length - 1]
    assert.isAtMost(lastLine.length, 64,
      `Last line should be <= 64 characters, but was ${lastLine.length}`)
  })
})
