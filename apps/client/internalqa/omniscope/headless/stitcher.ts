// stitcher.ts combines the output of multiple Omniscope headless commands into a single video using
// ffmpeg.  This is useful for visualizing across multiple Omniscope views the effects of various
// hyperparameters.

// In the future, we would like to migrate this functionality into Omniscope headless.

// Requirements:
// - brew install ffmpeg (note, this takes roughly 20 minutes)

// Run with:
//  - bazel run //apps/client/internalqa/omniscope/headless:stitcher

import * as os from 'os'
import * as path from 'path'
import * as fs from 'fs'
import {execSync} from 'child_process'
import {createHash} from 'crypto'

import {checkArgs} from 'c8/cli/args'

import {appendDatasetSequences} from 'reality/quality/benchmark/dataset-helpers'
import {getJsonResultFromLog} from 'reality/quality/benchmark/parse-log'

import {EXPERIMENT_NAME, PARAMETERS, SEQUENCES, VIEWS} from './stitcher-config'

const SOURCE = path.join(os.homedir(), 'datasets')
// Determines if stitcher will overwrite an existing video with the same path + name.  This is
// useful if you've had a large number of commits since you last ran and you want to overwrite the
// existing baseline videos.
const OVERWRITE = false

// The intermediate files are the output of Omniscope headless given a set of parameters.  You can
// re-use these (especially) baseline and still output the ffmpeg combined videos to DESTINATION.
const INTERMEDIATE_DESTINATION = path.join(os.homedir(), 'Movies/stitcher_output')
// Contains the combined ffmpeg files.
const DESTINATION = path.join(os.homedir(), 'Movies', EXPERIMENT_NAME)

// Some views, like vps-view, are so large that we don't want to stack them.
const SHOULD_STACK = true

const HELP = `Usage:
  # Creates videos based on your config settings defined in code:
  bazel run //apps/client/internalqa/omniscope/headless:stitcher
  # Combines the output of two existing experiments
  bazel run  //apps/client/internalqa/omniscope/headless:stitcher --
    --stitchExperiments exp1Name exp2Name`

// Optionally, add all the files from these dataset directories.
const DATASET_DIRS = []  // ['relocalization', 'portals']
// Filter any sequences from DATASET_DIRS that contain these substrings
// ex: ['quick-movement', 'arkit']
const FILTER_BY_SUBSTRINGS = ['']

// Checks if we have any invalid tuning keys.
const checkParamValid = (params: object, log: string) => {
  const logSplit = log.split('\n')
  const usedParams = getJsonResultFromLog(logSplit, 'key:used_params')
  const tuningKeys = new Set(Object.keys(params).flat())

  // Get all the keys that are used when we don't pass any parameters to benchmark native.
  const validParams = new Set(Object.keys(usedParams))
  tuningKeys.forEach((key) => {
    if (!validParams.has(key)) {
      throw new Error(`[tune-parameters] Key: '${key}' is not a valid tunable key`)
    }
  })
}

/**
 * Combines the input videos either horizontally or vertically using ffmpeg.
 * @param destinationDir {String} Absolute path to the output directory.
 * @param sequence {SequenceSpec} sequence.file is relative path to the sequence from SOURCE.
 * @param inputVideos {Array[String]} List of absolute paths to the videos that will be stacked.
 * @param isHorizontal {Boolean} Specifies if we will stack the videos vertically or horizontally.
 * @param uniqueName {String} Appended to the output path's name.
 * @param deleteInput {Boolean} Whether to delete the input files used for combining the video. This
 *                    is used to delete the Omniscope view combined videos that are inputs into the
 *                    final stitched video.
 * @returns {String} Absolute path to the output video.
 */
const stack = (
  destinationDir,
  sequence,
  inputVideos,
  isHorizontal = false,
  uniqueName = '',
  deleteInput
): string => {
  if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir)
  }

  const sequenceName = sequence.file.split('/').pop()
  const dest = path.join(destinationDir, `${sequenceName + uniqueName}_${EXPERIMENT_NAME}.mp4`)

  // If the video already exists, don't unnecessarily recreate it unless OVERWRITE = true.
  if (fs.existsSync(dest) && !OVERWRITE) {
    // eslint-disable-next-line no-console
    console.log(`Already created combined video: ${dest}`)
    return dest
  }

  // eslint-disable-next-line no-console
  console.log(`Creating combined video: ${dest}`)

  let combineCommand = 'ffmpeg -v warning -y  -hide_banner -loglevel error '

  inputVideos.forEach((inputVideo) => {
    combineCommand += `-i ${inputVideo} `
  })

  combineCommand +=
    `-filter_complex ${isHorizontal ? 'hstack' : 'vstack'}=inputs=${inputVideos.length} ${dest}`

  execSync(combineCommand, {maxBuffer: 1024 * 1024 * 50})

  // Delete the input videos if specified.
  if (deleteInput) {
    inputVideos.forEach((inputVideo) => {
      fs.unlinkSync(inputVideo)
    })
  }
  return dest
}

/**
 * Uses Omniscope headless to create an output video of the given sequence, Omniscope view, and set
 * @param sequence {SequenceSpec} sequence.file is relative path to the sequence from SOURCE.
 * @param view {Object} Contains the group, view index, and name of the requested view.
 * @param params {Object} Contains the params.
 * @returns {String} Absolute path to the video for the given sequence, view, and params.
 */
const headlessVideo = (sequence, view, params) => {
  // 1) Given the input, create the output path for Omniscope headless.
  // Create a hash for the given params.  This will let us not re-write videos for parameters
  // that we have already created output videos for.
  const hashInput = JSON.stringify(params) + (sequence.mapSrc || '')
  const paramHash = createHash('md5').update(hashInput).digest('hex')
  let sequenceName = sequence.file.split('/').pop()
  // Recorderv2 sequences all use 'capture.json'. We want a more descriptive name which is the
  // folder name.
  if (sequenceName === 'capture.json') {
    // eslint-disable-next-line
    sequenceName = sequence.file.split('/')[sequence.file.split('/').length - 2].split('.tgz')[0]
  }

  // Path to the headless output, that doesn't contain the parameters as text on the video.
  const outputFileNoText = `${sequenceName}_${view.name}_${paramHash}_no_text.mp4`
  const destAbsPathNoText = path.join(INTERMEDIATE_DESTINATION, outputFileNoText)
  // Re-writes the headless output with the parameters as text on top of each frame using ffmpeg.
  const outputFile = outputFileNoText.replace('_no_text.mp4', '.mp4')
  const destAbsPath = path.join(INTERMEDIATE_DESTINATION, outputFile)

  // If the video already exists, don't unnecessarily recreate it unless OVERWRITE = true.
  if (fs.existsSync(destAbsPath) && !OVERWRITE) {
    // eslint-disable-next-line no-console
    console.log(`Already created: ${destAbsPath}`)
    return destAbsPath
  }

  // eslint-disable-next-line no-console
  console.log(`Creating: ${destAbsPath}`)

  // 2) Since we have not created the Omniscope headless video for this input, construct the
  // Omniscope headless command.
  const pathToSequence = path.join(SOURCE, sequence.file)
  const exe = 'apps/client/internalqa/omniscope/headless/omniscope'
  const cliParams = JSON.stringify(params).split('"').join('\\"')

  const command = `${exe} -m "${view.group}" -v ${view.view} -o ${destAbsPathNoText} ` +
    `-d ${view.width || 1440},${view.height || 640} -i ${pathToSequence} -g "${cliParams}" ` +
    `--mapSrc "${sequence.mapSrc || ''}"`

  // Run Omniscope headless.
  // TODO(nathan): Omniscope headless does not work properly when more than one are running at the
  // same time, even when not sharing the same process.
  const log = execSync(command, {maxBuffer: 1024 * 1024 * 50}).toString()

  checkParamValid(params, log)

  // 3) Now that we've created the Omniscope headless video, re-write it using ffmpeg with the
  // parameters as text on the video.
  let textCommand = ''
  let paramIndex = 0
  if (sequence.mapSrc) {
    params.__mapSrc = sequence.mapSrc.split('/')[sequence.mapSrc.split('/').length - 1]
  }

  Object.entries(params).forEach(([key, value]) => {
    const paramText = `${key} = ${value}`
    textCommand += (
      `${paramIndex === 0 ? '' : ', '}drawtext=` +
      `text='${paramText}':` +
      'fontcolor=white:' +
      'fontsize=13:' +
      'box=1:' +
      'boxcolor=black@0.5:boxborderw=3:' +
      `x=${10}:` +
      `y=${10 + (20 * paramIndex)}`)
    paramIndex++
  })

  // This is necessary because if textCommand is empty, which will happen with baseline videos, then
  // -vf "" will throw an error.
  textCommand = textCommand === '' ? '' : `-vf "${textCommand}"`
  const addTextCommand = (
    `ffmpeg -y -hide_banner -loglevel error -i ${destAbsPathNoText} ${textCommand} -codec:a ` +
    `copy ${destAbsPath}`
  )
  execSync(addTextCommand, {maxBuffer: 1024 * 1024 * 50})

  // Delete the video that does not have the text.
  fs.unlinkSync(destAbsPathNoText)

  return destAbsPath
}

/**
 * Given as global parameters:
 * - a list of sequences
 * - a list of Omniscope views
 * - a list of parameter configurations
 * This script will output a single video for each sequence that combines the Omniscope views and
 * parameter configurations in the following pattern:
 * -----------------------------------------------------
 * |  Parameters #1, View #1 |  Parameters #1, View #2 |
 * -----------------------------------------------------
 * |  Parameters #2, View #1 |  Parameters #2, View #2 |
 * -----------------------------------------------------
 * |  Parameters #3, View #1 |  Parameters #3, View #2 |
 * -----------------------------------------------------
 */
const stitch = async () => {
  // Make sure the output directories exist before trying to write videos to it.
  [DESTINATION, INTERMEDIATE_DESTINATION].forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir)
    }
  })

  // eslint-disable-next-line no-console
  console.log(`Writing output files to "${SHOULD_STACK ? DESTINATION : INTERMEDIATE_DESTINATION}"`)

  // for ... of syntax allows for `await` calls in a synchronous fashion where as Array.forEach()
  // does not.  If omniscope headless was able to run concurrently without the output video being
  // corrupted, then we wouldn't need to worry about this.
  // eslint-disable-next-line no-restricted-syntax
  for (const sequence of SEQUENCES) {
    // A list of combined-vertically view-specific video paths that we will combine horizontally.
    const viewCombinedVideos = []

    // If we only have one parameter, then the input videos to be stacked horizontally, which
    // are stored in viewCombinedVideos, are the raw omniscope headless output, which we don't want
    // to delete.
    const shouldDeleteInputVideos = PARAMETERS.length > 1

    // eslint-disable-next-line no-restricted-syntax
    for (const view of VIEWS) {
      // A list of video paths which will all be of the same Omniscope view and configuration, but
      // using different hyperparameters.
      const perParamVideos = []

      // eslint-disable-next-line no-restricted-syntax
      for (const params of PARAMETERS) {
        const {...trackingParams} = params as any

        if (sequence.prebuiltMap && sequence.prebuiltMap !== '') {
          // Specifying a prebuilt map will override any map building or merging parameters.
          sequence.mapSrc = sequence.prebuiltMap
        }
        const outputPath = headlessVideo(sequence, view, trackingParams)
        perParamVideos.push(outputPath)
      }

      // If we only have one parameter, there's nothing to stack vertically.
      if (perParamVideos.length < 2) {
        viewCombinedVideos.push(perParamVideos[0])
      } else {
        // Stack the videos for the current Omniscope view vertically.
        // If we only have one view that we care about, then will call this one _stitched.  Otherwise
        // we will name it based off the view.
        const uniqueName = VIEWS.length > 1 ? `_${view.name}` : '_stitched'

        // Some views are too large to stack, but you still want to create a bunch of omniscope
        // headless outputs using stitcher.
        if (SHOULD_STACK) {
          const outputPath = stack(
            DESTINATION,
            sequence,
            perParamVideos,
            false,
            uniqueName,
            false  // Don't delete the per parameter videos since they might be re-used.
          )
          viewCombinedVideos.push(outputPath)
        }
      }
    }

    if (viewCombinedVideos.length > 1) {
      // Stack the vertical, per-Omniscope-view combination videos horizontally.
      stack(DESTINATION, sequence, viewCombinedVideos, true, '_stitched', shouldDeleteInputVideos)
    }
  }
}

// Gets the first index at which the two strings differ.  If they don't differ, it will return -1.
const firstDiffIndex = (str1, str2) => str1.split('').findIndex((el, index) => el !== str2[index])

// Given two lists of files, try and match them.
const matchFiles = (filesA, filesB) => {
  const matchedFiles = {}
  const unmatchedFiles = []

  filesA.forEach((fileA) => {
    let foundMatch = false
    filesB.forEach((fileB) => {
      // Find the file that shares the longest beginning substring.  We make sure they share at
      // least 5 characters. Sequences typically follow the format log.1530230262-600.
      const firstDiff = firstDiffIndex(fileA, fileB)
      if ((firstDiff === -1) ||
        (firstDiff > 5 &&
          (!matchedFiles[fileA] || firstDiff > firstDiffIndex(fileA, matchedFiles[fileA])))) {
        matchedFiles[fileA] = fileB
        foundMatch = true
      }
    })

    if (!foundMatch) {
      unmatchedFiles.push(fileA)
    }
  })
  return {matchedFiles, unmatchedFiles}
}

/**
 * Given two folder names in ~/Movies, it will automatically stitch them together and put them in
 * a new folder which will be the combination of the two provided folders.
 */
const stitchExperiments = (experimentNameA, experimentNameB) => {
  const expADir = path.join(os.homedir(), 'Movies', experimentNameA)
  const expBDir = path.join(os.homedir(), 'Movies', experimentNameB)
  const destinationDir = path.join(
    os.homedir(), 'Movies', `${experimentNameA}_vs_${experimentNameB}`
  )

  const expAFiles = fs.readdirSync(expADir)
  const expBFiles = fs.readdirSync(expBDir)

  // Get matches between the two experiments.
  const {matchedFiles, unmatchedFiles} = matchFiles(expAFiles, expBFiles)

  if (unmatchedFiles.length) {
    // eslint-disable-next-line no-console
    console.warn(
      'Could not find a matching file to combine for the following files: ',
      unmatchedFiles
    )
  }

  expAFiles.forEach((fileA) => {
    const fileB = matchedFiles[fileA]
    // One downside to this technique is that the Omniscope view name and potentially even the first
    // part of the hash could be part of the sequence name.
    const sequenceName = fileA.substring(0, firstDiffIndex(fileA, fileB))

    const fileAPath = path.join(expADir, fileA)
    const fileBPath = path.join(expBDir, fileB)
    stack(
      destinationDir,  // create new directory.
      sequenceName,
      [fileAPath, fileBPath],
      false,  // vertically stack
      '',
      false
    )
  })
}

const main = async () => {
  appendDatasetSequences(SEQUENCES, DATASET_DIRS, fileName => fileName, FILTER_BY_SUBSTRINGS)

  const args = checkArgs({
    optionalFlags: ['stitchExperiments'],
    optionsForFlag: {},
    minOrdered: 0,
    maxOrdered: 2,
    help: HELP,
  })

  if (args.stitchExperiments) {
    await stitchExperiments(args._ordered[0], args._ordered[1])
  } else {
    stitch()
  }
}

main()
