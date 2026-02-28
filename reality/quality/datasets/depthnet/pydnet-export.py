'''
Copyright (c) 2021 8th Wall, Inc.
Original Author: Lynn Dang (lynn@8thwall.com)

Converts pydnet checkpoint to a tflite.

Setup:
 - pip3 install tensorflow==2.1.0
Run with:
 - python3 pydnet-export.py --ckpt /path/to/checkpoint/pydnet --output_dir /path/to/tflite/model
'''
import tensorflow as tf
import os
import argparse
import sys
import tensorflow.compat.v1 as tf1
from tqdm import tqdm

from depthnet import depthnet
from datautils import *

# Forces tensorflow to run on CPU.
os.environ['CUDA_VISIBLE_DEVICES'] = '-1'

parser = argparse.ArgumentParser(description='Argument parser')

'''
Arguments related to network architecture
'''
parser.add_argument(
    '--ckpt',
    dest='ckpt',
    type=str,
    help='checkpoint directory')
parser.add_argument(
    '--output_dir',
    dest='outputDir',
    type=str,
    default='model/',
    help='output model directory')
parser.add_argument(
  '--width',
    dest='width',
    type=int,
    default=192,
    help='width of input node')
parser.add_argument(
    '--height',
    dest='height',
    type=int,
    default=256,
    help='height of input node')
parser.add_argument(
    '--num_scale',
    dest='numScale',
    type=int,
    default=6,
    help='Number of pyramid scales in the model.')
parser.add_argument(
    '--debug',
    action='store_true',
    help='prints the nodes on screen and the graph for tensorboard'
)
parser.add_argument(
    '--quantize',
    action='store_true',
    help='Performs post-training quantization on the checkpoint'
)
args = parser.parse_args()

def main(_):
  # For debugging purposes.
  if (args.debug):
    with tf.Graph().as_default():
      height = args.height
      width = args.width

      # Paths for the output model files.
      placeholders = {'im0': tf.compat.v1.placeholder(tf.float32, [1, height, width, 3], name='im0')}

      # Check if output directory exists or not. Create if it doesn't exist.
      if not os.path.exists(args.output_dir):
        os.makedirs(args.output_dir)

      with tf1.variable_scope("model") as scope:
        model = depthnet(placeholders, 0, args.numScale)

      init = tf.group(tf1.global_variables_initializer(),
                      tf1.local_variables_initializer())
      loader = tf1.train.Saver()

      with tf1.Session() as sess:
        sess.run(init)
        loader.restore(sess, args.ckpt)

        # Prints all the nodes to screen.
        for tensor in [n.name for n in tf1.get_default_graph().as_graph_def().node]:
          print(tensor)

        # Write graph to tensorboard for visualization.
        # In command line (to view): tensorboard --logdir __tb
        writer = tf1.summary.FileWriter("__tb")
        writer.add_graph(sess.graph)
        writer.close()

        # Writes the pbtxt file to read the nodes.
        pbtxt_path = os.path.join(args.output_dir, 'depthnet.pbtxt')
        tf1.train.write_graph(sess.graph.as_graph_def (), '.', pbtxt_path, as_text=True)

  maxDim  = max(args.width, args.height)
  frozenPath, inputNames, outputNames = freezeGraph(args.outputDir, args.ckpt, maxDim, args.numScale)

  # Converts to tflite if quantization is not selected.
  if (not args.quantize):
    exportDepthnet(args.outputDir, inputNames, outputNames, frozenPath)
    return

  # Set up for dynamic range quantization and convert to tflite.
  tflitePath = os.path.join(args.outputDir, "depthnet.tflite")
  converter = tf1.lite.TFLiteConverter.from_frozen_graph(
    frozenPath, inputNames, outputNames
  )
  converter.optimizations = [tf.lite.Optimize.DEFAULT]
  converter.experimental_new_converter=False
  tfliteModel = converter.convert()

  with open(tflitePath, "wb") as f:
    f.write(tfliteModel)

  print("Tflite model created at ",  tflitePath)

if __name__ == "__main__":
    tf.compat.v1.app.run()
