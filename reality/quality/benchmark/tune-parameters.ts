/* eslint-disable no-console */
// Command line tool for running the engine with configurable parameters.
// This script:
//   * Runs reality/quality/benchmark/benchmark-xr-6dof-native and passes in ParameterData,
//   *  which will be set in the engine.
//   * Formats the result in an object and prints a simplified return value.
// How to add new parameters?
//   1) Add the key and parameter values to gridSearchParameters
//   2) Initialize and use the value in the engine. An example is:
//      double bundleAdjustSchurDCSLoss() {
//        static const double val =
//          globalParams().getOrSet<double>("bundle.bundleAdjustSchurDCSLoss", 1.0);
//        return val;
//      }
// Expectations:
//   * This script expects that you have recordings in HOME/datasets/ - you can get them with:
//     bazel run //reality/quality/datasets:dataset-sync -- --direction=down --dataset=benchmark
//       --local=${HOME}/datasets

// @rule(js_cli)
// @attr[](data = "//apps/client/internalqa/omniscope/headless:omniscope")
// @attr[](data = "//reality/quality/benchmark:benchmark-xr-6dof-native")
// @attr[](data = "//reality/quality/benchmark:sequences")
// @attr[](data = "//reality/quality/synthetic/assets")
// @attr[](data = "@npm-c8//:modules")
// @attr(npm_rule = "@npm-tune-parameters//:npm-tune-parameters")

import * as os from 'os'
import * as path from 'path'
import {promisify} from 'util'
import {markdownTable} from 'markdown-table'
import {exec} from 'child_process'
import fs from 'fs'

import {checkArgs} from 'c8/cli/args'

import {appendDatasetSequences} from './dataset-helpers'

import {processJobs, getJobs, BENCHMARK_JOB, SequenceSpec} from './process-jobs'

let cliArgs = null
// Control the degree of parallelism of the script. If this is too high, latency measures will
// not be accurate. Set to 16 if you want this to run faster and don't care about latency metrics.
const NUM_PARALLEL_JOBS = 16

const EXPERIMENT_NAME = 'tune_parameters'

const WRITE_CSV = true
const CSV_DEST = '/tmp'

const WRITE_JSON = true
const JSON_DEST = '/tmp'

const SEQUENCE_SPECS: SequenceSpec[] = [
  /* eslint-disable max-len */
  // image targets
  // "a-sunday-on-la-grande-jatte-seurat.jpg"
  {'file': 'flat-image-targets/artgallery/log.1599836981-600', 'synth': ''},
  // "tully.jpg"
  {'file': 'cylindrical-image-targets/tully/log.1599837072-600', 'synth': ''},
  /* eslint-enable max-len */
]

// Optionally, add all the files from these dataset directories.
const datasetDirs = []  // ['true-scale/curriculum', 'relocalization', 'portals']
// Optionally filter the above DATASET_DIRS for any substrings ex: ['quick-movement', 'arkit']
const filterBySubStrings = ['']

/// //////////////////////////////////// Tracking parameters ///////////////////////////////////////

// Generate combinations from the keys of these parameters.
const gridSearchParametersTracking = {
  // 'BenchmarkXr6dofNative.skipFrame': [true, false],
  // 'BenchmarkXr6dofNative.desiredFps': [40, 30],
  // 'GlRealityFrame.PyramidSize': [256, 1024],
  // 'Tracker.disableMapBuilder': [true, false],
  // 'WorldMaps.enableLostLocalMatcher': [true, false],
  // 'WorldMaps.projectAllAdjacentDescriptors': [true, false]
}

// Additionally test these manually specified parameters.
const manualParametersTracking = [
  // [
  //   {name: 'Foo.bar', val: false},
  // ],
]

// Set the metrics we will show in the table.
/* eslint-disable @typescript-eslint/no-unused-vars */
const PER_FRAME_ERROR = 'perFrameError'
const ABSOLUTE_TRAJECTORY_ERROR = 'absoluteTrajectoryError'
const SCALE_ERROR = 'scaleError'
const PREDICTED_MOTION_ERROR = 'predictedMotionError'
const ENGINE_LATENCY = 'xrEngineLatency'
const BENCHMARK_LATENCY = 'benchmarkLatency'
const PERCENTAGE_TRACKING = 'percentageTracking'

const RMSE = 'rmse'
const MEAN = 'mean'
const FIRST_FRAME_ERROR = 'firstFrameError'
const FIRST_FRAME_NUMBER = 'firstFrameNumber'
const Q50 = 'q50'
const Q90 = 'q90'
const Q99 = 'q99'

interface Metric {
  name: string
  val: string
}

const metrics: Metric[] = [
  {name: PER_FRAME_ERROR, val: MEAN},
  {name: ABSOLUTE_TRAJECTORY_ERROR, val: RMSE},
  {name: PREDICTED_MOTION_ERROR, val: MEAN},
  {name: SCALE_ERROR, val: FIRST_FRAME_NUMBER},
  {name: SCALE_ERROR, val: FIRST_FRAME_ERROR},
  {name: SCALE_ERROR, val: MEAN},
  {name: ENGINE_LATENCY, val: MEAN},
  {name: PERCENTAGE_TRACKING, val: MEAN},
]

const USE_PERCENT_DIFF = false
// Optionally print a summary of filtered results using these criteria.
const FILTER_BY_METRICS = false
const PERCENT_DIFFERENCE_THRESHOLD = 0.2
const METRICS_TO_FILTER_BY: {name: string, val: string}[] = [
  {name: ABSOLUTE_TRAJECTORY_ERROR, val: RMSE},
]

const execPromise = promisify(exec)
const datasetDir = path.join(os.homedir(), 'datasets')

// Truncate to the nearest 3 decimal places.
const truncate = f => Math.round((f * 1000)) / 1000

const range = n => Array.from(Array(n).keys())

const zip = (a1, a2) => a1.map((x, i) => [x, a2[i]])

const formattedAverage = (arr) => {
  let sum = 0.0
  let n = 0
  for (let i = 0; i < arr.length; i++) {
    // Exclude -1 since some of our metrics may return -1 if they aren't valid.
    if (typeof arr[i] === 'number' && arr[i] !== -1) {
      sum += arr[i]
      n++
    }
  }
  return n > 0 ? truncate(sum / n) : 'n/a'
}

// Get a nice representation of the parameter for printing.
const paramString = params => JSON.stringify(params).split('"').join('')

// Get a nice representation of the metric for printing.
const metricString = (m: {name: string, val: string}) => `${m.name} ${m.val}`

const getByParam = res => res.reduce((p, r) => (
  {...p, [paramString(r.job.params)]: [...(p[paramString(r.job.params)] || []), r.result]}
), {})

const getByFile = res => res.reduce((p, r) => (
  {...p, [paramString(r.job.file)]: [...(p[paramString(r.job.file)] || []), r.result]}
), {})

const printSequences = (sequences, printSingleTableMode) => {
  console.log('')
  let index = 0
  sequences.forEach((s) => {
    let mapInfo = ''
    if (s.sequenceNames) {
      mapInfo = s.sequenceNames.join(', ')
    } else {
      mapInfo = s.mapSrc ? ` (${s.mapSrc})` : ''
    }
    const synthInfo = s.synth ? ` (${s.synth})` : ''
    console.log(`${index}.  ${s.file.split('/').pop()}${synthInfo} (${mapInfo})`)
    index++
  })
  if (printSingleTableMode) {
    console.log(`${index}.  Average`)
  }
  console.log('')
}

const printResults = (results, baselineResults, shouldPrintSingleTable) => {
  // Get all results for single parameter combination as an array, ordered by file.
  const byParam = getByParam(results)
  const baselineResultsInFileOrder: any = Object.values(getByParam(baselineResults)).pop()

  if (shouldPrintSingleTable) {
    const headers = metrics.map(m => metricString(m))
    headers.unshift('Parameters')
    // Prints table rows in the form:
    // | parameter | err0 / err1 / err2 / err3 | ms0 ... | pm0 ... | ms0 / ms1 / ms2 / ms3 |
    const dataRows = Object.entries(byParam).map(([k, v]: [string, any]) => {
      const rawRows = metrics.map(metric => zip(v, baselineResultsInFileOrder).map(
        ([r, rBaseline]) => {
          const norm = USE_PERCENT_DIFF ? rBaseline[metric.name][metric.val] : 1
          return (r[metric.name] ? truncate(r[metric.name][metric.val] / norm) : 'n/a')
        }
      ))
      const averages = rawRows.map(row => formattedAverage(row))
      const rows = zip(rawRows, averages)
        .map(([row, avg]) => row.concat(avg))
        .map(row => row.join(' / '))
      rows.unshift(k)
      return rows
    })

    console.log('')
    console.log(markdownTable([
      headers,
      ...dataRows,
    ]))
  } else {
    metrics.forEach((metric: Metric) => {
      const dataRows = Object.entries(byParam).map(([k, v]: [string, any]) => {
        const rows = zip(v, baselineResultsInFileOrder).map(([r, rBaseline]) => {
          const norm = USE_PERCENT_DIFF ? rBaseline[metric.name][metric.val] : 1
          return (r[metric.name] ? truncate(r[metric.name][metric.val] / norm) : 'n/a')
        })
        // Add the average value of rows
        rows.push(formattedAverage(rows))
        rows.unshift(k)
        return rows
      })

      const headers =
        [metricString(metric), ...range(dataRows[0] ? dataRows[0].length - 2 : 0), 'Average']
      console.log('')
      console.log(markdownTable([
        headers,
        ...dataRows,
      ]))
    })
  }
}

const writeCsv = (res, sequences) => {
  // TODO(paris): Use fast-csv npm package to write instead of doing it manually.
  const file = `${CSV_DEST}/${EXPERIMENT_NAME}.csv`
  const separator = ','
  const separatorRegex = new RegExp(separator, 'g')
  let fileString = ''

  const byParam = getByParam(res)

  // NOTE(paris): We currently write the CSV data two ways. The first way, with the tables
  // separately, makes it easier to chart data. The second, with everything collapsed, is nicer
  // when you want to take the average and see everything easily.

  // First create the tables separately.
  metrics.forEach((m) => {
    fileString += `${metricString(m)}\n`
    fileString += `Sequence Name${separator}`
    Object.entries(byParam).forEach(([k]: [string, any]) => {
      fileString += `${k.replace(separatorRegex, ' ')}${separator}`
    })
    fileString += '\n'

    let i = 0
    sequences.forEach((sequence) => {
      fileString += `${sequence.file}${sequence.synth}${sequence.mapSrc}${separator}`
      Object.entries(byParam).forEach(([, v]: [string, any]) => {
        fileString += v[i][m.name] ? `${v[i][m.name][m.val]}${separator}` : `'n/a'${separator}`
      })
      fileString += '\n'
      i++
    })
    fileString += '\n\n'
  })

  // Then also create them all in a single block.
  fileString += `${separator}`
  metrics.forEach((m) => {
    fileString += `${metricString(m)}`
    Object.entries(byParam).forEach(() => { fileString += `${separator}` })
  })
  fileString += '\n'
  fileString += `Sequence Name${separator}`
  metrics.forEach(() => {
    Object.entries(byParam).forEach(([k]: [string, any]) => {
      fileString += `${k.replace(separatorRegex, ' ')}${separator}`
    })
  })
  fileString += '\n'
  let i = 0
  sequences.forEach((sequence) => {
    fileString += `${sequence.file}${sequence.synth}${sequence.mapSrc}${separator}`
    metrics.forEach((m) => {
      Object.entries(byParam).forEach(([, v]: [string, any]) => {
        fileString += v[i][m.name] ? `${v[i][m.name][m.val]}${separator}` : `'n/a'${separator}`
      })
    })
    fileString += '\n'
    i++
  })

  fs.writeFileSync(file, fileString, 'utf8')
  console.log(`Wrote data to ${file}`)
}

const filterResults = (allResults, baselineResults) => {
  // Get all results for single file combination as an array, ordered by file.
  const resultsByFile = getByFile(allResults)
  const baselineByFile = getByFile(baselineResults)

  const filesToAdd = []
  // For each file
  Object.entries(resultsByFile).forEach(([file, resultsPerParameter]: [string, any]) => {
    // Get the baseline results for this file
    const baselineForFile = baselineByFile[file][0]
    // For each metric calculate the percent difference for all parameters to the baseline.
    // If any of the parameters have a percent difference above thresh, add it to filesToAdd.
    if (METRICS_TO_FILTER_BY.some((metric) => {
      // For each parameter for this metric, divide by the baseline to get percent difference,
      // checking that the metric name exists first.
      if (!resultsPerParameter.every(r => r[metric.name])) {
        return false
      }
      const percentDifferenceForParameters = resultsPerParameter.map(r => (
        truncate(r[metric.name][metric.val] / baselineForFile[metric.name][metric.val])))
      return percentDifferenceForParameters.some(
        val => Math.abs(val - 1) > PERCENT_DIFFERENCE_THRESHOLD
      )
    })) {
      filesToAdd.push(file)
    }
  })

  const filteredResults = allResults.filter(result => filesToAdd.includes(result.job.file))
  const filteredBaselineResults =
    baselineResults.filter(result => filesToAdd.includes(result.job.file))
  const filteredSequences = SEQUENCE_SPECS.filter(s => filesToAdd.includes(s.file))
  return {filteredResults, filteredBaselineResults, filteredSequences}
}

// Process all requested jobs and return a filtered version of the results if requested.
const getResultsAndSequences = async () => {
  const baselineResults = await processJobs(getJobs({}, [[]], SEQUENCE_SPECS), NUM_PARALLEL_JOBS)

  // Check tuning parameter keys against all keys found in C++ code.
  // If a non-existent key is found, throw.
  {
    const tuningKeys: string[] = []
    Object.keys(gridSearchParametersTracking).forEach(key => tuningKeys.push(key))
    manualParametersTracking
      .forEach(paramList => paramList.forEach(param => tuningKeys.push(param.name)))

    // Get all the keys that are used when we don't pass any parameters to benchmark native.
    if (baselineResults.length > 0) {
      const validParams = new Set(Object.keys(baselineResults[0].usedParams))
      const invalidKey = tuningKeys.find(key => !validParams.has(key))
      if (invalidKey !== undefined) {
        throw new Error(`[tune-parameters] Key: '${invalidKey}' is not a valid tunable key`)
      }
    }
  }

  const results = await processJobs(
    getJobs(gridSearchParametersTracking, manualParametersTracking, SEQUENCE_SPECS),
    NUM_PARALLEL_JOBS, BENCHMARK_JOB
  )
  results.push(...baselineResults)

  if (FILTER_BY_METRICS) {
    const {filteredResults, filteredBaselineResults, filteredSequences} =
      filterResults(results, baselineResults)
    return {
      results,
      baselineResults,
      'sequences': SEQUENCE_SPECS,
      filteredResults,
      filteredBaselineResults,
      filteredSequences,
    }
  } else {
    return {
      results,
      baselineResults,
      'sequences': SEQUENCE_SPECS,
      'filteredResults': results,
      'filteredBaselineResults': baselineResults,
      'filteredSequences': SEQUENCE_SPECS,
    }
  }
}

// ////////////////////////////////
// Parse the args and start running
cliArgs = checkArgs({
  optionalFlags: ['printSingleTable', 'datasetDir', 'filterBySubStrings', 'skipFrames'],
})

if (cliArgs.datasetDir) {
  datasetDirs.push(cliArgs.datasetDir as string)
}
if (cliArgs.filterBySubStrings) {
  filterBySubStrings.push(cliArgs.filterBySubStrings as string)
}

// Run this script and print "Done" when done.
const run = async () => {
  const {
    results,
    baselineResults,
    sequences,
    filteredResults,
    filteredBaselineResults,
    filteredSequences,
  } = await getResultsAndSequences()

  printResults(results, baselineResults, cliArgs.printSingleTable)
  printSequences(sequences, cliArgs.printSingleTable)

  if (FILTER_BY_METRICS) {
    console.log(' ====================== FILTERED RESULTS ======================')
    printResults(filteredResults, filteredBaselineResults, cliArgs.printSingleTable)
    printSequences(filteredSequences, cliArgs.printSingleTable)
  }

  if (WRITE_CSV) {
    writeCsv(results, sequences)
    // writeCsv(filteredResults, filteredSequences) //Optionally, filter the output csv.
  }
  if (WRITE_JSON) {
    const file = `${JSON_DEST}/${EXPERIMENT_NAME}.json`
    fs.writeFileSync(file, JSON.stringify(results), 'utf8')
    console.log(`Wrote data to ${file}`)
  }
  console.log('Done')
}

appendDatasetSequences(
  SEQUENCE_SPECS,
  datasetDirs,
  fileName => ({file: fileName, synth: '', mapSrc: ''}),
  filterBySubStrings
)
run()
