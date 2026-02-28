'''
Copyright (c) 2021 8th Wall, Inc.
Original Author: Nathan Waters (nathan@8thwall.com)

Simple tool for migrating data between our training/ validation/ and test/ datasets.

Run with: python3 migrate-data --num_sequences <n> --src <dataset> --dest <dataset>
                  --datasetsDir /path/to/root/dir/

For example:
  python3 migrate-data.py -n 3 -s training -o validation -d ~/datasets/depth-data/
'''

import argparse
import os
import glob
import random

DATASETS = ['training', 'validation', 'test']

def migrate(numSequences, srcDataset, destDataset, datasetsDir):
  print('Migrating {} sequences from {} to {} in {}'.format(
    numSequences, srcDataset, destDataset, datasetsDir))

  srcDir = os.path.join(datasetsDir, srcDataset, 'arkit')
  destDir = os.path.join(datasetsDir, destDataset, 'arkit')

  # Log files follow this format typically but not always: log.1627664911-600-0-preview.jpg.
  srcImages = glob.glob(os.path.join(srcDir, 'images', '*.jpg'))
  # Group the sequences by their first 15 characters i.e. "log.1627664911".
  allSequences = [srcImage.split('/')[-1][:15] for srcImage in srcImages]
  allSequences = list(set(allSequences))
  # Select n number of sequences to be transferred over.
  selectedSequences = random.sample(allSequences, numSequences)

  for sequence in selectedSequences:
    # Get corresponding RGB images for the selected sequence.
    sequenceRGBImages = glob.glob(
      os.path.join(srcDir, 'images', '{}*.jpg'.format(sequence)))
    # Get corresponding depth labels for the selected sequence.
    sequenceDepthLabel = glob.glob(
      os.path.join(srcDir, 'ground-truth', '{}*.bin'.format(sequence)))

    if len(sequenceRGBImages) != len(sequenceDepthLabel):
      errorMsg = ('Incorrect number of input rgb images ({}) and ground truth labels ({}) for {}'
                  .format(len(sequenceRGBImages), len(sequenceDepthLabel), sequence))
      raise Exception(errorMsg)

    sequenceRGBImages.sort()
    sequenceDepthLabel.sort()

    prompt = (
      '{}\n\nDo you want to migrate the above {} pairs from {} to {}?\n(y/n)\n'.format(
        '\n'.join(['{} | {}'.format(
          sequenceRGBImages[i], sequenceDepthLabel[i]) for i in range(len(sequenceRGBImages))]),
        len(sequenceRGBImages),
        srcDir,
        destDir))

    if (input(prompt) == 'y'):
      for i in range(len(sequenceRGBImages)):
        rgbImage = sequenceRGBImages[i].split('/')[-1]
        depthLabel = sequenceDepthLabel[i].split('/')[-1]
        os.rename(os.path.join(srcDir, 'images', rgbImage),
                  os.path.join(destDir, 'images', rgbImage))
        os.rename(os.path.join(srcDir, 'ground-truth', depthLabel),
                  os.path.join(destDir, 'ground-truth', depthLabel))

if __name__ == "__main__":
  parser = argparse.ArgumentParser(description='migrate-data')

  parser.add_argument(
    '--num_sequences', '-n',
    dest='numSequences',
    type=int,
    required=True,
    help='The number of sequences this will be moved into the new dataset'
  )
  parser.add_argument(
    '--src', '-s',
    dest='src',
    type=str,
    required=True,
    choices=DATASETS,
    help='The dataset that the sequences will be removed from'
  )
  parser.add_argument(
    '--dest', '-o',
    dest='dest',
    type=str,
    required=True,
    choices=DATASETS,
    help='The dataset that the sequences will be moved to'
  )
  parser.add_argument(
    '--datasetsDir', '-d',
    dest='datasetsDir',
    type=str,
    required=True,
    help='Path to directory that contains your datasets: {}'.format(DATASETS)
  )

  args = parser.parse_args()

  migrate(args.numSequences, args.src, args.dest, args.datasetsDir)
