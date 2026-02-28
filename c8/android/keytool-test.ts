// @attr(target = "node")
// @attr(webpack_mode = "development")
// @attr(esnext = 1)

import path from 'path'
import fs from 'fs'

import {
  describe, it, assert, afterEach,
} from '@nia/bzl/js/chai-js'

import {
  type GenerateKeystoreOptions,
  createKeyAndKeyStoreIfDoesNotExist,
} from '@nia/c8/android/keytool'

describe('Keytool Tests', function KeytoolTests() {
  // The keytool command can take time to run while other tasks are running on the system.
  const testTimeoutMs = 10000
  this.timeout(testTimeoutMs)
  let keystoreFilePath: string | undefined
  const tmpDir = process.env.TEST_SRCDIR!

  afterEach(() => {
    if (!keystoreFilePath) {
      assert.fail('Make sure to set this value in a test, so keystores can be cleaned up')
      return
    }

    // Clean up the keystore file after each test
    const keystoreFullPath = path.resolve(keystoreFilePath)
    if (fs.existsSync(keystoreFullPath) && fs.lstatSync(keystoreFullPath).isFile()) {
      fs.unlinkSync(keystoreFullPath)
    }
  })

  it('can create a keystore and key with a relative path', async () => {
    keystoreFilePath = path.relative(process.cwd(), path.join(tmpDir, 'keystore.jks'))

    const options: GenerateKeystoreOptions = {
      keystorePath: keystoreFilePath,
      keyAndKeystorePassword: 'test-password',
      keyAlias: 'test-alias',
      validityInDays: 365,
      name: 'Test Name',
      organization: 'Test Organization',
      organizationUnit: 'Test Unit',
      city: 'Test City',
      state: 'Test State',
      country: 'Test Country',
    }
    const result = await createKeyAndKeyStoreIfDoesNotExist(options)

    if (!result) {
      assert.fail('Keytool command did not return a result')
      return
    }

    // Note: This binary logs successful output to stderr
    const {stdout, stderr} = result
    assert.isEmpty(stdout, 'No other information should be printed to stdout')
    assert.include(stderr, 'Generating 2,048 bit RSA key pair',
      'Key generation message should be present')
    assert.include(stderr, 'validity of 365 days',
      'Validity message should be present')
    assert.include(stderr, 'CN=Test Name',
      'Common Name should be present in the output')
    assert.include(stderr, 'OU=Test Unit',
      'Organization Unit should be present in the output')
    assert.include(stderr, 'O=Test Organization',
      'Organization should be present in the output')
    assert.include(stderr, 'L=Test City',
      'City should be present in the output')
    assert.include(stderr, 'ST=Test State',
      'State should be present in the output')
    assert.include(stderr, 'C=Test Country',
      'Country should be present in the output')

    const keystoreDir = path.dirname(path.resolve(options.keystorePath))
    assert.isTrue(fs.existsSync(keystoreDir), 'Keystore directory should exist')

    const stats = fs.statSync(keystoreFilePath)
    assert.isAbove(stats.size, 0, 'Keystore file should be greater than 0 bytes')
  })

  it('can create a keystore and key with an absolute path', async () => {
    keystoreFilePath = path.join(tmpDir, 'keystore.jks')

    const options: GenerateKeystoreOptions = {
      keystorePath: keystoreFilePath,
      keyAndKeystorePassword: 'test-password',
      keyAlias: 'test-alias',
      validityInDays: 10000,
      name: 'Name',
      organization: 'Organization',
      organizationUnit: 'Unit',
      city: 'City',
      state: 'State',
      country: 'Country',
    }

    const result = await createKeyAndKeyStoreIfDoesNotExist(options)

    if (!result) {
      assert.fail('Keytool command did not return a result')
      return
    }

    // Note: This binary logs successful output to stderr
    const {stdout, stderr} = result
    assert.isEmpty(stdout, 'No other information should be printed to stdout')
    assert.include(stderr, 'Generating 2,048 bit RSA key pair',
      'Key generation message should be present')
    assert.include(stderr, 'CN=Name',
      'Common Name should be present in the output')
    assert.include(stderr, 'OU=Unit',
      'Organization Unit should be present in the output')
    assert.include(stderr, 'O=Organization',
      'Organization should be present in the output')
    assert.include(stderr, 'L=City',
      'City should be present in the output')
    assert.include(stderr, 'ST=State',
      'State should be present in the output')
    assert.include(stderr, 'C=Country',
      'Country should be present in the output')

    const keystoreDir = path.dirname(path.resolve(options.keystorePath))
    assert.isTrue(fs.existsSync(keystoreDir), 'Keystore directory should exist')

    const stats = fs.statSync(keystoreFilePath)
    assert.isAbove(stats.size, 0, 'Keystore file should be greater than 0 bytes')
  })

  it('cannot create keystore with duplicate alias', async () => {
    keystoreFilePath = path.join(tmpDir, 'keystore.jks')

    const options: GenerateKeystoreOptions = {
      keystorePath: keystoreFilePath,
      keyAndKeystorePassword: 'test-password',
      keyAlias: 'test-alias',
      validityInDays: 10000,
      name: 'Name',
      organization: 'Organization',
      organizationUnit: 'Unit',
      city: 'City',
      state: 'State',
      country: 'Country',
    }

    const result1 = await createKeyAndKeyStoreIfDoesNotExist(options)
    if (!result1) {
      assert.fail('Keytool command did not return a result')
      return
    }

    try {
      await createKeyAndKeyStoreIfDoesNotExist(options)
      assert.fail('Expected an error to be thrown for duplicate alias')
    } catch (error) {
      assert.isTrue(
        error.stdout.includes('Key pair not generated, alias <test-alias> already exists'),
        'Error message should indicate that the alias already exists'
      )
    }
  })

  it('cannot create keystore from directory', async () => {
    // Trying to create a keystore with directory
    keystoreFilePath = tmpDir

    const options: GenerateKeystoreOptions = {
      keystorePath: keystoreFilePath,
      keyAndKeystorePassword: 'test-password',
      keyAlias: 'test-alias',
      validityInDays: 10000,
      name: 'Name',
      organization: 'Organization',
      organizationUnit: 'Unit',
      city: 'City',
      state: 'State',
      country: 'Country',
    }

    try {
      await createKeyAndKeyStoreIfDoesNotExist(options)
      assert.fail('Expected an error to be thrown for invalid path')
    } catch (error) {
      assert.isTrue(
        error.stdout.includes('java.io.FileNotFoundException'),
        'Error message should indicate that the file was not found'
      )
    }
  })
})
