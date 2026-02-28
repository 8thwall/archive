'''
Copyright (c) 2021 8th Wall, Inc.
Original Author: Lynn Dang (lynn@8thwall.com)
Training script for depthnet that takes in monocular image and disparity values. Outputs checkpoints
and a tflite at the end of training.

Run with:

 - python3 train.py --batch_size 8 --max_dim 256 --log_dir /path/to/model --name model-name \
    --num_epochs 500 --num_scale 6 --datasets /path/to/dataset
'''
from tqdm import tqdm
import tensorflow as tf
import tensorflow.compat.v1 as tf1
import os
import argparse
import sys
import wandb_utils
import numpy as np
from statistics import mean
from depthnet import depthnet
import random
from seed import set_seed
from datautils import *
import wandb

# Possible datasets
DATASETS = ['arkit', 'hypersim', 'all']
# Number of samples that we test against in the validation and test set.  The test set samples will
# be rendered as a table in W&B.
NUM_SAMPLES = 64

# Configure training params
parser = argparse.ArgumentParser(description='Argument parser')

parser.add_argument(
  '--name', '-n',
  dest='experimentName',
  type=str,
  required=True,
  help=('A descriptive name of your experiment'))
parser.add_argument(
  '--datasets',
  dest='datasetsDir',
  type=str,
  # When training on AWS, --datasets will be $SM_CHANNEL_TRAIN, which is directory of the cloned s3
  # bucket.  The bucket is defined in remote-train.py's TRAINING_DATA_URI.
  default='depth-data',
  help=('Directory that contains the test/, training/, and validation/ dataset directories.  Each '
        'dataset directory has two subdirectories named arkit/ and hypersim/. arkit should include'
        'subdirectories images/ and ground-truth/.'))
parser.add_argument(
  '--log_dir',
  dest='logDir',
  type=str,
  default='model/',
  help='model directory including log files'
)
parser.add_argument(
  '--model',
  dest='modelName',
  type=str,
  default="depthnet",
  help='name of the model'
)
parser.add_argument(
  '--ckpt',
  dest='ckpt',
  type=str,
  default='',
  help='path to checkpoint to continue training'
)
parser.add_argument(
  '--retrain',
  dest='retrain',
  action='store_true',
  help='Restart training checkpoint to step 0'
)
parser.add_argument(
  '--batch_size',
  dest='batchSize',
  type=int,
  default=8,
  help='Batch size, which is the number of examples processed before a gradient update.'
)
parser.add_argument(
  '--num_epochs', '-e',
  dest='numEpochs',
  type=int,
  default=50,
  help='Number of epochs, which is a full cycle through the training data.'
)
parser.add_argument(
  '--learning_rate',
  dest='learningRate',
  type=float,
  default=1e-4,
  help='starting learning rate.'
)
parser.add_argument(
  '--max_dim',
  dest='maxDim',
  type=int,
  default=256,
  help=('Maximum dimension, which will be the height of datarecorder and the width of hypersim data'
        'The datarecorder input is expected to be a portrait 640x480, and the hypersim input is'
        'expected to be a landscape 768x1024')
)
parser.add_argument(
  '--num_scale',
  dest='numScale',
  type=int,
  default=6,
  help='Number of depthnet layers.'
)
parser.add_argument(
  '--subset',
  dest='subset',
  type=str,
  default='all',
  choices=DATASETS,
  help='The dataset the sequences are coming from'
)
parser.add_argument(
  '--log_wandb', '-w',
  dest='logWandB',
  action='store_true',
  help='Logs the experiment to Weights & Biases'
)
parser.add_argument(
  '--use_relative_depth', '-r',
  dest='useRelativeDepth',
  action='store_true',
  help='Uses relative depth instead of absolute depth'
)
args = parser.parse_args()

# Configure depthnet for training.
def train():
  # Only allow 4-6 layers
  if (args.numScale > 6) or (args.numScale < 4):
    print('Invalid number of layers')
    return

  if not args.logWandB:
    # This means the run won't be visible in the UI but will be stored locally in wandb/.  You can
    # push the results later using "wandb sync".
    os.environ['WANDB_MODE'] = 'dryrun'

  # Model directory will be created if it doesn't exist
  modelDir = os.path.join(args.logDir, args.modelName)

  trainingDirectory = os.path.join(args.datasetsDir, 'training')
  validationDirectory = os.path.join(args.datasetsDir, 'validation')
  testDirectory = os.path.join(args.datasetsDir, 'test')

  trainingData = DataReader(
    trainingDirectory,
    args.batchSize,
    args.maxDim,
    args.useRelativeDepth)
  validationData = DataReader(
    validationDirectory,
    args.batchSize,
    args.maxDim,
    args.useRelativeDepth)
  testData = DataReader(
    testDirectory,
    args.batchSize,
    args.maxDim,
    args.useRelativeDepth)

  validationInterval = np.ceil(trainingData.dsSize_ / args.batchSize).astype(np.int32)
  totalSteps = args.numEpochs * validationInterval

  configs = {
    'starting_learning_rate': args.learningRate,
    'epochs': args.numEpochs,
    'batch_size': args.batchSize,
    'num_scale': args.numScale,
    'validation_interval': validationInterval,
    'dataset': args.subset,
    'training_dataset_size': trainingData.dsSize_,
    'validation_dataset_size': validationData.dsSize_,
    'test_dataset_size': testData.dsSize_,
    'total_steps': totalSteps,
    'max_dimension': args.maxDim,
    'use_relative_depth': args.useRelativeDepth,
  }

  wandb.init(
    project='depthnet',
    entity='8thwall',
    name=args.experimentName,
    config=configs
  )

  with tf.Graph().as_default():
    placeholders = {
      'im0': tf.compat.v1.placeholder(tf.float32, [None, None, None, 3], name='im0'),
      'gt': tf.compat.v1.placeholder(tf.float32, [None, None, None, 1], name='gt')
    }

    globalStep = tf.Variable(0, trainable=False)

    # Configuring optimizer.
    bounds = [np.int32((3 / 5) * totalSteps), np.int32((4 / 5) * totalSteps)]
    lrList = [args.learningRate, args.learningRate / 2, args.learningRate / 4]
    learningRate = tf.compat.v1.train.piecewise_constant(globalStep, bounds, lrList)

    optimizer = tf.compat.v1.train.AdamOptimizer(learningRate)

    # Configuring depthnet for training.
    with tf.compat.v1.variable_scope("model", reuse=tf1.AUTO_REUSE) as scope:
      model = depthnet(placeholders, 1, args.numScale)
      model.gradientLossWeight_ = 10.0
      loss = model.totalLoss_
      validationLoss = loss
      grads = optimizer.compute_gradients(loss)

    applyGrads = optimizer.apply_gradients(grads, global_step=globalStep)

    # Session init.
    init = tf.group(tf1.global_variables_initializer(),
                    tf1.local_variables_initializer())
    sess = tf.compat.v1.Session(config=tf.compat.v1.ConfigProto(allow_soft_placement=True))
    sess.run(init)

    # Load a checkpoint if we want to retrain a model.
    saver = tf1.train.Saver()
    if args.ckpt != '':
      saver.restore(sess, args.ckpt.split(".")[0])
      if args.retrain == True:
        sess.run(globalStep.assign(0))

    # Set up to display tensorboard and save/restore the model as a checkpoint
    summaryWriter = tf1.summary.FileWriter(args.logDir + '/' + args.modelName, sess.graph)
    summaryWriter.add_graph(sess.graph)
    tf1.summary.scalar('learningRate', learningRate, ['model_0'])
    tf1.summary.scalar('validationLoss', validationLoss, ['model_0'])
    writeSummary = tf1.summary.merge_all('model_0')

    # Start training.
    print("Starting training")
    startStep = globalStep.eval(session=sess)

    for step in tqdm(range(startStep, totalSteps)):
      # Get the training data.  It will be augmented and will return the batch size.
      trainingRGBImages, trainingDepthLabels, _ = trainingData.loadData(args.subset, augment=True)

      _, trainingLoss, depthEstimates, l1, ssim, reconstruction, smoothness, = sess.run(
        [
          applyGrads,
          loss,
          model.results_[0],
          model.l1Loss_,
          model.ssimLoss_,
          model.reconstruction_,
          model.smoothnessLoss_
        ],
        feed_dict={
          placeholders['im0']: trainingRGBImages,
          placeholders['gt']: trainingDepthLabels
        }
      )

      if step % validationInterval == 0 or step == (totalSteps - 1):
        # Run against the validation dataset.  Do not perform back propagation to update the
        # weights.
        valRGBImages, valDepthLabels, _ = validationData.loadData(args.subset, numSamples=NUM_SAMPLES)
        validationLoss = sess.run(
          loss,
          feed_dict={
            placeholders['im0']: valRGBImages,
            placeholders['gt']: valDepthLabels
          }
        )

        wandb.log({"validation_loss": validationLoss})

        # Output the training and validation loss, which will be recorded by AWS SageMaker using
        # Regex expressions defined in remote-train for visualizing the model's training over time.
        print('Step {:>6} | train_loss: {}| validation_loss: {} | Min: {:.5f} | Max {:.5f}'
              .format(step,
                      trainingLoss,
                      validationLoss,
                      np.min(depthEstimates[0]),
                      np.max(depthEstimates[0])))

        summaryStr = sess.run(
          writeSummary,
          feed_dict={
            placeholders['im0']: trainingRGBImages,
            placeholders['gt']: trainingDepthLabels
          }
        )

        summaryWriter.add_summary(summaryStr, global_step=step)

      # Save checkpoint after 5 epochs
      if step and step % (validationInterval * 5) == 0:
        saver.save(sess, os.path.join(args.logDir, args.modelName, 'model'), global_step=step)

      # Penalize more for gradient loss halfway through training
      if (step == int(totalSteps / 2)):
        model.gradientLossWeight_ = 20.0

      # Log to Weights & Biases
      wandbLog = {
        'training_loss': trainingLoss,
        'learning_rate': learningRate.eval(session=sess),
      }
      for i in range(len(ssim)):
        wandbLog['l1-{}'.format(i)] = l1[i]
        wandbLog['ssim-{}'.format(i)] = ssim[i]
        wandbLog['reconstruction-{}'.format(i)] = reconstruction[i]
        wandbLog['smoothness-{}'.format(i)] = smoothness[i]
      wandb.log(wandbLog)

    saver.save(sess, os.path.join(args.logDir, args.modelName, 'model'), global_step=totalSteps)

    finalPath = os.path.join(modelDir, 'model-' + str(totalSteps))
    print("Training completed. Final checkpoint saved at ", finalPath)

    ####################################################################################
    # Run against both the ARKit and Hypersim test/ datasets and log results
    ####################################################################################
    hsTestRGBImages, hsTestDepthLabels, _ = testData.loadData(
      dataset='hypersim', numSamples=NUM_SAMPLES)
    hsTestLoss, hsDepthEstimates = sess.run(
      [loss, model.results_[0]],
      feed_dict={placeholders['im0']: hsTestRGBImages, placeholders['gt']: hsTestDepthLabels}
    )
    hsTestTable = wandb_utils.batchToWandbTable(
      hsTestRGBImages, hsDepthEstimates, hsTestDepthLabels)

    arTestRGBImages, arTestDepthLabels, _ = testData.loadData(
      dataset='arkit', numSamples=NUM_SAMPLES)
    arTestLoss, arDepthEstimates = sess.run(
      [loss, model.results_[0]],
      feed_dict={placeholders['im0']: arTestRGBImages, placeholders['gt']: arTestDepthLabels}
    )
    arTestTable = wandb_utils.batchToWandbTable(
      arTestRGBImages, arDepthEstimates, arTestDepthLabels)

    wandb.log({
      'ARKit Test': arTestTable,
      'Hypersim Test': hsTestTable,
      'test_loss': mean([arTestLoss, hsTestLoss])
    })

  # Export as a tflite.
  tflitePath = os.path.join(modelDir, 'tflite')
  frozenPath, inputNames, outputNames = freezeGraph(tflitePath, finalPath, args.maxDim, args.numScale)
  exportDepthnet(tflitePath, inputNames, outputNames,frozenPath)

def main():
  # Set the seed for reproducibility.
  set_seed()
  # Set access to Weights & Biases.
  if args.logWandB:
    wandb_utils.setWandBAccessKey()
  train()

if __name__ == '__main__':
  main()
