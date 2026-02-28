'''
Copyright (c) 2021 8th Wall, Inc.
Original Author: Nathan Waters (nathan@8thwall.com)

Helper functions for setting the seed for reproducibility.
'''
import tensorflow as tf
import tensorflow.compat.v1 as tf1
import numpy as np
import random

def set_seed():
  '''
  '''
  # Needed for reproducibility of depthnet experiments.
  SEED = 8
  np.random.seed(SEED)
  tf1.set_random_seed(SEED)
  # Sets the global seed.
  tf.random.set_seed(SEED)
  random.seed(SEED)
