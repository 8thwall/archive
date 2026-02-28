// @attr[](data = "@bazel_tools//tools/jdk:current_java_runtime")
// @attr(target_compatible_with = JAVA_TOOLCHAIN_COMPATIBLE)

import path from 'path'
import {promises as fs} from 'fs'

import {streamSpawn} from '@nia/c8/cli/proc'

type JavaToolBinary = 'keytool'

type GenerateKeystoreOptions = {
  keystorePath: string
  keyAndKeystorePassword: string
  keyAlias: string
  validityInDays?: number
  name?: string
  organization?: string
  organizationUnit?: string
  city?: string
  state?: string
  country?: string
}

const runfilePath = (filePath: string) => {
  if (!process.env.RUNFILES_DIR) {
    throw new Error('RUNFILES_DIR environment variable is not set')
  }

  return path.join(process.env.RUNFILES_DIR, filePath)
}

/**
 * The Java path may vary depending on the host machine. For example, on macOS, the rules_java
 * directory looks like: "rules_java~~toolchains~remotejdk11_macos_aarch64/".
 */
const getToolPath = async (tool: JavaToolBinary) => {
  const runtimeDirFiles = await fs.readdir(runfilePath(''))
  const rulesJavaPath = runtimeDirFiles.find(file => file.startsWith('rules_java'))
  if (!rulesJavaPath) {
    throw new Error('Java toolchain, begining with `rules_java` path not found in RUNFILES_DIR')
  }

  return runfilePath(`${rulesJavaPath}/bin/${tool}`)
}

const createKeyAndKeyStoreIfDoesNotExist = async (options: GenerateKeystoreOptions) => {
  const keytoolPath = await getToolPath('keytool')
  if (!keytoolPath || !(await fs.stat(keytoolPath))) {
    throw new Error('Keytool path not found, please check your environment.')
  }

  const keystorePath = path.resolve(options.keystorePath)
  const keystoreDir = path.dirname(keystorePath)
  await fs.mkdir(keystoreDir, {recursive: true})

  const sanitizeInput = (input?: string): string => {
    if (!input) {
      return ''
    }

    // Allow only alphanumeric characters, spaces, and common symbols
    const sanitized = input.replace(/[^a-zA-Z0-9\s.,-]/g, '')
    return sanitized
  }

  const dname = [
    `CN=${sanitizeInput(options.name) || 'Default Name'}`,
    `OU=${sanitizeInput(options.organizationUnit) || 'Default Organization'}`,
    `O=${sanitizeInput(options.organization) || 'Default Company'}`,
    `L=${sanitizeInput(options.city) || 'Default City'}`,
    `ST=${sanitizeInput(options.state) || 'Default State'}`,
    `C=${sanitizeInput(options.country) || 'Default Country'}`,
  ].join(', ')

  const commandArgs = [
    '-genkey',
    '-v',
    '-keystore', keystorePath,
    '-keyalg', 'RSA',
    '-keysize', '2048',
    '-validity', (options.validityInDays || 10000).toString(),
    '-alias', sanitizeInput(options.keyAlias),
    '-dname', dname,
    '-keypass', sanitizeInput(options.keyAndKeystorePassword),
    '-storepass', sanitizeInput(options.keyAndKeystorePassword),
  ]

  return streamSpawn(keytoolPath, commandArgs, true)
}

export {
  type GenerateKeystoreOptions,
  createKeyAndKeyStoreIfDoesNotExist,
}
