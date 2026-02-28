'''
Copyright (c) 2021 8th Wall, Inc.
Original Author: Nathan Waters (nathan@8thwall.com)
Runs train.py on AWS.
Run with: python3 remote-train.py
'''
import os
import time
from sagemaker.tensorflow import TensorFlow
import argparse

# Check s3://<REMOVED_BEFORE_OPEN_SOURCING> to see how your training run performed.
# MODEL_DIR becomes the --model_dir argument for train. Stores the training artifacts, such as the
# model, for each experiment.
MODEL_DIR = 's3://<REMOVED_BEFORE_OPEN_SOURCING>/model'

# S3 bucket that stores the automatically generated debugging output like rule-output/ and
# profiler-output/
OUTPUT_PATH = 's3://<REMOVED_BEFORE_OPEN_SOURCING>/experiments_output'

# S3 bucket that contains the training, validation, and test data in this format:
#  <s3_bucket_directory>/training/arkit/images/log.*.jpg
#  <s3_bucket_directory>/training/arkit/ground-truth/log.*.bin
#  <s3_bucket_directory>/training/hypersim/*
#
#  <s3_bucket_directory>/validation/arkit/images/log.*.jpg
#  <s3_bucket_directory>/validation/arkit/ground-truth/log.*.bin
#  <s3_bucket_directory>/validation/hypersim/*
#
#  <s3_bucket_directory>/test/arkit/images/log.*.jpg
#  <s3_bucket_directory>/test/arkit/ground-truth/log.*.bin
#  <s3_bucket_directory>/test/hypersim/*
TRAINING_DATA_URI = 's3://<REMOVED_BEFORE_OPEN_SOURCING>/_depth-training-data/'

# This is a very small amount of data that you can use for rapid AWS development. Also follows:
#  <s3_bucket_directory>/training/arkit/images/log.*.jpg
#  <s3_bucket_directory>/training/arkit/ground-truth/log.*.bin
#  <s3_bucket_directory>/training/hypersim/*
#
#  <s3_bucket_directory>/validation/arkit/images/log.*.jpg
#  <s3_bucket_directory>/validation/arkit/ground-truth/log.*.bin
#  <s3_bucket_directory>/validation/hypersim/*
#
#  <s3_bucket_directory>/test/arkit/images/log.*.jpg
#  <s3_bucket_directory>/test/arkit/ground-truth/log.*.bin
#  <s3_bucket_directory>/test/hypersim/*
TRAINING_DATA_URI = 's3://<REMOVED_BEFORE_OPEN_SOURCING>/_depth-training-data-subset-with-hypersim/'


# This is a sizable amount of data resized to 192x256 that you can use for experimental AWS
# development. Also follows:
#  <s3_bucket_directory>/training/arkit/images/log.*.jpg
#  <s3_bucket_directory>/training/arkit/ground-truth/log.*.bin
#  <s3_bucket_directory>/training/hypersim/*
#
#  <s3_bucket_directory>/validation/arkit/images/log.*.jpg
#  <s3_bucket_directory>/validation/arkit/ground-truth/log.*.bin
#  <s3_bucket_directory>/validation/hypersim/*
#
#  <s3_bucket_directory>/test/arkit/images/log.*.jpg
#  <s3_bucket_directory>/test/arkit/ground-truth/log.*.bin
#  <s3_bucket_directory>/test/hypersim/*
TRAINING_DATA_URI = 's3://<REMOVED_BEFORE_OPEN_SOURCING>/_data_training_small_subset_192x256/'

if __name__ == '__main__':
  parser = argparse.ArgumentParser(description='Argument parser')
  parser.add_argument(
    '--experiment-name', '-n',
    dest='experimentName',
    help='Descriptive name of your experiment',
    required=True,
  )
  args = parser.parse_args()

  job_name='depthnet-{time}-{experiment_name}'.format(
    time=time.strftime("%Y-%m-%d-%H-%M-%S", time.localtime()),
    experiment_name=args.experimentName)

  depthTrainingJob = TensorFlow(
    entry_point='launcher.sh',
    # source_dir specifies the directory that will be copied over to AWS and snapshotted, which is
    # this directory (reality/quality/datasets/depthnet/).
    source_dir=os.path.dirname(os.path.realpath(__file__)),
    # This role only has access to SageMaker and S3.
    role='8w-ml',
    instance_count=1,
    # Current dataset is a little over 40MB
    volume_size=45,
    model_dir=MODEL_DIR,
    output_path=OUTPUT_PATH,
    hyperparameters={
      # these become arguments to the launcher.sh script which then passes them to train.py.
      'name': job_name,
      'num_epochs': 200,
      'batch_size': 8,
      'num_scale': 5,
      'max_dim': 128,
      'subset': 'all',
      'use_relative_depth': True,
    },
    # On demand hourly cost is $3.06.  8 CPUs and 1 GPU.  61GB of RAM.
    instance_type='ml.p3.2xlarge',
    # Keep TF training in sync with our TF version.
    framework_version='2.1.0',
    py_version='py3',
    distribution={'parameter_server': {'enabled': False}},
  )
  print('Creating training experiment "{}"'.format(job_name))

  # This kicks off the job to AWS.
  depthTrainingJob.fit(TRAINING_DATA_URI, job_name=job_name)
