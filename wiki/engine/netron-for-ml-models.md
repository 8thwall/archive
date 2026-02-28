# Netron for ML Models

## What is it

This tool displays a graphical visualization of neural network, deep learning, and machine learning models. It supports ONNX, TF Lite, Tensorflow JS, Caffe, Caffe2, Keras, Darknet, PaddlePaddle, ncnn, MNN, Core ML, RKNN, MXNet, MindSpore Lite, TNN, Barracuda, Tengine, CNTK, and UFF

## Usage

Two ways to use it is downloading and installing the app (found on their [website](<https://github.com/lutzroeder/netron>)), or use their [web browser version.](<https://netron.app/>) The web browser is somewhat easier to use.

The initial page will show a button to open a model. While some models will have multiple files, you’ll need to select the main file (ie .json for a TFJS model)

Something like this will appear:

Clicking a node will reveal its properties: inputs and outputs as well as the name, type (and shape) of the layer. It will also display additional attributes of the node as such:

Expanding the attributes will display the weights.

There are also additional options on the top left corner. Using the `find` feature will allow you to search for nodes based on their names. On the app version, this can be used using `command+F` (on Mac). You can also choose to display or hide attributes, initializers, and names or view the graph horizontally.

The graph can also be exported as an image for later use.
