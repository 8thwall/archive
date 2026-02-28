// By separating out stitcher's config, you can easily make changes to stitcher as well as its
// configuration without muddying up the PR.

import type {SequenceSpec} from
  '../../../../../reality/quality/benchmark/process-jobs'

// The experiment name will be appended to the ffmpeg combined videos (*_stitched_exp1.mp4).  This
// allows you to run more than one stitcher at a time, while still allowing them to use the same
// omniscope headless output videos if they share the same parameters.
const EXPERIMENT_NAME = 'experiment-1'

// List of sequence paths relative to SOURCE.
// TODO(nathan): add synthetic scene names.  Omniscope headless does not currently support synth
// names.
const SEQUENCES: SequenceSpec[] = [
  /* eslint-disable max-len */
  {'file': 'flat-image-targets/artgallery/log.1599836981-600', 'synth': ''},
  {'file': 'cylindrical-image-targets/tully/log.1599837072-600', 'synth': ''},
  /* eslint-enable max-len */
]

// The views that you want to see simultaneously in your output video.  Each view is stacked
// horizontally beside each other for the same set of parameters in the final stitched video.
interface ViewSpec {
  group: string
  view: number
  name: string
  width?: number
  height?: number
}

const VIEWS: ViewSpec[] = [
  // {'group': "Visual-Inertial Odometry", 'view': 1, 'name': 'vio-mapping'},
  // {'group': "Visual-Inertial Odometry", 'view': 5, 'name': 'feature-points'},
  // {'group': "Visual-Inertial Odometry", 'view': 11, 'name': 'keyframe-visual'},
  // {
  //   'group': 'Visual-Inertial Odometry',
  //   'view': 21,
  //   'name': 'vps-view',
  //   'width': 480 * 4,
  //   'height': 640 * 1,
  // }
]

// List of parameters that you want to create output videos for. They will be stacked vertically on
// top of each other in the final stitched video.
const PARAMETERS = [
  // If you want a baseline video, just pass an empty object.
  {
  },
  // Experiment #2.
  // {
  //   'MapBuilder.bundleAdjustmentIterativeEnabled': true,
  //   'WorldMaps.skypointWeightFactor': 0.001,
  // },
  // Experiment #3
  // {
  //   'GlRealityFrame.PyramidSize': 256,
  // },
  // {
  //   'GlRealityFrame.PyramidSize': 1024,
  // },
]

export {
  EXPERIMENT_NAME, PARAMETERS, SEQUENCES, VIEWS,
}
