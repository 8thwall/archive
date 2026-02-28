# Copyright (c) 2021 8th Wall, Inc.
# Original Author: Lynn Dang (lynn@8thwall.com)
#
# Depthnet is originally forked from Pydnet with changes to train based on depth rather than
# stereo input. Loss functions for image loss and gradient loss are added to be able to perform
# supervised training. Layer functions from Pydnet's layer.py have also been placed at the end
# of the script.
#
# MIT License
#
# Copyright (c) 2018 Matteo Poggi m.poggi@unibo.it
#
# Permission is hereby granted, free of charge, to any person obtaining a copy
# of this software and associated documentation files (the "Software"), to deal
# in the Software without restriction, including without limitation the rights
# to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
# copies of the Software, and to permit persons to whom the Software is
# furnished to do so, subject to the following conditions:

# The above copyright notice and this permission notice shall be included in all
# copies or substantial portions of the Software.

# THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
# IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
# FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
# AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
# LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
# OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
# SOFTWARE.

import tensorflow as tf
import tensorflow.compat.v1 as tf1
import os
import sys

SEED=8

class depthnet(object):

    # placeholders contains 'im0' (input image) and 'gt' (ground truth)
    def __init__(self, placeholders=None, mode=0, scale=6):
        self.placeholders_ = placeholders
        self.collection_ = ['model_0']
        self.numScale_ = scale

        self.buildModel()
        self.buildOutputs()

        if (mode != 0) and (placeholders['gt'] != None):
          self.gradientLossWeight_ = 0.1
          self.buildLosses()
          self.buildSummaries()

    def buildModel(self):
      with tf1.variable_scope("pyramid") as scope:
        pyramid = self.buildPyramid(self.placeholders_['im0'])
      # SCALE 6
      if self.numScale_ == 6:
        with tf1.variable_scope("L6") as scope:
          with tf1.variable_scope("estimator") as scope:
            conv6 = self.buildEstimator(pyramid[6])
            self.disp7_ = self.getDisp(conv6)
          with tf1.variable_scope("upsampler") as scope:
            upconv6 = self.bilinearUpsamplingByDeconvolution(conv6)
      # SCALE 5
      if self.numScale_ >= 5:
        with tf1.variable_scope("L5") as scope:
          with tf1.variable_scope("estimator") as scope:
            if (self.numScale_ > 5):
              conv5 = self.buildEstimator(pyramid[5], upconv6)
            else:
              conv5 = self.buildEstimator(pyramid[5])
            self.disp6_ = self.getDisp(conv5)
          with tf1.variable_scope("upsampler") as scope:
            upconv5 = self.bilinearUpsamplingByDeconvolution(conv5)
      # SCALE 4
      if self.numScale_ >= 4:
        with tf1.variable_scope("L4") as scope:
          with tf1.variable_scope("estimator") as scope:
            if (self.numScale_ > 4):
              conv4 = self.buildEstimator(pyramid[4], upconv5)
            else:
              conv4 = self.buildEstimator(pyramid[4])
            self.disp5_ = self.getDisp(conv4)
          with tf1.variable_scope("upsampler") as scope:
            upconv4 = self.bilinearUpsamplingByDeconvolution(conv4)
      # SCALE 3
      with tf1.variable_scope("L3") as scope:
        with tf1.variable_scope("estimator") as scope:
          conv3 = self.buildEstimator(pyramid[3], upconv4)
          self.disp4_ = self.getDisp(conv3)
        with tf1.variable_scope("upsampler") as scope:
          upconv3 = self.bilinearUpsamplingByDeconvolution(conv3)
      # SCALE 2
      with tf1.variable_scope("L2") as scope:
        with tf1.variable_scope("estimator") as scope:
          conv2 = self.buildEstimator(pyramid[2], upconv3)
          self.disp3_ = self.getDisp(conv2)
        with tf1.variable_scope("upsampler") as scope:
          upconv2 = self.bilinearUpsamplingByDeconvolution(conv2)
      # SCALE 1
      with tf1.variable_scope("L1") as scope:
        with tf1.variable_scope("estimator") as scope:
          conv1 = self.buildEstimator(pyramid[1], upconv2)
          self.disp2_ = self.getDisp(conv1)

    # Pyramidal features extraction
    def buildPyramid(self, input_batch):
      features = []
      features.append(input_batch)
      with tf1.variable_scope("conv1a"):
        conv1a = conv2d_leaky(input_batch, [3, 3, 3, 16], [16], 2, True)
      with tf1.variable_scope("conv1b"):
        conv1b = conv2d_leaky(conv1a, [3, 3, 16, 16], [16], 1, True)
      features.append(conv1b)
      with tf1.variable_scope("conv2a"):
        conv2a = conv2d_leaky(conv1b, [3, 3, 16, 32], [32], 2, True)
      with tf1.variable_scope("conv2b"):
        conv2b = conv2d_leaky(conv2a, [3, 3, 32, 32], [32], 1, True)
      features.append(conv2b)
      with tf1.variable_scope("conv3a"):
        conv3a = conv2d_leaky(conv2b, [3, 3, 32, 64], [64], 2, True)
      with tf1.variable_scope("conv3b"):
        conv3b = conv2d_leaky(conv3a, [3, 3, 64, 64], [64], 1, True)
      features.append(conv3b)
      with tf1.variable_scope("conv4a"):
        conv4a = conv2d_leaky(conv3b, [3, 3, 64, 96], [96], 2, True)
      with tf1.variable_scope("conv4b"):
        conv4b = conv2d_leaky(conv4a, [3, 3, 96, 96], [96], 1, True)
      features.append(conv4b)

      if self.numScale_ >= 5:
        with tf1.variable_scope("conv5a"):
          conv5a = conv2d_leaky(conv4b, [3, 3, 96, 128], [128], 2, True)
        with tf1.variable_scope("conv5b"):
          conv5b = conv2d_leaky(conv5a, [3, 3, 128, 128], [128], 1, True)
        features.append(conv5b)

      if self.numScale_ == 6:
        with tf1.variable_scope("conv6a"):
          conv6a = conv2d_leaky(conv5b, [3, 3, 128, 192], [192], 2, True)
        with tf1.variable_scope("conv6b"):
          conv6b = conv2d_leaky(conv6a, [3, 3, 192, 192], [192], 1, True)
        features.append(conv6b)
      return features

    # Single scale estimator
    def buildEstimator(self, features, upsampled_disp=None):
      if upsampled_disp is not None:
        disp2 = tf.concat([features, upsampled_disp], -1)
      else:
        disp2 = features
      with tf1.variable_scope("disp-3") as scope:
        disp3 = conv2d_leaky(disp2, [3, 3, disp2.shape[3], 96], [96], 1, True)
      with tf1.variable_scope("disp-4") as scope:
        disp4 = conv2d_leaky(disp3, [3, 3, disp3.shape[3], 64], [64], 1, True)
      with tf1.variable_scope("disp-5") as scope:
        disp5 = conv2d_leaky(disp4, [3, 3, disp4.shape[3], 32], [32], 1, True)
      with tf1.variable_scope("disp-6") as scope:
        # 8 channels for compatibility with @other@ devices
        disp6 = conv2d_leaky(disp5, [3, 3, disp5.shape[3], 8], [8], 1, False)
      return disp6

    # Upsampling layer
    def bilinearUpsamplingByDeconvolution(self,x):
      f = x.get_shape().as_list()[-1]
      return deconv2d_leaky(x, [2, 2, f, f], f, 2, True)

    # Disparity prediction layer
    def getDisp(self, x):
      disp = tf.nn.sigmoid(tf.slice(x, [0,0,0,0], [-1,-1,-1,1]))
      return disp

    # Build multi-scale outputs
    def buildOutputs(self):
      shape = tf.shape(input=self.placeholders_['im0'])
      size = [shape[1], shape[2]]
      self.results_ = tf.image.resize(self.disp2_, size), \
                      tf.image.resize(self.disp3_, size), \
                      tf.image.resize(self.disp4_, size)

    # Defining loss function.
    def buildLosses(self):
      alphaImageLoss = 0.85

      # Scale the disparity map to compare with the predictions.
      self.scaledGT_ = []
      gtDisp = self.placeholders_['gt']
      inputImg = self.placeholders_['im0']
      height = tf.shape(inputImg)[1]
      width = tf.shape(inputImg)[2]
      for i in range(1, self.numScale_ + 1):
        ratio = 2 ** i
        self.scaledGT_.append(tf.cast(tf.image.resize(gtDisp, [height / ratio, width/ratio]), \
                              tf.float32))

      # Get predictions and match to disp shape.
      predictions = [self.disp2_, self.disp3_, self.disp4_, self.disp5_]
      if (self.numScale_ >= 5):
        predictions.append(self.disp6_)
      if (self.numScale_ == 6):
        predictions.append(self.disp7_)
      self.dispPred_ = [tf.expand_dims(d[:,:,:,0],3) for d in predictions]

      # Calculate image loss from ssim and l1.
      self.l1_ = [tf.abs(self.dispPred_[i] - self.scaledGT_[i]) for i in range(self.numScale_)]
      self.ssim_ = []
      for i in range(self.numScale_):
        self.ssim_.append(self.getSSIM(self.dispPred_[i], self.scaledGT_[i]))
      self.l1Loss_ = []
      self.ssimLoss_ = []
      self.reconstruction_ = []
      for i in range(self.numScale_):
        self.l1Loss_.append(tf.reduce_mean(self.l1_[i]))
        self.ssimLoss_.append(tf.reduce_mean(self.ssim_[i]))

        reconstruction = alphaImageLoss * self.ssimLoss_[i] + (1-alphaImageLoss) * self.l1Loss_[i]
        self.reconstruction_.append(reconstruction)
      self.imgLoss_ = tf.add_n(self.reconstruction_)

      # Disparity smoothness.
      self.dispSmoothnessX_ = self.getDispSmoothnessX(self.dispPred_, self.scaledGT_)
      self.dispSmoothnessY_ = self.getDispSmoothnessY(self.dispPred_, self.scaledGT_)

      # Weigh the smoothness loss for each level.
      self.smoothnessLoss_ = []
      for i in range(self.numScale_):
        ratio = 2 ** i
        smoothnessLossX = tf.reduce_mean(tf.abs(self.dispSmoothnessX_[i])) / ratio
        smoothnessLossY = tf.reduce_mean(tf.abs(self.dispSmoothnessY_[i])) / ratio
        self.smoothnessLoss_.append(smoothnessLossX + smoothnessLossY)
      self.totalSmoothnessLoss_ = tf.add_n(self.smoothnessLoss_)

      self.totalLoss_ = self.imgLoss_ + self.gradientLossWeight_ * self.totalSmoothnessLoss_

    # Performs 3x3 block filter.
    def blockFilter(self, x):
      return tf.nn.avg_pool2d(x, 3, 1, 'VALID')

    # Calculate ssim with 3x3 block filtering.
    def getSSIM(self, pred, gt):
      C1 = 0.01 ** 2
      C2 = 0.03 ** 2

      predMean = self.blockFilter(pred)
      predMeanSq = predMean ** 2
      gtMean = self.blockFilter(gt)
      gtMeanSq = gtMean ** 2
      l = (2 * predMean * gtMean + C1) / (predMeanSq + gtMeanSq + C1)

      predVar = self.blockFilter(pred ** 2) - predMeanSq
      gtVar = self.blockFilter(gt ** 2) - gtMeanSq
      predGtStd = self.blockFilter(pred * gt) - predMean * gtMean
      cs =  (2 * predGtStd + C2) / (predVar + gtVar + C2)

      return tf.clip_by_value((1 -l * cs)/2, 0,1)

    # Calculations for disparity smoothness.
    def getSmoothness(self, predGrads, gtGrads):
      smoothness = []
      for i in range(len(predGrads)):
        s = predGrads[i] * tf.exp(-tf.reduce_mean(tf.abs(gtGrads[i]), 3, keepdims=True))
        smoothness.append(s)
      return smoothness

    def getDispSmoothnessX(self, pred, gt):
      predGradX = [s[:,:,:-1,:] - s[:,:,1:,:] for s in pred]
      gtGradX = [s[:,:,:-1,:] - s[:,:,1:,:] for s in gt]

      return self.getSmoothness(predGradX, gtGradX)

    def  getDispSmoothnessY(self, pred, gt):
      predGradY = [s[:,:-1,:,:] - s[:,1:,:,:] for s in pred]
      gtGradY = [s[:,:-1,:,:] - s[:,1:,:,:] for s in gt]

      return self.getSmoothness(predGradY, gtGradY)

    # Build summaries to display on tensorboard.
    def buildSummaries(self):
      for i in range(self.numScale_):
        tf1.summary.scalar('l1Loss_' + str(i+1), self.l1Loss_[i], collections=self.collection_)
        tf1.summary.scalar('ssimLoss_' + str(i+1), self.ssimLoss_[i], collections=self.collection_)
        tf1.summary.scalar('reconstruction_loss' + str(i+1), self.reconstruction_[i],
                            collections=self.collection_)
        tf1.summary.scalar('gradient_loss_' + str(i+1), self.smoothnessLoss_[i],
                            collections=self.collection_)

        tf1.summary.image('gtDisp_' + str(i+1), self.scaledGT_[i], max_outputs=1,
                          collections=self.collection_)
        tf1.summary.image('dispPred_' + str(i+1), self.dispPred_[i], max_outputs=1,
                          collections=self.collection_)
        tf1.summary.image('ssim_' + str(i+1), self.ssim_[i], max_outputs=1,
                          collections=self.collection_)
        tf1.summary.image('l1_' + str(i+1), self.l1_[i], max_outputs=1,
                          collections=self.collection_)
      tf1.summary.scalar('total_loss', self.totalLoss_, collections=self.collection_)
      tf1.summary.image('input_image', self.placeholders_['im0'], max_outputs=1,
                        collections=self.collection_)

# Copied from layers
# Hand-made leaky relu
def leaky_relu(x, alpha=0.2):
  return tf.maximum(x, alpha * x)

# 2D convolution wrapper
def conv2d_leaky(x, kernel_shape, bias_shape, strides=1, relu=True, padding='SAME'):
  # Conv2D
  weights = tf.compat.v1.get_variable(
    "weights",
    kernel_shape,
    initializer=tf.compat.v1.keras.initializers.VarianceScaling(
      seed=SEED,
      scale=1.0,
      mode="fan_avg",
      distribution="uniform"),
    dtype=tf.float32)
  biases = tf.compat.v1.get_variable(
    "biases",
    bias_shape,
    initializer=tf.compat.v1.truncated_normal_initializer(seed=SEED),
    dtype=tf.float32)
  output = tf.nn.conv2d(input=x, filters=weights, strides=[1, strides, strides, 1], padding=padding)
  output = tf.nn.bias_add(output, biases)
  # ReLU (if required)
  if relu:
    output = leaky_relu(output, 0.2)
  return output

# 2D deconvolution wrapper
def deconv2d_leaky(x, kernel_shape, bias_shape, strides=1, relu=True, padding='SAME'):
  # Conv2D
  weights = tf.compat.v1.get_variable("weights", kernel_shape,
    initializer=tf.compat.v1.keras.initializers.VarianceScaling(scale=1.0, mode="fan_avg",
    distribution="uniform", seed=SEED), dtype=tf.float32)
  biases = tf.compat.v1.get_variable("biases", bias_shape,
    initializer=tf.compat.v1.truncated_normal_initializer(seed=SEED), dtype=tf.float32)
  x_shape = tf.shape(input=x)
  outputShape = [x_shape[0],x_shape[1]*strides,x_shape[2]*strides,kernel_shape[2]]
  output = tf.nn.conv2d_transpose(x, weights, output_shape=outputShape, strides=[1, strides,
    strides, 1], padding=padding)
  output = tf.nn.bias_add(output, biases)
  # ReLU (if required)
  if relu:
    output = leaky_relu(output, 0.2)
  return output
