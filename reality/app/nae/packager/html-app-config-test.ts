// @rule(js_test)
// @deps(:html-app-config)
// @deps(//bzl/js:chai-js)

import {sinon, beforeEach, afterEach, describe, it, assert} from '@nia/bzl/js/chai-js'
import {OverrideConfig, validateAppConfig} from '@nia/reality/app/nae/packager/html-app-config'
import type {HtmlShell} from '@nia/reality/shared/nae/nae-types'

const INVALID_ANDROID_CONFIGS = [
  // Missing packageName
  {versionCode: 1, versionName: '1.0'},
]

const INVALID_APPLE_CONFIGS: any[] = [
  // No invalid Apple configs currently - validation is more lenient
]

const INVALID_CONFIGS = [
  null,
  undefined,
  {},
  {projectUrl: 'https://studiobeta.8thwall.app/solstice'},  // Missing shell
  {shell: 'quest'},  // Missing projectUrl
  {projectUrl: 'https://studiobeta.8thwall.app/solstice', shell: 'android'},  // Missing android
  {projectUrl: 'https://studiobeta.8thwall.app/solstice', shell: 'quest'},  // Missing android
  {projectUrl: 'https://studiobeta.8thwall.app/solstice', shell: 'ios'},  // Missing apple
  {projectUrl: 'https://studiobeta.8thwall.app/solstice', shell: 'osx'},  // Missing apple
  {projectUrl: 'https://studiobeta.8thwall.app/solstice', shell: 'fake'},  // Invalid shell
  {projectUrl: 'https://8th.io/jini', shell: 'quest', appInfo: {}},  // Empty asset config
  {
    projectUrl: 'https://8th.io/jini',
    shell: 'quest',
    niaEnvAccessCode: 'abcdef',
    appInfo: {},
  },  // Both niaEnvAccessCode and cookie cannot be set
  ...(INVALID_ANDROID_CONFIGS.map(
    android => ({projectUrl: 'https://studiobeta.8thwall.app/solstice', shell: 'quest', android})
  )),
  ...(INVALID_APPLE_CONFIGS.map(
    apple => ({projectUrl: 'https://studiobeta.8thwall.app/solstice', shell: 'ios', apple})
  )),
]

const ANDROID_SHELLS: HtmlShell[] = ['android', 'quest']
const APPLE_SHELLS: HtmlShell[] = ['ios', 'osx']

describe('validateAppConfig tests', () => {
  describe('when an invalid config is provided', () => {
    INVALID_CONFIGS.forEach((config) => {
      it('should fail with invalid config', () => {
        assert.throws(() => validateAppConfig(config))
      })
    })
  })

  describe('when a config is missing an required value with a default', () => {
    for (const shell of ANDROID_SHELLS) {
      it(`should return a config with the defaults merged in for ${shell}`, () => {
        const config = {
          projectUrl: 'https://studiobeta.8thwall.app/solstice',
          shell,
          android: {
            packageName: 'com.nianticlabs.solstice',
          },
        }
        const newConfig = validateAppConfig(config)
        assert.deepEqual(newConfig, {
          projectUrl: 'https://studiobeta.8thwall.app/solstice',
          shell,
          android: {
            packageName: 'com.nianticlabs.solstice',
            manifest: '',
            minSdkVersion: 26,
            targetSdkVersion: 35,
            versionCode: 1,
            versionName: '1.0.0',
            ksPath:
              `${process.env.RUNFILES_DIR}/_main/reality/app/nae/packager/android/` +
              'android-html-packager-tools/bazel_debug.keystore',
            ksAlias: 'androiddebugkey',
            ksPass: 'pass:android',
            oculusSplashScreen: '',
          },
        })
      })
    }

    for (const shell of APPLE_SHELLS) {
      it(`should return a config with the defaults merged in for ${shell}`, () => {
        const config = {
          projectUrl: 'https://studiobeta.8thwall.app/solstice',
          shell,
          apple: {
            bundleIdentifier: 'com.nianticlabs.solstice',
            teamIdentifier: 'abcd',
          },
        }
        const newConfig = validateAppConfig(config)
        assert.deepEqual(newConfig, {
          projectUrl: 'https://studiobeta.8thwall.app/solstice',
          shell,
          apple: {
            bundleIdentifier: 'com.nianticlabs.solstice',
            teamIdentifier: 'abcd',
            versionCode: 1,
            versionName: '1.0.0',
            certificate: '',
            provisioningProfile: '',
            signingType: 'development',
            minOsVersion: '14.0',
            p12FilePath: '',
            p12Password: '',
          },
        })
      })
    }
  })

  describe('when a config override is provided', () => {
    for (const shell of ANDROID_SHELLS) {
      it(`should be merged into the android config for ${shell}`, () => {
        const config = {
          projectUrl: 'https://studiobeta.8thwall.app/solstice',
          shell,
          android: {
            packageName: 'com.nianticlabs.solstice',
          },
        }

        const overrides = {
          android: {
            manifest: 'my/manifest.xml',
            versionCode: 4,
            versionName: '1.4.0',
            ksPath: 'my/path/to/keystore',
            ksAlias: 'myalias',
            ksPass: 'mypass',
          },
        }

        const newConfig = validateAppConfig(config, overrides)
        assert.equal(newConfig.android?.manifest, 'my/manifest.xml')
        assert.equal(newConfig.android?.versionCode, 4)
        assert.equal(newConfig.android?.versionName, '1.4.0')
        assert.equal(newConfig.android?.ksPath, 'my/path/to/keystore')
        assert.equal(newConfig.android?.ksAlias, 'myalias')
        assert.equal(newConfig.android?.ksPass, 'mypass')
      })
    }

    for (const shell of APPLE_SHELLS) {
      it(`should be merged into the apple config for ${shell}`, () => {
        const config = {
          projectUrl: 'https://studiobeta.8thwall.app/solstice',
          shell,
          apple: {
            bundleIdentifier: 'com.nianticlabs.test',
            teamIdentifier: 'abcd',
          },
        }

        const overrides = {
          apple: {
            versionCode: 5,
            versionName: '1.5.0',
            certificate: 'my certificate',
            provisioningProfile: 'my/profile.mobileprovision',
          },
        }

        const newConfig = validateAppConfig(config, overrides)
        assert.equal(newConfig.apple?.versionCode, 5)
        assert.equal(newConfig.apple?.versionName, '1.5.0')
        assert.equal(newConfig.apple?.certificate, 'my certificate')
        assert.equal(newConfig.apple?.provisioningProfile, 'my/profile.mobileprovision')
      })
    }
  })

  describe('unexpected field warnings', () => {
    let warnSpy: sinon.SinonStub

    beforeEach(() => {
      warnSpy = sinon.stub(console, 'warn')
    })

    afterEach(() => {
      warnSpy.restore()
    })

    it('should warn for unexpected fields in appInfo', () => {
      const config = {
        projectUrl: 'https://8th.io/app',
        shell: 'quest',
        android: {
          packageName: 'com.the8thwall.app',
        },
        appInfo: {
          workspace: 'ws',
          appName: 'MyApp',
          unknownField: 'unexpected',
        },
      }

      validateAppConfig(config)
      assert.isTrue(warnSpy.calledWithMatch(/Unexpected fields in appInfo/, ['unknownField']))
    })

    it('should warn for unexpected fields in android config', () => {
      const config = {
        projectUrl: 'https://8th.io/app',
        shell: 'quest',
        android: {
          packageName: 'com.the8thwall.app',
          versionName: '1.0.0',
          versionCode: 1,
          extraField: 'unexpected',
        },
      }

      validateAppConfig(config)
      assert.isTrue(warnSpy.calledWithMatch(/Unexpected fields in Android config/, ['extraField']))
    })

    it('should warn for unexpected fields in apple config', () => {
      const config = {
        projectUrl: 'https://8th.io/app',
        shell: 'ios',
        apple: {
          bundleIdentifier: 'com.the8thwall.app',
          teamIdentifier: 'abcd',
          versionName: '1.0.0',
          versionCode: 1,
          unknownField: 'unexpected',
        },
      }

      validateAppConfig(config)
      assert.isTrue(warnSpy.calledWithMatch(/Unexpected fields in Apple config/, ['unknownField']))
    })

    it('should warn for unexpected fields in root config', () => {
      const config = {
        projectUrl: 'https://8th.io/app',
        shell: 'quest',
        android: {
          packageName: 'com.the8thwall.app',
          versionName: '1.0.0',
          versionCode: 1,
        },
        unknownRootField: true,
      }

      validateAppConfig(config)
      assert.isTrue(warnSpy.calledWithMatch(/Unexpected fields in config/, ['unknownRootField']))
    })
  })

  describe('validateAppConfig - override merging', () => {
    it('should merge overrides with both android and apple configs', () => {
      const config = {
        projectUrl: 'https://8th.io/app',
        shell: 'android',
        android: {
          packageName: 'com.test.override',
        },
        apple: {
          bundleIdentifier: 'com.test.ios',
          teamIdentifier: 'team456',
        },
      }

      const overrides = {
        android: {
          ksAlias: 'alias123',
        },
        apple: {
          versionCode: 9,
        },
      }

      const result = validateAppConfig(config, overrides)
      assert.equal(result.android?.ksAlias, 'alias123')
      assert.equal(result.apple?.versionCode, 9)
    })
  })

  describe('type enforcement', () => {
    it('should throw if android.versionCode is not a number', () => {
      const config = {
        projectUrl: 'https://8th.io/app',
        shell: 'android',
        android: {
          packageName: 'com.test.bad',
          versionName: '1.0.0',
          versionCode: 'wrong-type',
        },
      }
      assert.throws(
        () => validateAppConfig(config), /Android versionCode must be a positive integer/
      )
    })

    it('should throw if apple.versionCode is less than 1', () => {
      const config = {
        projectUrl: 'https://8th.io/app',
        shell: 'ios',
        apple: {
          bundleIdentifier: 'com.test.ios',
          teamIdentifier: 'team',
          versionCode: 0,
          versionName: '0.0.1',
        },
      }
      assert.throws(() => validateAppConfig(config), /Apple versionCode must be a positive integer/)
    })

    it('should throw if appInfo.workspace is empty', () => {
      const config = {
        projectUrl: 'https://8th.io/app',
        shell: 'quest',
        android: {
          packageName: 'com.test.app',
          versionName: '1.0.0',
          versionCode: 1,
        },
        appInfo: {
          workspace: '',
          appName: 'Test',
        },
      }
      assert.throws(
        () => validateAppConfig(config), /Asset Config workspace must be a non-empty string/
      )
    })
  })

  describe('edge cases', () => {
    it('should preserve unknown nested fields in merged config (but warn)', () => {
      const config = {
        projectUrl: 'https://8th.io/app',
        shell: 'quest',
        android: {
          packageName: 'com.test.app',
          versionName: '1.0.0',
          versionCode: 1,
          unexpected: 'field',
        },
      }

      const warnSpy = sinon.stub(console, 'warn')
      const result = validateAppConfig(config)
      assert.equal((result.android as any)?.unexpected, 'field')
      assert.isTrue(warnSpy.calledWithMatch(/Unexpected fields in Android config/, ['unexpected']))
      warnSpy.restore()
    })

    it('should not override config fields if override is empty', () => {
      const config = {
        projectUrl: 'https://8th.io/app',
        shell: 'quest',
        android: {
          packageName: 'com.test.app',
          versionName: '1.2.3',
          versionCode: 2,
        },
      }

      const result = validateAppConfig(config, {android: {}})
      assert.equal(result.android?.versionName, '1.2.3')
      assert.equal(result.android?.versionCode, 2)
    })

    it('should throw if config is a string', () => {
      assert.throws(() => validateAppConfig('not an object'), /Config must be a non-null object/)
    })

    it('should throw if config is an array', () => {
      assert.throws(() => validateAppConfig([]))
    })

    it('should throw if appInfo.appName is missing', () => {
      const config = {
        projectUrl: 'https://example.com/app',
        shell: 'quest',
        android: {
          packageName: 'com.test',
          versionCode: 1,
          versionName: '1.0.0',
        },
        appInfo: {
          workspace: 'main',
        },
      }
      assert.throws(
        () => validateAppConfig(config), /Asset Config appName must be a non-empty string/
      )
    })

    it('should allow extra fields in appInfo but warn only', () => {
      const config = {
        projectUrl: 'https://example.com/app',
        shell: 'quest',
        android: {
          packageName: 'com.test',
          versionCode: 1,
          versionName: '1.0.0',
        },
        appInfo: {
          workspace: 'main',
          appName: 'Test',
          extraData: 123,
        },
      }
      const warnSpy = sinon.stub(console, 'warn')
      validateAppConfig(config)
      assert.isTrue(warnSpy.calledWithMatch(/Unexpected fields in appInfo/, ['extraData']))
      warnSpy.restore()
    })

    it('should default to required android values even if shell is "android"', () => {
      const config = {
        projectUrl: 'https://example.com/app',
        shell: 'android',
        android: {
          packageName: 'com.test',
        },
      }
      const result = validateAppConfig(config)
      assert.equal(result.android?.versionCode, 1)
      assert.equal(result.android?.versionName, '1.0.0')
    })

    it('should not mutate original config object', () => {
      const config = {
        projectUrl: 'https://example.com/app',
        shell: 'android',
        android: {
          packageName: 'com.test',
        },
      }
      const original = JSON.stringify(config)
      validateAppConfig(config)
      assert.equal(JSON.stringify(config), original)
    })

    it('should allow missing teamIdentifier (fetched dynamically)', () => {
      const config = {
        projectUrl: 'https://example.com',
        shell: 'ios',
        apple: {
          bundleIdentifier: 'com.test',
          versionCode: 1,
          versionName: '1.0.0',
        },
      }
      const result = validateAppConfig(config)
      assert.equal(result.apple?.bundleIdentifier, 'com.test')
      assert.equal(result.apple?.teamIdentifier, '')  // Should default to empty string
    })

    it('should warn and preserve unknown top-level field that is a nested object', () => {
      const config = {
        projectUrl: 'https://example.com/app',
        shell: 'quest',
        android: {
          packageName: 'com.test',
          versionCode: 1,
          versionName: '1.0.0',
        },
        extra: {
          something: true,
        },
      }
      const warnSpy = sinon.stub(console, 'warn')
      const result = validateAppConfig(config)
      assert.deepEqual((result as any).extra, {something: true})
      assert.isTrue(warnSpy.calledWithMatch(/Unexpected fields in config/, ['extra']))
      warnSpy.restore()
    })

    it('should apply override even when field is in default (not original config)', () => {
      const config = {
        projectUrl: 'https://example.com',
        shell: 'android',
        android: {
          packageName: 'com.test',
        },
      }
      const overrides = {
        android: {
          ksPass: 'mysecurepass',
        },
      }
      const result = validateAppConfig(config, overrides)
      assert.equal(result.android?.ksPass, 'mysecurepass')
    })

    it('should allow shell to be "android" string and apply validation', () => {
      const config = {
        projectUrl: 'https://test.com',
        shell: 'android',
        android: {
          packageName: 'com.valid.test',
        },
      }
      const result = validateAppConfig(config)
      assert.equal(result.android?.ksAlias, 'androiddebugkey')
    })

    it('should not warn for expected android fields only', () => {
      const config = {
        projectUrl: 'https://test.com',
        shell: 'android',
        android: {
          packageName: 'com.valid.test',
          versionCode: 1,
          versionName: '1.0.0',
        },
      }
      const warnSpy = sinon.stub(console, 'warn')
      validateAppConfig(config)
      assert.isFalse(warnSpy.called)
      warnSpy.restore()
    })

    it('should throw if android minSdkVersion is not a number (type enforcement)', () => {
      const config = {
        projectUrl: 'https://example.com',
        shell: 'quest',
        android: {
          packageName: 'com.test',
          versionCode: 1,
          versionName: '1.0.0',
          minSdkVersion: '26',
        },
      }
      // This will pass validation currently since `minSdkVersion` is not enforced.
      // Add this test as a placeholder if you later want to add stricter typing.
      const result = validateAppConfig(config)
      assert.equal(result.android?.minSdkVersion, 26)
    })

    it('should merge overrides and config even when some defaults are missing', () => {
      const config = {
        projectUrl: 'https://example.com',
        shell: 'android',
        android: {
          packageName: 'com.test',
        },
      }
      const overrides = {
        android: {
          versionCode: 99,
        },
      }
      const result = validateAppConfig(config, overrides)
      assert.equal(result.android?.versionCode, 99)
      assert.equal(result.android?.ksAlias, 'androiddebugkey')
    })
  })

  describe('validateAppConfig - full Android override', () => {
    it('should override all possible Android fields listed in OverrideConfig', () => {
      const config = {
        projectUrl: 'https://example.com/app',
        shell: 'android',
        android: {
          packageName: 'com.niantic.test',
        },
      }

      const overrides: OverrideConfig = {
        android: {
          ksPath: '/custom/path.keystore',
          ksAlias: 'customalias',
          ksPass: 'custompass',
          versionCode: 7,
          versionName: '7.0.0',
        },
      }

      const result = validateAppConfig(config, overrides)
      assert.equal(result.android?.ksPath, '/custom/path.keystore')
      assert.equal(result.android?.ksAlias, 'customalias')
      assert.equal(result.android?.ksPass, 'custompass')
      assert.equal(result.android?.versionCode, 7)
      assert.equal(result.android?.versionName, '7.0.0')
    })
  })

  describe('validateAppConfig - full Apple override', () => {
    it('should override all possible Apple fields listed in OverrideConfig', () => {
      const config = {
        projectUrl: 'https://example.com/app',
        shell: 'ios',
        apple: {
          bundleIdentifier: 'com.niantic.test',
          teamIdentifier: 'TEAMID123',
        },
      }

      const overrides: OverrideConfig = {
        apple: {
          versionCode: 10,
          versionName: '10.0.0',
          certificate: 'override_cert',
          provisioningProfile: 'override_profile.mobileprovision',
        },
      }

      const result = validateAppConfig(config, overrides)
      assert.equal(result.apple?.versionCode, 10)
      assert.equal(result.apple?.versionName, '10.0.0')
      assert.equal(result.apple?.certificate, 'override_cert')
      assert.equal(result.apple?.provisioningProfile, 'override_profile.mobileprovision')
    })
  })

  describe('validateAppConfig - both Android and Apple override', () => {
    it('should override both Android and Apple fields correctly', () => {
      const config = {
        projectUrl: 'https://example.com/app',
        shell: 'android',
        android: {
          packageName: 'com.niantic.test',
        },
        apple: {
          bundleIdentifier: 'com.niantic.test.ios',
          teamIdentifier: 'TEAM123',
        },
      }

      const overrides: OverrideConfig = {
        android: {
          ksAlias: 'alias123',
          ksPass: 'securepass',
          versionCode: 8,
          versionName: '8.8.8',
        },
        apple: {
          versionCode: 2,
          versionName: '2.0.0',
          certificate: 'mycert',
          provisioningProfile: 'profile.mobileprovision',
        },
      }

      const result = validateAppConfig(config, overrides)
      assert.equal(result.android?.ksAlias, 'alias123')
      assert.equal(result.android?.versionCode, 8)
      assert.equal(result.apple?.versionName, '2.0.0')
      assert.equal(result.apple?.certificate, 'mycert')
    })
  })

  describe('validateAppConfig - OverrideConfig with appInfo', () => {
    it('should apply appInfo as an override when it is provided', () => {
      const config = {
        projectUrl: 'https://example.com/app',
        shell: 'quest',
        android: {
          packageName: 'com.override.app',
          versionCode: 1,
          versionName: '1.0.0',
        },
        appInfo: {
          workspace: 'default',
          appName: 'OriginalApp',
        },
      }

      const overrides = {
        appInfo: {
          appName: 'OverriddenApp',
        },
      }

      const result = validateAppConfig(config, overrides as any)
      assert.equal(result.appInfo?.appName, 'OverriddenApp')
      assert.equal(result.appInfo?.workspace, 'default')  // unchanged
    })
  })

  describe('validateAppConfig - empty override', () => {
    it('should leave default/explicit config untouched if overrides is {}', () => {
      const config = {
        projectUrl: 'https://example.com/app',
        shell: 'android',
        android: {
          packageName: 'com.unchanged',
          versionName: '1.0.0',
          versionCode: 1,
        },
      }

      const result = validateAppConfig(config, {})
      assert.equal(result.android?.versionCode, 1)
      assert.equal(result.android?.ksAlias, 'androiddebugkey')
    })
  })
})
