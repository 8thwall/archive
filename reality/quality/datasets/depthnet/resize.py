'''
Copyright (c) 2021 8th Wall, Inc.
Original Author: Lynn Dang (lynn@8thwall.com)

Simple tool to resize images and depths before training.
Usage: python3 resize.py --dataset path/to/src --output path/to/dest
'''
import cv2
import argparse
import os
import numpy as np
from tqdm import tqdm
import glob
import shutil
import tensorflow as tf
import h5py

parser = argparse.ArgumentParser(description='Argument parser')
parser.add_argument(
  '--dataset',
  dest='datasetDir',
  type=str,
  required=True,
  help='path to dataset that needs resizing, assumes that hypersim depth is the original'
        'size 768x1024. the dataset can be in any directory format, and it will copy exactly the'
        'same format')
parser.add_argument(
  '--output',
  dest='outputDir',
  type=str,
  required=True,
  help='path to destination for the copied, resized dataset')
parser.add_argument(
  '--maxDim',
  dest='maxDim',
  type=int,
  default=256,
  help='desired maximum dimension of image, height for arkit and width for hypersim')

args = parser.parse_args()

HYPERSIM_WIDTH = 1024
HYPERSIM_HEIGHT = 768
HYPERSIM_SCALE = HYPERSIM_WIDTH / args.maxDim

def resizeHypersim(depthPath, maxDim):
    height = int(768 / HYPERSIM_SCALE)
    width = maxDim

    with h5py.File(depthPath, "r") as f:
        a_group_key = list(f.keys())[0]
        data = f[a_group_key][:]
        depth = data.reshape(768, 1024, 1) # Original hypersim dimensions.

    # Limit the depth to 1/15 to 15 to easily scale the disparities between 0 and 1.
    maxDepth = 15.0
    depth = np.clip(depth, 1.0 / maxDepth, maxDepth)

    # Since hypersim has some nan pixels due to missing geometry.
    depth = np.nan_to_num(depth, nan=maxDepth)

    # Resize the depth similar to the way training does it.
    depthTensor = tf.convert_to_tensor(depth)
    depthTensor = tf.image.resize(depthTensor, (height, width))

    return depthTensor.numpy().reshape(-1)

def main():
  # Obtain all the files.
  directories = []
  imgFiles = []
  depths = []
  for dir,_,_ in os.walk(os.path.join(args.datasetDir)):
    directories.extend([dir[len(args.datasetDir)+1:]])
    # Take any image files, but they'll all be png by the end of this resizing.
    imgFiles.extend(glob.glob(os.path.join(dir, '*.jpg')))
    imgFiles.extend(glob.glob(os.path.join(dir, '*.png')))

    # Get the depths.
    depths.extend(glob.glob(os.path.join(dir, '*.bin')))
    depths.extend(glob.glob(os.path.join(dir, '*.hdf5')))

  # Create the directories to mirror the input dataset.
  for dir in directories:
    path = os.path.join(args.outputDir, dir)
    if not os.path.exists(path):
        os.makedirs(path)

  print("[resize] Copying depths.")
  # Copy depths.
  for depthPath in tqdm(depths):
    destination = depthPath.replace(args.datasetDir, args.outputDir)
    if ".hdf5" in depthPath:  # Resize the depths for hypersim since it's such a big file.
      resizeDepth = resizeHypersim(depthPath, args.maxDim)
      newDepthFile = h5py.File(destination, 'w')
      newDepthFile.create_dataset('depths', data= resizeDepth)
      newDepthFile.close()
    else:
      shutil.copy2(depthPath, destination)

  print("[resize] Copying images.")
  # Resize images.
  for imgPath in tqdm(imgFiles):
    destination = imgPath.replace(args.datasetDir, args.outputDir)
    destination = destination.replace('.jpg', '.png')
    img = cv2.imread(imgPath)
    width = np.shape(img)[1]
    height = np.shape(img)[0]

    if height > width:
      scale = height / args.maxDim
    else:
      scale = width / args.maxDim
    if scale != 1:
      img = cv2.resize(img, (int(width / scale), int(height / scale)))
    cv2.imwrite(destination, img)

if __name__ == '__main__':
  main()
