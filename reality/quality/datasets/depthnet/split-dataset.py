'''
Copyright (c) 2021 8th Wall, Inc.
Original Author: Lynn Dang (lynn@8thwall.com)

Splits the dataset to train, test, validation. It can either take the path to the dataset, or a txt
of filenames. It will then select the number of sequences for train, test, and validation, and copy
the files into the destination folder. This supports data from arkit and hypersim.

Run with: python3 split-dataset --src path/to/src --dest path/to/destination --dataset DATASET
'''
import argparse
import os
import glob
import random
import sys
import shutil
from tqdm import tqdm

DATASETS = ['arkit', 'hypersim']

parser = argparse.ArgumentParser(description='Argument parser')

parser.add_argument(
  '--src',
  dest='src',
  type=str,
  required=True,
  help='file with the full path to the jpg images, or directory of the dataset. For arkit, it will'
      'expect a directory with a folder of images and ground-truth. For hypersim it will expect a'
      'directory with folder split in the hypersim downloaded format'
)
parser.add_argument(
  '--dest',
  dest='dest',
  type=str,
  required=True,
  help='file destination directory'
)
parser.add_argument(
  '--train',
  dest='train',
  type=int,
  default=80,
  help='percentage of images to train'
)
parser.add_argument(
  '--val',
  dest='val',
  type=int,
  default=10,
  help='percentage of images for validation'
)
parser.add_argument(
  '--dataset',
  dest='dataset',
  type=str,
  required=True,
  choices=DATASETS,
  help='The dataset the sequences are coming from'
)

args = parser.parse_args()

# Returns the depth data file.
def getFileLine(filename):
  if args.dataset == DATASETS[0]:
    gt_name = filename.strip().replace("images", "ground-truth")
    gt_name = gt_name.replace("jpg", "bin")
  elif args.dataset == DATASETS[1]:
    gt_name = filename.strip().replace("final_preview", "geometry_hdf5")
    gt_name = gt_name.replace("color.jpg", "depth_meters.hdf5")
  return gt_name

# Copies the list files to the directory.
def copyFiles(listFiles, directory):
  for file in listFiles:
    shutil.copy2(file.strip(), directory)

# Copies the sequences to the destination directory.
def copySequences(srcImages, sequences, destDirectory):
  if args.dataset == DATASETS[0]:
    destImgDir = os.path.join(destDirectory, "images")
    destDepthDir = os.path.join(destDirectory, "ground-truth")
  for i in tqdm(range(len(sequences))):
    imgList = [s for s in srcImages if sequences[i] in s]
    depthList = [getFileLine(s) for s in imgList]

    if args.dataset == DATASETS[1]:
      destImgDir = os.path.join(destDirectory, sequences[i])
      destDepthDir = os.path.join(destDirectory, sequences[i]).replace("final_preview",
        "geometry_hdf5")
    if not os.path.exists(destImgDir):
      os.makedirs(destImgDir)
    if not os.path.exists(destDepthDir):
      os.makedirs(destDepthDir)

    copyFiles(imgList, destImgDir)
    copyFiles(depthList, destDepthDir)

def main(argv):
  # Typically left in the same directory as the dataset.
  trainPath = os.path.join(args.dest, "training", args.dataset)
  valPath = os.path.join(args.dest, "validation", args.dataset)
  testPath = os.path.join(args.dest, "test", args.dataset)

  if not os.path.exists(trainPath):
    os.makedirs(trainPath)
  if not os.path.exists(valPath):
    os.makedirs(valPath)
  if not os.path.exists(testPath):
    os.makedirs(testPath)

  if ".txt" in args.src: # If it reads in a list of filenames.
    with open(args.src) as f:
      srcImages = f.readlines()
  else:
    if args.dataset == DATASETS[0]: # arkit
      if not os.path.exists(os.path.join(args.src, 'images')) or \
        not os.path.exists(os.path.join(args.src, 'ground-truth')):
        print("Invalid arkit format. The source folder expects directories of images and"
              " ground-truth")
        return
      srcImages = glob.glob(os.path.join(args.src, 'images', '*.jpg'))
    if args.dataset == DATASETS[1]: # hypersim
      srcImages = []
      for dir,_,_ in os.walk(args.src):
        srcImages.extend(glob.glob(os.path.join(dir, '*.jpg')))

  # Identify the sequences.
  if args.dataset == DATASETS[0]: # arkit
    # Group the sequences by their first 15 characters i.e. "log.1627664911".
    allSequences = [srcImage.split('/')[-1][:15] for srcImage in srcImages]
  if args.dataset == DATASETS[1]: # hypersim
    allSequences = set()
    for srcImage in srcImages:
      if srcImage == "\n": continue
      names = srcImage.split("/")
      directory = names[len(names) - 2]
      directory = os.path.join(names[len(names) - 3], directory)
      directory = os.path.join(names[len(names) - 4], directory)
      allSequences.add(directory)
  allSequences = list(set(allSequences))

  # Calculate the split.
  numFiles = int(len(srcImages))
  numTrain = int(len(allSequences) * args.train / 100)
  numVal = int(len(allSequences) * args.val / 100)

  # Splits number of train, val, test sequences.
  random.shuffle(allSequences)
  train_sequences = []
  val_sequences = []
  test_sequences = []
  for i in range(numTrain):
    directory = allSequences[i]
    train_sequences.append(directory)
  for i in range(numVal):
    directory = allSequences[numTrain + i]
    val_sequences.append(directory)
  test_sequences = allSequences[numTrain + numVal:]

  print("Train", len(train_sequences))
  print("Val: ", len(val_sequences))
  print("Test: ", len(test_sequences))
  print("Total Directories: ", len(allSequences))

  # Copies the sequences.
  copySequences(srcImages, train_sequences, trainPath)
  copySequences(srcImages, val_sequences, valPath)
  copySequences(srcImages, test_sequences, testPath)

  # Checking number of files.
  countedFiles = []
  countedDepths = []
  for dir,_,_ in os.walk(trainPath):
    countedFiles.extend(glob.glob(os.path.join(dir, '*.jpg')))
    countedDepths.extend(glob.glob(os.path.join(dir, '*.hdf5')))
    countedDepths.extend(glob.glob(os.path.join(dir, '*.bin')))
  print("Missing train files: ", len(countedFiles) - len(countedDepths))
  expectedTrain = len(countedFiles)
  countedFiles = []
  countedDepths = []
  for dir,_,_ in os.walk(valPath):
    countedFiles.extend(glob.glob(os.path.join(dir, '*.jpg')))
    countedDepths.extend(glob.glob(os.path.join(dir, '*.hdf5')))
    countedDepths.extend(glob.glob(os.path.join(dir, '*.bin')))
  print("Missing val files: ", len(countedFiles) - len(countedDepths))
  expectedVal = len(countedFiles)
  countedFiles = []
  countedDepths = []
  for dir,_,_ in os.walk(testPath):
    countedFiles.extend(glob.glob(os.path.join(dir, '*.jpg')))
    countedDepths.extend(glob.glob(os.path.join(dir, '*.hdf5')))
    countedDepths.extend(glob.glob(os.path.join(dir, '*.bin')))
  print("Missing test files: ", len(countedFiles) - len(countedDepths))
  expectedTest = len(countedFiles)

  print("Files for train: ", expectedTrain)
  print("Files for validation: ", expectedVal)
  print("Files for test: ", expectedTest)
  print("Num images added:", len(srcImages))

if __name__ == "__main__":
  main(sys.argv[1:])
