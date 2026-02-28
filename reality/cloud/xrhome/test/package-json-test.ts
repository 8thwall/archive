import path from 'path'
import fs from 'fs'
import {assert} from 'chai'

const packageJsonPath = path.join(__dirname, '../package.json')

type Package = {
  dependencies: Record<string, string>
  devDependencies: Record<string, string>
}

const makeMessage = (
  name: string,
  version: string,
  expectedVersion: string
) => `\
Package ${name} is on old version ${version}, \
run npm install --save --legacy-peer-deps ${name}@${expectedVersion}`

const packageJson: Package = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'))

describe('package.json', () => {
  it('@aws-sdk packages are on the same version', async () => {
    const awsSdkPackages = Object.entries({
      ...packageJson.dependencies,
      ...packageJson.devDependencies,
    }).filter(([name]) => name.startsWith('@aws-sdk/'))

    assert.isNotEmpty(awsSdkPackages)

    const targetVersion = awsSdkPackages.reduce((max, [, version]) => (
      max > version ? max : version
    ), awsSdkPackages[0][1])

    awsSdkPackages.forEach(([name, version]) => {
      assert.strictEqual(version, targetVersion, makeMessage(name, version, targetVersion))
    })
  })
})
