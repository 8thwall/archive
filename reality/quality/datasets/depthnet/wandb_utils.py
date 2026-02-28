'''
Copyright (c) 2021 8th Wall, Inc.
Original Author: Nathan Waters (nathan@8thwall.com)

Utility methods for visualizing our deptnet experiments using Weights & Biases or Tensorboard
'''
import boto3
from botocore.exceptions import ClientError
from botocore.config import Config
import logging
import numpy as np
import os
import wandb

def setWandBAccessKey():
  '''
  Get the WANDB_API_KEY stored in AWS Systems Manager Parameter Store.
  '''
  awsConfig = Config(
    region_name = 'us-west-2',
    signature_version = 'v4',
    retries = {'max_attempts': 10, 'mode': 'standard'}
  )

  ssm_client = boto3.client('ssm', config=awsConfig)

  try:
    result = ssm_client.get_parameter(
      Name='/8w/ml/<REMOVED_BEFORE_OPEN_SOURCING>',
      WithDecryption=True
    )
    apiKey = result['Parameter']['Value']
    os.environ["WANDB_API_KEY"] = apiKey

  except ClientError as e:
    logging.error(e)
    exit(1)
  return result

def batchToWandbTable(inputImages, predicted, labels):
  '''
  Converts a batch into a Wandb table for visualization.
  '''
  wandbTable = wandb.Table(
    columns=['RGB Image', 'Label', 'Prediction']
  )
  for i in range(len(predicted)):
    rgbInput = inputImages[i]
    depthPred = predicted[i]
    depthLabel = labels[i]
    # Reshape from (128,96,1) to (128,96) for visualization.
    depthPred = np.reshape(depthPred, (depthPred.shape[0], depthPred.shape[1]))
    depthLabel = np.reshape(depthLabel, (depthLabel.shape[0], depthLabel.shape[1]))
    # The output range of the network is 0 to 1.  0 means it the furthest away and 1 means its
    # the closest possible. Scale these values from 0 to 255 using the label's min and max so as
    # to maximize the visualization's contrast.
    depthPredInt = np.uint8(np.interp(depthPred, (depthLabel.min(), depthLabel.max()), (0, 255)))
    depthLabelInt = np.uint8(
      np.interp(depthLabel, (depthLabel.min(), depthLabel.max()), (0, 255)))

    # TODO: It would be nice to have the filename and loss for each pair.

    wandbTable.add_data(
      wandb.Image(rgbInput),
      wandb.Image(depthLabelInt),
      wandb.Image(depthPredInt))

  return wandbTable
