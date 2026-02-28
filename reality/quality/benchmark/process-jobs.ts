// @attr[](visibility = "//apps/client/internalqa/omniscope/headless:__subpackages__")
// @attr[](visibility = "//reality/quality/benchmark:__subpackages__")

import {homedir} from 'os'
import {join} from 'path'
import {createHash} from 'crypto'
import fs from 'fs'
import {exec} from 'child_process'
import {promisify} from 'util'
import ProgressBar from 'progress'

import {getJsonResultFromLog} from './parse-log'

const execPromise = promisify(exec)
const datasetDir = join(homedir(), 'datasets')

// mapDir stores map8s made by map-factory. The directory is not synced with datasets, so mkdir.
const mapDir = join(homedir(), 'datasets/maps')
if (!fs.existsSync(mapDir)) {
  fs.mkdirSync(mapDir, {recursive: true})
}

// Used to map a parameters hash to the original params, which is visualized in the benchmark output
// and stored in mapDir/map-factory-params.json
const buildHashToBuildParams: Record<string, any> = {}
const mergeHashToMergeParams: Record<string, any> = {}

// These are parameters that are also set by default in the Omniscope view
const defaultParametersMapFactory = {
  'WorldMaps.maxKeyframesInMap': 10000,
  'MapBuilder.minParallaxThreshold': 0.1,
  'WorldMaps.redundancyPointPercentage': 0.99,
  'WorldMaps.redundancyPointCount': 3,
  'MapBuilder.pairAllKeyframes': true,
  'MapBuilder.keyframePairProcessCount': 10000,
  'MapBuilder.maxPairSize': 10000,
  'MapBuilder.maxNewSkypoints': 0,
  'WorldMaps.requiredTenuredTrackingHitRatio': 0.1,
  'WorldMaps.requiredTrackingCount': 8,
  'WorldMaps.requiredTrackingHitRatio': 0.25,
}

const getHashFromParams = params => createHash('md5').update(JSON.stringify(params)).digest('hex')

interface SequenceSpec {
  file: string
  synth?: string
  // MapFactory puts final mergedMap here, or it can be used directly when no mapSrcSequences given
  mapSrc?: string
  // If mapSrc is not given, a map8 is made for each mapSrcSequence. Their merge is used as mapSrc.
  mapSrcSequences?: string[]
  // These are populated by MapFactory - don't fill them explicitly
  // sequenceNames is the file names in mapSrcSequences without the directory
  // sequencesHash is the hash of the sequenceNames sorted alphabetically and space-separated
  sequenceNames?: string[]
  sequencesHash?: string
  prebuiltMap?: string
}

/// ///////////////////////////////////// runJob functions /////////////////////////////////////////

// Run a single benchmark job as a promise.
const runBenchmarkJob = async ({params, jobTarget}: { params: any; jobTarget: SequenceSpec }) => {
  const {file, synth, mapSrc} = jobTarget
  const exe = 'reality/quality/benchmark/benchmark-xr-6dof-native'
  const realitySrc = join(datasetDir, file)
  const {mapFactoryBuildParams, mapFactoryMergeParams, ...benchmarkParams} = params
  const cliParams = JSON.stringify(benchmarkParams).split('"').join('\\"')
  let completeMapSrc = ''
  if (jobTarget.mapSrc && jobTarget.mapSrc.length) {
    completeMapSrc = join(datasetDir, mapSrc)
  } else if (jobTarget.sequencesHash && mapFactoryBuildParams && mapFactoryMergeParams) {
    // MapFactory already built the map to use here
    const buildHash = getHashFromParams({...defaultParametersMapFactory, ...mapFactoryBuildParams})
    const mergeHash = getHashFromParams({...defaultParametersMapFactory, ...mapFactoryMergeParams})
    completeMapSrc = join(mapDir, `${jobTarget.sequencesHash}_${buildHash}_${mergeHash}.map8`)
  }
  const command = `${exe} -j "${cliParams}" -r ${realitySrc} -s ` +
    `"${synth || ''}" --mapSrc "${completeMapSrc}"`
  const log = (await execPromise(command, {maxBuffer: 1024 * 1024 * 50})).stdout
  const logSplit = log.split('\n')
  const jobResult = {
    job: {params, file},
    // All the parameters that were used by benchmark native
    usedParams: getJsonResultFromLog(logSplit, 'key:used_params'),
    result: getJsonResultFromLog(logSplit, 'key:result'),
  }
  return jobResult
}

const BENCHMARK_JOB: string = 'benchmark'
const MAPBUILD_JOB: string = 'map-build'
const MAPMERGE_JOB: string = 'map-merge'

const JOB_TO_FUNCTION_DICT = {}
JOB_TO_FUNCTION_DICT[BENCHMARK_JOB] = runBenchmarkJob

// Generates combinations of elements from n arrays.
const combinations = (args) => {
  if (args.length <= 1) {
    return args.length ? args[0].map(a => ([a])) : []
  }
  const first = args[0]
  const rest = combinations(args.slice(1))
  return first.flatMap(l => rest.map(r => [l, r].flat()))
}

// Get a list of jobs in the format {params, file}, where params is a map from param name -> value
// and file is a relative file path to the datasets directory.
const getJobs = (gridSearchParams, manualParams, jobFiles) => {
  // Get the full list of parameter combinations as name / val pairs, where name is the parameter
  // and val is the value to test.
  const paramCombinations = combinations(
    Object.entries(gridSearchParams).map(([k, a]: [string, any]) => a.map(v => ({name: k, val: v})))
  ).concat(manualParams)

  // Transform the parameter from name/val structure to 'name: val' structure, and then get cross
  // product of files with parameters. Convert the array to an object of the form {params, file}.
  return combinations([
    paramCombinations.map(paramVals => paramVals.reduce((o, p) => ({...o, [p.name]: p.val}), {})),
    jobFiles,
  ]).map(([p, j]) => ({
    params: p,
    jobTarget: j,
  }))
}

// Processes a set of jobs with a specified degree of parallelism, printing incremental progress
// after each job completes.
const processJobs = async (jobs, numThreads, jobType: string = BENCHMARK_JOB) => {
  const progressBar = new ProgressBar(
    ':progressString :bar Progress :current/:total ETA :eta s',
    {total: jobs.length}
  )

  // Runs a job only after another completes, and adds the job's results to the overall result set.
  const scheduleJob = async (results, job, waitForJob) => {
    await waitForJob
    // Start the job running before waiting for other results.
    // Retrieve the correct runJob function based on jobType
    const runJob = JOB_TO_FUNCTION_DICT[jobType]
    const r = await runJob(job).catch((e) => {
      // eslint-disable-next-line no-console
      console.log(e)
      process.exit(1)
    })
    const rs = await results
    rs.push(r)
    switch (jobType) {
      case MAPBUILD_JOB:
        progressBar.tick({progressString: `Map Build ${job.jobTarget}`})
        break
      case MAPMERGE_JOB:
        progressBar.tick({
          progressString: `Map Merge ${job.jobTarget.sequenceSpec.sequenceNames} ` +
            `${job.jobTarget.buildHash}`,
        })
        break
      default:
        progressBar.tick({progressString: `Benchmarking ${job.jobTarget.file}`})
    }

    return rs
  }

  const allJobs = []
  return jobs.reduce(async (results, job) => {
    const waitForJob = allJobs.length >= numThreads ? allJobs[allJobs.length - numThreads] : null
    allJobs.push(scheduleJob(results, job, waitForJob))
    return allJobs[allJobs.length - 1]
  }, [])
}

export {
  BENCHMARK_JOB,
  buildHashToBuildParams,
  defaultParametersMapFactory,
  getHashFromParams,
  getJobs,
  mapDir,
  mergeHashToMergeParams,
  processJobs,
  SequenceSpec,
}
