'''
Copyright (c) 2021 8th Wall, Inc.
Original Author: Lynn Dang (lynn@8thwall.com)

Helper functions for depthnet training and evaluation
'''
import h5py
import tensorflow as tf
import tensorflow.compat.v1 as tf1
import numpy as np
import cv2
import glob
import os
from depthnet import depthnet
import random

class DataReader(object):
  def __init__(self, directoryPath, batchSize, maxDim, relativeDepth=False, shuffleData=True):
    '''
    @param directoryPath: string to root directory of either training, val, or test dataset.
    @param batchSize: int size of the batch.
    @param maxDim: the max dimensions of either the width or height of the image.
    @param relativeDepth: if false, it will clip the depth values between 0 and 15 and then scale
    between 0 and 1.  If true, it will divide the entire scene by the max depth value.
    @param shuffleData: if True, the data will be shuffled.
    '''
    self.batchSize_ = batchSize
    self.directoryPath_ = directoryPath
    self.relativeDepth_ = relativeDepth
    self.shuffleData_ = shuffleData
    self.resetDirectory()

    # If maxDim is 0, it will retain the shape of the original image
    self.maxDim_ = maxDim
    self.dsSize_ = len(self.arkitFiles_) + len(self.hypersimFiles_)
    self.arkitIndex_ = 0
    self.hypersimIndex_ = 0

  def resetDirectory(self):
    self.arkitFiles_ = []
    for dir,_,_ in os.walk(os.path.join(self.directoryPath_, 'arkit')):
      self.arkitFiles_.extend(glob.glob(os.path.join(dir, '*.png')))
      # our older datasets used jpg so this is for backwards compatibility.
      self.arkitFiles_.extend(glob.glob(os.path.join(dir, '*.jpg')))

    self.hypersimFiles_ = []
    for dir,_,_ in os.walk(os.path.join(self.directoryPath_, 'hypersim')):
      self.hypersimFiles_.extend(glob.glob(os.path.join(dir, '*.png')))
      # our older datasets used jpg so this is for backwards compatibility.
      self.hypersimFiles_.extend(glob.glob(os.path.join(dir, '*.jpg')))

    # Sort for reproducibility.
    self.arkitFiles_.sort()
    self.hypersimFiles_.sort()

    if self.shuffleData_:
      random.shuffle(self.arkitFiles_)
      random.shuffle(self.hypersimFiles_)


  def loadData(self, dataset='all', augment=False, numSamples=0):
    '''
    Load in the images and depth batches.  Expects directory structure:
      Arkit Input RGB image: <directory>/arkit/images/log.*.png
      Arkit Depth label:     <directory>/arkit/ground-truth/log.*.bin
      Hypersim:              <directory>/hypersim/

    @param augment: bool for if we should augment the data
    @param numSamples: number of pairs of data that will be returned
    '''
    if not numSamples:
      numSamples = self.batchSize_

    if (not len(self.arkitFiles_) and not len(self.hypersimFiles_)):
      raise Exception('You do not have any data')

    if dataset == 'all':
      useARkit = random.choices([True, False], [len(self.arkitFiles_), len(self.hypersimFiles_)])[0]
    else:
      useARkit = dataset == 'arkit'

    # Do ARKit shuffling if we need to.
    if (len(self.arkitFiles_) - self.arkitIndex_ < numSamples):
      self.arkitIndex_ = 0
      if self.shuffleData_:
        random.shuffle(self.arkitFiles_)

    # Do Hypersim shuffling if we need to.
    if (len(self.hypersimFiles_) - self.hypersimIndex_ < numSamples):
      self.hypersimIndex_ = 0
      if self.shuffleData_:
        random.shuffle(self.hypersimFiles_)

    np.seterr(divide='ignore', invalid='ignore')
    unmatchedImages = []
    # Batch data is a list of dictionaries.  Each dictionary is for a corresponding image-depth pair
    # and its associated data.  This allows us to easily return data about each individual sample.
    batchData = []

    # Select the batch as a random sample of the total number of the images.
    for i in range(numSamples):
      if useARkit:
        if self.arkitIndex_ >= len(self.arkitFiles_):
          print('ERROR: insufficient number of ARKit data ({}) for the requested samples ({})'
                .format(len(self.arkitFiles_), numSamples))
          break

        imgPath = self.arkitFiles_[self.arkitIndex_]
        depthPath = (imgPath.replace('/images/', '/ground-truth/')
                            .replace('.png', '.bin')
                            .replace('.jpg', '.bin'))
        self.arkitIndex_ += 1
      else:
        if self.hypersimIndex_ >= len(self.hypersimFiles_):
          print('ERROR: insufficient number of Hypersim data ({}) for the requested samples ({})'
                .format(len(self.hypersimFiles_), numSamples))
          break

        imgPath = self.hypersimFiles_[self.hypersimIndex_]
        depthPath = imgPath.replace("final_preview", "geometry_hdf5")
        depthPath = (depthPath.replace("color.png", "depth_meters.hdf5")
                              .replace('color.jpg', 'depth_meteres.hdf5'))
        self.hypersimIndex_ += 1

      if (not os.path.exists(depthPath)):
        unmatchedImages.append(depthPath)
        print('ERROR: Unable to find depth file for img: {}'.format(imgPath))
        i -= 1
        continue

      img, depth, sampleStats = self.processImage(imgPath, depthPath)

      if augment:
        img, depth = self.augmentData(img, depth)

      batchData.append({
        # RGB input is normalized between 0 and 1 and potentially augmented.
        'rgb_image': img,
        # Depth is normalized between 0 and 1, may be in either absolute or relative scale, and
        # potentially is an inverse map.
        'depth': depth,
        'rgb_path': imgPath,
        'depth_path': depthPath,
        **sampleStats,
      })

    rgbImages = [b['rgb_image'] for b in batchData]
    depths = [b['depth'] for b in batchData]

    return rgbImages, depths, batchData

  # Processes the files as bgr image and disparity tensors.
  def processImage(self, imgPath, depthPath):
    img = cv2.imread(imgPath)
    # By default, OpenCV imports in BGR format.  Specify RGB.
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    width = np.shape(img)[1]
    height = np.shape(img)[0]

    fileType = depthPath.split(".")
    if (fileType[-1] == "bin"):
      if (self.maxDim_ and height > self.maxDim_):
        scale = height / self.maxDim_
        width = int(width / scale)
        height = int(height / scale)

      depth = np.fromfile(depthPath, dtype=np.float32).reshape(256, 192, 1)
    elif (fileType[-1] == "hdf5"):
      if (self.maxDim_ and width > self.maxDim_):
        scale = width / self.maxDim_
        width = int(width / scale)
        height = int(height / scale)

      with h5py.File(depthPath, "r") as f:
        a_group_key = list(f.keys())[0]
        data = f[a_group_key][:]
        depth = data.reshape(192, 256, 1) # Fixed hypersim dimensions.

    trueMin = depth.min()
    trueMax = depth.max()

    # Resizing the image input if necessary. Depth resizing will happen when calculating the loss.
    if (width != np.shape(img)[1]) or (height != np.shape(img[0])):
      img = cv2.resize(img, (width, height))
    img = img.astype(np.float32) / 255.

    # If we're using absolute depth, limit the max depth to 15.  Otherwise use the ground truth's
    # max depth.
    maxDepth = depth.max() if self.relativeDepth_ else 15.0
    minDepth = 1 / maxDepth
    depth = np.clip(depth, minDepth, maxDepth)
    depth = 1 / (maxDepth * depth)

    # Since hypersim has some nan pixels due to missing geometry.
    depth = np.nan_to_num(depth, nan=maxDepth)

    return (
      img,
      depth,
      {
        # The true depth in meters of the ground truth.
        'true_min_depth': trueMin,
        'true_max_depth': trueMax,
        # The label's min and max depth in meters.
        'max_depth': maxDepth,
        'min_depth': minDepth,
        'is_relative': self.relativeDepth_,
        # The normalized min and max depth.
        'normalized_min': depth.min(),
        'normalized_max': depth.max(),
      }
    )

  # Performs data augmentation.
  def augmentData(self, img, disp):
    augmentedImg = img
    augmentedDisp = disp

    # Horizontal flip
    random_num = random.randint(0,1)
    if random_num == 1:
      augmentedImg =  np.fliplr(augmentedImg)
      augmentedDisp = np.fliplr(augmentedDisp)

    # Random gamma correction
    augmentedImg = augmentedImg ** (random.randint(8, 12) / 10.0)

    # Shift brightness
    augmentedImg = augmentedImg * (random.randint(5, 20) / 10.0)

    # Shift color
    h = np.shape(img)[0]
    w = np.shape(img)[1]
    colors = np.stack([np.ones([h, w]) * (random.randint(8, 12) / 10.0) for i in range(3)], axis=2)
    augmentedImg *= colors

    # Clip the image back to expected values
    augmentedImg = np.clip(augmentedImg, 0, 1)

    return augmentedImg, augmentedDisp

def freezeGraph(outputDir, checkpointDir, maxDim=256, scale=6):
  with tf.Graph().as_default():
    # Scale the input size
    if (maxDim and maxDim < 640):
      imageScale = 640 / maxDim
      height = int(640 / imageScale)
      width = int(480 / imageScale)
    else:
      height = 256
      width = 192

    # Paths for the output model files.
    frozenPath = os.path.join(outputDir, "frozen_depthnet.pb")
    placeholders = {'im0': tf.compat.v1.placeholder(tf.float32, [1, height, width, 3], name='im0')}

    # Check if output directory exists or not. Create if it doesn't exist.
    if not os.path.exists(outputDir):
      os.makedirs(outputDir)

    with tf1.variable_scope("model") as scope:
      model = depthnet(placeholders, scale=scale)

    init = tf.group(tf1.global_variables_initializer(),
                    tf1.local_variables_initializer())
    loader = tf1.train.Saver()

    with tf1.Session() as sess:
      sess.run(init)
      loader.restore(sess, checkpointDir)

      # Input and output node names.
      inputNames = ["im0"]
      outputNames = [model.results_[0].name.replace(":0", "")]

      # Freeze the graph.
      frozenGraph = tf1.graph_util.convert_variables_to_constants(
        sess,
        tf1.get_default_graph().as_graph_def(),
        outputNames
      )

      with tf1.gfile.GFile(frozenPath, "wb") as f:
        f.write(frozenGraph.SerializeToString())

  return frozenPath, inputNames, outputNames

# Exports the checkpoint file to tflite.
def exportDepthnet(outputDir, inputNames, outputNames,frozenPath):
  tflitePath = os.path.join(outputDir, "depthnet.tflite")

  # Converts to tflite.
  converter = tf1.lite.TFLiteConverter.from_frozen_graph(
    frozenPath, inputNames, outputNames
  )
  tfliteModel = converter.convert()
  with open(tflitePath, "wb") as f:
    f.write(tfliteModel)

  print("Tflite model created at ",  tflitePath)
