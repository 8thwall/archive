// @rule(js_cli)
// @package(npm-bzl-presubmit)

// Presubmit checks are defined in PRESUBMIT.json files in the source tree. For each modified file,
// we crawl the source tree up toward the repo root. When a PRESUBMIT.json file is encountered, the
// presubmit tasks specified in that file are run. If the PRESUBMIT.json file has "inherit: true"
// specified, we keep traversing up the source tree until the next PRESUBMIT.json is found. If any
// PRESUBMIT.json file has "inherit: false" set, then we stop traversing and ignore higher level
// PRESUBMIT.json files.
import {checkArgs} from '../../c8/cli/args'
import {runPresubmit} from './run-presubmit'

const HELP = `
A script for running presubmit checks on modified files.

 Usage:
   bazel-bin/bzl/presubmit/presubmit [modified files]
`

const args = checkArgs({
  help: HELP,
  optionalFlags: ['fix'],
  optionsForFlag: {
    fix: [true],
  },
})

runPresubmit({
  files: args._ordered,
  fix: !!args.fix,
})
