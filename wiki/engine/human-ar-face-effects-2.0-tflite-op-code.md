# Human AR - Face Effects 2.0 TFLite Op Code

To update to the face effects TFLite model that had an attention layer, we needed to add a custom tflite op code. Fortunately, all of the hard work and development was done by Google with the MediaPipe team.

Everything in this folder has the custom operations that were added `reality/engine/deepnets/operations`

They are registered here:
`reality/engine/deepnets/tflite-interpreter.cc`

## Step #1: Patching Tensorflow

MediaPipe added code directly to Tensorflow, which it then built it’s custom ops on top of. We ported these over to our Tensorflow.

## Step #2: Bringing over custom operations from MediaPipe

This custom operations rely on a patch they did to Tensorflow, which I also applied to our own TF in this PR.

The flow for brining these over was:

 * Find the original, like <https://github.com/google/mediapipe/blob/6cdc6443b6a7ed662744e2a2ce2d58d9c83e6d6f/mediapipe/util/tflite/operations/transform_landmarks.cc>

 * Copy over just the TF v2 code.

 * Get it building with the right headers + inliner.

 * Example PR:
