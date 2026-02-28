#!/usr/local/bin/node
//
// Usage:
// $ ./upload-resource.js [--no-prompt=false] [--verbose=true] [--dry-run=false] [--skip-timestamp=false] /path/to/source [destination]
//
// Script to upload a version-stamped binary resource file to cdn.
const fs = require('fs')
const readline = require('readline')
const {promisify} = require('util')
const exec = promisify(require('child_process').exec)

// Get the process arguments as a js dictionary. Named arguments are keys to the dictionary.
// Unnamed arguments are available with their order preserved in '_ordered'.
//
// Example:
//
// ./upload-resource.js --no-prompt=false --dry-run=false --skip-timestamp=false /path/to/resource.file hosted.file --verbose
//
// Returns:
// {
//  _node: '/usr/local/Cellar/node/12.6.0/bin/node',
//  _script: '/Users/nb/repo/niantic/apps/client/public/web/cdn/resources/upload-resource.js',
//  _ordered: [ '/path/to/resource.file', 'hosted.file' ],
//  'dry-run': false,
//  verbose: true
//  'no-prompt': false
// }
const getArgs = () => {
  const args = process.argv
  const dict = {}
  // The first two arguments are the node instance and the script that's being run.
  dict._node = args[0]
  dict._script = args[1]
  dict._ordered = []

  // Consume remaining arguments starting at 2.
  for (let i = 2; i < args.length; ++i) {
    // This is a named argument. Create a key for it. The value comes from the portion after
    // the first = or is true if there is no next argument.
    if (args[i].startsWith('--')) {
      // get arg without '--'
      const arg = args[i].substring(2)
      // split on =
      const eqsep = arg.split('=')
      if (eqsep.length === 1) {
        // There is no '= sign for a value; assign true.
        dict[eqsep[0]] = true
      } else {
        // If there is an "=", take the value from the remainder.
        const val = eqsep.slice(1).join('=')
        dict[eqsep[0]] = val === 'false' || val === '0' ? false : val
      }
    } else {
      // There is no name key for this argument, so add it to the ordered list.
      dict._ordered.push(args[i])
    }
  }
  return dict
}

// Display a yes/no prompt to the user and return true if execution should proceed.
const prompt = (str) => {
  const yesAnswers = ['', 'y', 'yes']
  const noAnswers = ['n', 'no']
  const rl = readline.createInterface({input: process.stdin, output: process.stdout})

  return new Promise((resolve, reject) => {
    rl.question(`${str}? Y/n:  `, (answer) => {
      const cleanAnswer = answer.toLowerCase().trim()
      const isYes = yesAnswers.includes(cleanAnswer)
      const isNo = noAnswers.includes(cleanAnswer)
      if (!isYes && !isNo) {
        console.error(`[ERROR] Didn't understand '${answer}', please pick 'y' or 'n'.`)
      }
      resolve(isYes)
      rl.close()
    })
  })
}

// Prints a usage string.
const usage = (args) => {
  console.log('Usage:')
  console.log(`  ${args._script} [--verbose=true] [--dry-run=false] [--skip-timestamp=false] /path/to/source [destination]`)
}

// Validates command line arguments and returns true if execution is valid.
const checkArgs = (args) => {
  if (args.verbose) {
    console.log('args:', args)
  }
  if (args._ordered.length === 0) {
    console.error('Missing source')
    return false
  }
  if (args._ordered.length > 2) {
    console.error('Too many arguments.')
    return false
  }
  return true
}

// Gets the input file and output s3 key / bucket.
const getTargets = (args) => {
  const input = args._ordered[0]
  const skipTimestamp = args['skip-timestamp']
  // Get the output without a timestamp. Either this is the last path element of the input, or
  // a user supplied otput.
  const outputNoStamp = args._ordered.length > 1 ? args._ordered[1] : input.split('/').slice(-1)[0]

  let resourceName = ''
  if (skipTimestamp) {
    resourceName = outputNoStamp
  } else {
    // Get the output resourceName with the embedded timestamp.
    // a.b   -> a-stamp.b
    // .b    -> stamp.b
    // a     -> a-stamp
    // a.b.c -> a.b-stamp.c
    const dotSep = outputNoStamp.split('.')
    const hasDot = outputNoStamp.indexOf('.') >= 0
    const preDot = dotSep.length > 1 ? dotSep.slice(0, -1).join('.') : (hasDot ? '' : dotSep[0])
    const postDot = dotSep.length > 1 ? dotSep.slice(-1) : (hasDot ? dotSep[0] : '')
    const stampSep = preDot ? '-' : ''
    const endSep = postDot ? '.' : ''
    resourceName = `${preDot}${stampSep}${Date.now().toString(36)}${endSep}${postDot}`
  }

  // Get the output s3 bucket and key for resourceName.
  const bucket = '8w-us-west-2-web'
  const key = `web/resources/${resourceName}`

  return {input, output: {bucket, key}}
}

const run = async () => {
  // Parse command line args.
  const args = getArgs()

  // Check args and print usage and exit if invalid.
  if (!checkArgs(args)) {
    usage(args)
    return
  }

  // Get input and output.
  const {input, output} = getTargets(args)

  // Prompt the user to continue.
  const promptText = `Resource Uploader:

Upload resource:
  ${input}
to:
  bucket: ${output.bucket}
  key: ${output.key}
so it can be accessed at
  https://cdn.8thwall.com/${output.key}

Proceed`

  if (args['no-prompt']) {
    const ok = await prompt(promptText)
    if (!ok) {
      return
    }
  }

  const uploadCommand =
    `aws s3 cp ${input} s3://${output.bucket}/${output.key} --cache-control public,max-age=31536000`

  if (args['dry-run']) {
    console.log(uploadCommand)
  } else {
    if (args.verbose) {
      console.log(uploadCommand)
    }
    await exec(uploadCommand)
    console.warn('Done. To access, use:')
    console.log(`  https://cdn.8thwall.com/${output.key}`)
  }
}

run()
