// @attr(target_compatible_with = CLIPPY_COMPATIBLE)
// @attr[](data = "@rules_rust//rust/toolchain:current_cargo_files")
// @attr[](data = "@rules_rust//rust/toolchain:current_cargo_clippy_files")
// @attr[](data = "@rules_rust//rust/toolchain:current_clippy_files")
// @attr[](data = "@rules_rust//rust/toolchain:current_rustc_files")

import {promises as fs} from 'fs'
import path from 'path'

import type {Task} from './task'
import {exec, runCommand} from './shell'
import {fail, fixable, OK, type TaskReport} from './report'
import {isFile} from './file'

const runfilePath = (filePath: string) => `${process.env.RUNFILES_DIR}/${filePath}`

// The rust toolchain path will vary by platform
//
// On osx with arm64 architecture, it looks like:
// 'rust_darwin_aarch64__aarch64-apple-darwin__stable_tools/rust_toolchain/bin'
const getRustToolchainPath = async () => {
  const runtimeDirFiles = await fs.readdir(runfilePath(''))
  const rulesRustPath = runtimeDirFiles.find(
    file => file.startsWith('rust_') && file.endsWith('_tools')
  )

  const toolPath = runfilePath(path.join(rulesRustPath!, 'rust_toolchain', 'bin'))

  try {
    await fs.access(toolPath)
    return toolPath
  } catch {
    return null
  }
}

const isRustFile = (file: string): boolean => file.endsWith('.rs')
const isCargoToml = (file: string): boolean => file.endsWith('Cargo.toml')

const findCargoToml = async (rustFilePath: string): Promise<string | null> => {
  let currentDir = path.dirname(rustFilePath)
  const root = path.resolve(path.sep)

  // Traverse up the directory tree looking for Cargo.toml
  while (currentDir !== root) {
    const cargoTomlPath = path.join(currentDir, 'Cargo.toml')

    try {
      // eslint-disable-next-line no-await-in-loop
      await fs.access(cargoTomlPath)
      return cargoTomlPath
    } catch {
      const parentDir = path.dirname(currentDir)
      if (parentDir === currentDir) {
        break
      }
      currentDir = parentDir
    }
  }

  return null
}

const runCargoClippy = async (cargoTomlPath: string, fix: boolean): Promise<TaskReport> => {
  if (!isFile(cargoTomlPath)) {
    return OK
  }

  const toolchainPath = await getRustToolchainPath()
  if (!toolchainPath) {
    return fail('Could not find Rust toolchain while running CARGO_CLIPPY task')
  }

  // NOTE: `cargo-clippy` requires some other rust toolchain binaries to be in the PATH

  const clippyPath = path.join(toolchainPath, 'cargo-clippy')
  if (!clippyPath) {
    return fail('Could not find cargo-clippy while running CARGO_CLIPPY task')
  }

  if (fix) {
    // https://users.rust-lang.org/t/cargo-clippy-fix-doesnt-fix-anything/68453/8
    return runCommand(
      `${clippyPath} -- --fix --allow-no-vcs --allow-dirty --manifest-path ${cargoTomlPath}`,
      {
        env: {
          ...process.env,
          PATH: `${toolchainPath}:${process.env.PATH}`,
        },
      }
    )
  }

  try {
    await exec(
      `${clippyPath} -- --manifest-path ${cargoTomlPath} -- -D warnings`,
      {
        env: {
          ...process.env,
          PATH: `${toolchainPath}:${process.env.PATH}`,
        },
      }
    )
    return OK
  } catch (e) {
    return fixable(`cd ${path.dirname(cargoTomlPath)} && cargo clippy --fix`)
  }
}

const runCargoClippyTask = async ({files, fix}: Task): Promise<TaskReport[]> => {
  const cargoTomlPaths = new Set<string>()

  for (const file of files) {
    if (isCargoToml(file)) {
      cargoTomlPaths.add(file)
    } else if (isRustFile(file)) {
      // eslint-disable-next-line no-await-in-loop
      const cargoTomlPath = await findCargoToml(file)
      if (cargoTomlPath) {
        cargoTomlPaths.add(cargoTomlPath)
      }
    }
  }

  if (cargoTomlPaths.size === 0) {
    return [OK]
  }

  // Run cargo-clippy in parallel on all unique Cargo.toml files
  const results = await Promise.all(
    Array.from(cargoTomlPaths).map(cargoTomlPath => runCargoClippy(cargoTomlPath, fix))
  )

  return results
}

export {
  runCargoClippyTask,
}
