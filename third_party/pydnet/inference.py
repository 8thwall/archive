'''
Copyright (c) 2021 8th Wall, Inc.
Original Author: Nathan Waters (nathan@8thwall.com)

Runs pydnet against three images in assets/ and outputs the depth map in assets/

Setup:
 - pip3 install opencv-python==4.5.2.52 opencv-contrib-python==4.5.2.52 matplotlib==3.1.2 \
   tensorflow==2.1.0
Run with:
 - python3 inference.py
'''

import tensorflow as tf
import os
import argparse
from pathlib import Path
import cv2
import numpy as np
from utils import applyColorMap
from pydnet import pydnet

# Forces tensorflow to run on CPU
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

parser = argparse.ArgumentParser(description='Argument parser')

'''
Arguments related to network architecture
'''
parser.add_argument(
    '--width',
    dest='width',
    type=int,
    default=256,
    help='width of input images')
parser.add_argument(
    '--height',
    dest='height',
    type=int,
    default=256,
    help='height of input images')
parser.add_argument(
    '--resolution',
    dest='resolution',
    type=int,
    default=1,
    help='resolution [1:H,2:Q,3:E]')
parser.add_argument(
    '--checkpoint_dir',
    dest='checkpoint_dir',
    type=str,
    default='checkpoint/IROS18/pydnet',
    help='checkpoint directory')

args = parser.parse_args()

def main(_):

  with tf.Graph().as_default():
    height = args.height
    width = args.width
    placeholders = {'im0': tf.compat.v1.placeholder(tf.float32, [None, None, None, 3], name='im0')}

    with tf.compat.v1.variable_scope("model") as scope:
      model = pydnet(placeholders)

    init = tf.group(tf.compat.v1.global_variables_initializer(),
                    tf.compat.v1.local_variables_initializer())

    loader = tf.compat.v1.train.Saver()
    assets_dir = os.path.join(os.path.dirname(os.path.realpath(__file__)), 'assets')

    with tf.compat.v1.Session() as sess:
      sess.run(init)
      loader.restore(sess, args.checkpoint_dir)
      for image_file in ['desk.jpg', 'livingroom.jpg', 'office.png']:
        img = cv2.imread(os.path.join(assets_dir, image_file))
        img = cv2.resize(img, (width, height)).astype(np.float32) / 255.
        img = np.expand_dims(img, 0)
        disp = sess.run(model.results[args.resolution-1], feed_dict={placeholders['im0']: img})

        disp_color = applyColorMap(disp[0, :, :, 0]*20, 'plasma')
        toShow = (np.concatenate((img[0], disp_color), 0)*255.).astype(np.uint8)
        toShow = cv2.resize(toShow, (int(width/2), height))

        cv2.imwrite(os.path.join(assets_dir, 'depth_' + image_file), toShow)


if __name__ == '__main__':
  tf.compat.v1.app.run()
