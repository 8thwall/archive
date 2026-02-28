'''
Copyright (c) 2021 8th Wall, Inc.
Original Author: Lynn Dang (lynn@8thwall.com)

Takes in a depthnet checkpoint and evaluates it with a given set of test files. The dataset given is
expected to have the format of:
  datset/
    arkit/
      ground-truth/
      images/
    hypersim/

Usage: python3 eval.py --path path/to/ckpt/or/tflite --datasets path/to/dataset
'''
from tqdm import tqdm
import tensorflow as tf
import argparse
import os
import time
from datautils import *
from depthnet import depthnet

# Forces tensorflow to run on CPU
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

if tf.test.gpu_device_name():
    print('GPU found')
else:
    print("No GPU found")

# Configure training params
parser = argparse.ArgumentParser(description='Argument parser')
parser.add_argument(
    '--model',
    dest='model',
    help='Path to model (can be a checkpoint or a tflite).'
)
parser.add_argument(
  '--datasets',
  dest='datasetsDir',
  default='depth-data/test',
  help=('Directory that contains the test/ which includes subdirectories arkit/ and hypersim/.'
        'arkit has two subdirectories named images/ and ground-truth/.'))
parser.add_argument(
  '--scale',
  dest='numScale',
  default=5,
  help=('Number of pyramid scales in the model. (necessary for checkpoint model)'))
parser.add_argument(
  '--max_dim',
  dest='maxDim',
  type=int,
  default=256,
  help=('Maximum dimension, which will be the height of datarecorder and the width of hypersim data'
        'The datarecorder input is originally a portrait 640x480, and the hypersim input is'
        'originally a landscape 768x1024. (necessary for checkpoint file)'))

args = parser.parse_args()

# Performs 3x3 block filter.
def blockFilter(x):
  return tf.nn.avg_pool2d(x, 3, 1, 'VALID')

# Calculate ssim with 3x3 block filtering.
def getSSIM(pred, gt):
  C1 = 0.01 ** 2
  C2 = 0.03 ** 2

  predMean = tf.nn.avg_pool2d(pred, 3, 1, 'VALID')
  predMeanSq = predMean ** 2
  gtMean = blockFilter(gt)
  gtMeanSq = gtMean ** 2
  l = (2 * predMean * gtMean + C1) / (predMeanSq + gtMeanSq + C1)

  predVar = blockFilter(pred ** 2) - predMeanSq
  gtVar = blockFilter(gt ** 2) - gtMeanSq
  predGtStd = blockFilter(pred * gt) - predMean * gtMean
  cs =  (2 * predGtStd + C2) / (predVar + gtVar + C2)

  return tf.clip_by_value((1 -l * cs)/2, 0,1)

# Calculations for disparity smoothness.
def getSmoothness(predGrads, gtGrads):
  smoothness = []
  for i in range(len(predGrads)):
    s = predGrads[i] * tf.exp(-tf.reduce_mean(tf.abs(gtGrads[i]), 3, keepdims=True))
    smoothness.append(s)
  return smoothness

def getDispSmoothnessX(pred, gt):
  predGradX = [s[:,:,:-1,:] - s[:,:,1:,:] for s in pred]
  gtGradX = [s[:,:,:-1,:] - s[:,:,1:,:] for s in gt]

  return getSmoothness(predGradX, gtGradX)

def  getDispSmoothnessY(pred, gt):
  predGradY = [s[:,:-1,:,:] - s[:,1:,:,:] for s in pred]
  gtGradY = [s[:,:-1,:,:] - s[:,1:,:,:] for s in gt]

  return getSmoothness(predGradY, gtGradY)

# Calculate the error based on the loss function for depthnet.
def calculateError(outputTensor, groundTruthTensor):
  height = tf.shape(outputTensor)[1]
  width = tf.shape(outputTensor)[2]
  outputTensor = tf.image.resize(outputTensor, [height / 2, width / 2])
  groundTruthTensor = tf.image.resize(groundTruthTensor, [height / 2, width / 2])

  # Calculate the error.
  alphaImageLoss = 0.85
  gradientLossWeight = 10.0

  l1 = tf.abs(outputTensor[0] - groundTruthTensor[0])
  ssim = getSSIM(outputTensor, groundTruthTensor)
  l1Loss = tf.reduce_mean(l1)
  ssimLoss = tf.reduce_mean(ssim)
  imgLoss = alphaImageLoss * ssimLoss + (1-alphaImageLoss)*l1Loss

  xSmoothness = getDispSmoothnessX([outputTensor], [groundTruthTensor])
  ySmoothness = getDispSmoothnessY([outputTensor], [groundTruthTensor])
  smoothnessLoss = tf.reduce_mean(tf.abs(xSmoothness)) + tf.reduce_mean(tf.abs(ySmoothness))
  totalSmoothnessLoss = 0

  # Simulating if we were to calculate the different pyramid scales, but since the tflite only
  # outputs one, it doesn't seem to make sense to resize and calculate the output and ground truth
  for i in range(args.numScale):
    ratio = 2 ** i
    totalSmoothnessLoss += smoothnessLoss / ratio
  totalLoss = imgLoss * args.numScale + gradientLossWeight * totalSmoothnessLoss

  return totalLoss

def getOutputTensor(interpreter, img, outputDetails):
  startTime = time.time()

  interpreter.set_tensor(0, img)
  interpreter.invoke()
  data = interpreter.get_tensor(outputDetails[0]['index'])[0, :, ::]

  timeDiff = time.time() - startTime
  outputTensor = tf.convert_to_tensor(data)
  outputTensor = tf.expand_dims(outputTensor, axis = 0)

  return outputTensor, timeDiff

def main():
  totalLoss = 0
  totalTime = 0

  # If the given model is a tflite.
  if ".tflite" in args.model:
    interpreter =  tf.lite.Interpreter(model_path = args.model)
    interpreter.allocate_tensors()
    outputDetails = interpreter.get_output_details()
    outputShape = outputDetails[0]['shape']

    dataReader =  DataReader(args.datasetsDir, 1, max(outputShape[1], outputShape[2]))
    dsSize = len(dataReader.arkitFiles_)
    inputImage, groundTruth, _ = dataReader.loadData("arkit")

    for i in tqdm(range(dsSize)):
      inputImage, groundTruth, _ = dataReader.loadData("arkit")

      outputTensor, timeDiff = getOutputTensor(interpreter, inputImage, outputDetails)
      groundTruthTensors = tf.image.resize(tf.convert_to_tensor(groundTruth[0]), (outputShape[1],
        outputShape[2]))
      groundTruthTensors = tf.expand_dims(groundTruthTensors, axis = 0)

      totalLoss += calculateError(outputTensor, groundTruthTensors).numpy()
      totalTime += timeDiff
  else:  # If it is a checkpoint.
    dataReader =  DataReader(args.datasetsDir, 1, args.maxDim)
    dsSize = len(dataReader.arkitFiles_)
    with tf.Graph().as_default():
      placeholders = {
        'im0': tf.compat.v1.placeholder(tf.float32, [None, None, None, 3], name='im0'),
        'gt': tf.compat.v1.placeholder(tf.float32, [None, None, None, 1], name='gt')
      }

      # Configuring depthnet for training.
      with tf.compat.v1.variable_scope("model", reuse=tf1.AUTO_REUSE) as scope:
        model = depthnet(placeholders, 1, args.numScale)
        model.gradientLossWeight_ = 10.0
        loss = model.totalLoss_

      init = tf.group(tf1.global_variables_initializer(),
                      tf1.local_variables_initializer())
      sess = tf.compat.v1.Session(config=tf.compat.v1.ConfigProto(allow_soft_placement=True))
      sess.run(init)

      saver = tf1.train.Saver()
      saver.restore(sess, args.model.split(".")[0])

      for i in tqdm(range(dsSize)):
        inputImage, groundTruth = dataReader.loadData("arkit")
        startTime = time.time()
        totalLoss += sess.run(loss,
          feed_dict={
            placeholders['im0']: inputImage,
            placeholders['gt']: groundTruth
          })
        totalTime += (time.time() - startTime)

  print("Average loss: ", totalLoss / dsSize)
  print("Total runtime (inference only, ms): ", totalTime * 1000)
  print("Average time per image (ms): ", totalTime * 1000/ dsSize)

if __name__ == '__main__':
    main()
