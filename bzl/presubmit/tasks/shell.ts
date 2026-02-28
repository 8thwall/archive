import {spawn, SpawnOptionsWithoutStdio} from 'child_process'

import {fail, OK} from './report'

/* eslint-disable no-console */

const outputCollector = () => {
  const output: string[] = []

  const write = (data: Buffer) => {
    const lines = data.toString().split('\n').map(e => e.substring(0, 100).trim()).filter(Boolean)
    output.push(...lines)
    while (output.length > 100) {
      output.shift()
    }
  }

  const read = () => output.map(e => `    ${e}`).join('\n').trim()

  return {
    write,
    read,
  }
}

const exec = async (
  command: string,
  options?: SpawnOptionsWithoutStdio
): Promise<void> => new Promise((resolve, reject) => {
  console.log('Running: ', command)
  const child = spawn('sh', ['-c', command], options)

  const output = outputCollector()

  child.stdout.on('data', output.write)
  child.stderr.on('data', output.write)

  child.on('close', (code) => {
    if (code !== 0) {
      console.error('Failed:  ', command)
      console.error(output.read())
      reject(new Error(`Command failed with exit code ${code}`))
    } else {
      console.log('Success: ', command)
      resolve()
    }
  })
})

const runCommand = async (command: string, options?: SpawnOptionsWithoutStdio) => {
  try {
    await exec(command, options)
    return OK
  } catch (e) {
    return fail(command)
  }
}

export {
  exec,
  runCommand,
}
