# Depthnet Training

The depthnet architecture is based off of [pydnet](https://github.com/mattpoggi/pydnet).

## Dependencies
See `requirements.txt` for other requirements.
```
pip3 install opencv-python==4.5.2.52 opencv-contrib-python==4.5.2.52 matplotlib==3.1.2 tensorflow==2.1.0
```
Note: The current code8 codebase now has tensorflow 2.6 installed, but I'm not entirely sure whether the compatibility works with 2.1.0.


## Creating a custom dataset from Datarecorder

### Running Datarecorder
Instructions to run Datarecorder can also be found [here](https://wiki.8thwall.com/en/eng/omniscope#:~:text=Copy-,%C2%B6,-Creating%20new%20data).

To run Datarecorder, first run build the app:
```bash
bazel build -c opt --ios_multi_cpus=arm64,armv7 //apps/client/exploratory/datarecorder/ios:data-recorder-ios
```

To run XCode:
```bash
./bazel-bin/apps/client/exploratory/datarecorder/ios/data-recorder-ios
```

Select the iPhone connected by USB to your device, and hit play. If you run into issues with ios support you can get the correct ios version [here](https://github.com/iGhibli/iOS-DeviceSupport/tree/master/DeviceSupport). Once you have the app installed, you can go and collect data. It's recommended to take sequences of about 300-600 frames to ensure more variety within the scenes.

Note: the depth display will only show up to 1 meter (white is farther, black is closer), but arkit can actually read past 5 meters (but up to 5 is where it's most confident).

Download log files from iPhone.
```bash
~/repo/code8/apps/client/exploratory/datarecorder/ios/get-logs.sh
```

### Extract data from Datarecorder log.
```bash
find path/to/data/directory ! -name '*.mp4' -name "*log\.*[0-9]*" | xargs -I {} bazel run //reality/quality/codelab/pixels:video-from-datarecorder -- {}
```
This will create an mp4 video from the log files for easier viewing.

```bash
find path/to/data/directory ! -name '*.mp4' -name "*log\.*[0-9]*" | xargs -I {} bazel run //reality/quality/datasets/depthnet:depths-from-datarecorder -- --f {} --n 30
```
This will split the log files into jpg and bin files within the same directory. They should then be sorted into `images` and `ground-truth` folders. Note that this will not take the very first frame of the sequence but instead take the 5th frame to avoid the extreme overexposure/underexposure that effect that sometimes happens at the beginning of the sequence.

### Split the data
From a directory of sorted images and depth bin files:
```bash
python3 split-dataset --file_dir path/to/files --dest path/to/destination/directory --arkit
```
This will output a train and val txt along with a txt list of filenames.

From a list of filenames:
```bash
python3 split-dataset --filenames path/to/filenames.txt --fileDir path/to/dataset --dest path/to/destination/directory --dataset arkit
```

## Downloading ml-hypersim
Clone the repository from [here](https://github.com/apple/ml-hypersim).
From the cloned repository, download the final images and the depth files:
```bash
cd contrib/99991
./download.py --contains final_preview --contains *.color.jpg --silent
./download.py --contains geometry_hdf5 --contains *.depth_meters.hdf5 --silent
```
Copy a number of diverse frames from each scene. Split it, and copy the files into the same
directory as the split arkit dataset.
```bash
ls -d path/to/hypersim/downloads/*/*/*final_preview/ > /path/to/directories.txt
bazel run //reality/quality/datasets/depth:diverse-images -- /path/to/directories.txt /path/to/filenames.txt
python3 split-dataset --filenames path/to/filenames.txt --fileDir path/to/dataset --dest path/to/destination/directory --dataset hypersim
```

Your dataset directory should appear as follows:
```bash
training\
  arkit\
    images\
    ground-truth\
  hypersim\
    *\*\
validation\
  arkit\
    images\
    ground-truth\
  hypersim\
    *\*\
test\
  arkit\
    images\
    ground-truth\
  hypersim\
    *\*\
```

## Resizing the dataset
Since hypersim images and depths are 768x1024, it takes a long time to train the original images due to the resizing, so this additional script will create a separate copy of the dataset with smaller dimensions specified. For experimenting, it is recommended to go with 256x192 since that is the size for the arkit depth. Note: this doesn't resize the depth for arkit since the main focus is to resize the hypersim data. The time difference to resize 256x192 to 128x96 isn't very much.

This script will also convert all images to png's.

```bash
python3 resize.py --dataset path/to/src --output path/to/dest
```

## Training
To train locally:
```bash
python3 train.py --batch_size 8 --max_dim 256 --log_dir /path/to/model --name model-name --num_epochs 500 --num_scale 6 --datasets /path/to/dataset
```
Use `--subset` flag to specify between `arkit`, `hypersim`, and `all`. Default is `all`.

To view tensorboard (separate terminal)
```bash
tensorboard --logdir model/path
```

Should result in a checkpoint and tflite at the end of training

Note: When specifying the scale and dimensions, for scale 6, it cannot go lower than 256x192 dimension. From observations in experiments, decreasing the scale will cause the smoothness loss to increase. Reducing the size of the input may numerically decrease the training loss and validation loss since there are less numbers to compute, but the reconstruction loss will actually be higher. These difference are very small however.

This will also expect png files for training, and not jpg files.

### Remote Training
To train remotely on `aws s3`, modify the parameters accordingly in `remote-train.py` and select the
 correct dataset. Then, run:
```bash
python3 remote-train.py -n experiment-name
```

To halt training remotely, first check which training jobs are in progress. Another helpful flag
might be ` --name-contains`
```bash
aws sagemaker list-training-jobs --status-equals InProgress
```
Find the name of the job that needs to be stopped, and run:
```bash
aws sagemaker stop-training-job --training-job-name depthnet-job-name
```

## Post-training quantization
Currently implemented in dynamic range quantization in which the weights will be quantized integers but the inputs and outputs will still be in float. This will greatly reduce the size of the tflite, but it will also cause the output to be somewhat grainy. It will also somewhat slowdown the model on omniscope gui. The performance has yet to be tested on omniscope js, but it is predicted to speed up the model since the CPU for mobile devices is different. More information [here](https://github.com/tensorflow/tensorflow/issues/21698#issuecomment-414764709).

The script to perform this is:
```bash
python3 pydnet-export.py --checkpoint_dir /path/to/checkpoint/pydnet --output_dir /path/to/tflite/model --quantize
```

## Evaluating
Note, the evaluation results may be lower for tflite than the checkpoint since they're calculated differently. The tflite loss will try to simulate calculating the loss for the checkpoint, but the checkpoint uses the different layers to calculate it while the tflite only uses one layer, they won't be exactly the same.
```bash
python3 eval.py --path path/to/ckpt/or/tflite --datasets path/to/dataset
```

# Omniscope View
There are three methods to view the depthnet tflite results, two of which are on omniscope. Before using any of these options, first copy and paste the tflite in `code8/reality/engine/depth/data`. The depth displayed will show white to be closer and black to be farther.

## Omniscope Depth View
This will display the camera view, arkit view, and depthnet view (left to right) to be able to compare the results. Below will also display a 3d view of the depths. The yellow points will indicate the depthnet predictions, and the blue will display arkit's values. The follow camera perspective will be set by default, but it can be zoomed out or deselected to get a better viewing angle.

Update the dimensions of the input size on this line in `apps/client/internalqa/omniscope/native/views/benchmark/depth-view.cc` (line 121):
```bash
  dataPtr->addProducer(
    std::make_unique<CameraPreviewDataProducer>(appConfig_, 192, 256, &copyTexture_));
```
Then run:
```bash
bazel run //apps/client/internalqa/omniscope/imgui:omniscope --
```

To record the results in video:
```bash
bazel run //apps/client/internalqa/omniscope/headless:omniscope -- -m 0 -v 4 -o /path/to/output.mp4 -i /path/to/log/src
```

## Omniscope JS Mobile Depth View
This will display in real time what the depthnet will process from the camera (or display a log file result on omniscope gui). To toggle between the camera view and depthnet, tap on the view, and it should switch. The top left box should display the number of frames it has read, and the frames per second.

Update the dimensions of the input size on this line in `~/repo/code8/apps/client/internalqa/omniscope/native/views/sensors/mobile-depth-view.cc` (line 82):
```bash
  dataPtr->addProducer(
    std::make_unique<CameraPreviewDataProducer>(appConfig_, 192, 256, &copyTexture_));
```
Then run:
```bash
bazel run --cpu=js apps/client/internalqa/omniscope/js/server
```

To record the results in video:
```bash
bazel run //apps/client/internalqa/omniscope/headless:omniscope -- -m 3 -v 2 -o /path/to/output.mp4 -i /path/to/log/src
```

## Single Image
This will take in a single image and output a greyscale image of what the depth reads.

Update the dimensions of the input size on this line in `reality/quality/depth/depth-map-from-depthnet.cc` (line 53).
```bash
  RGBA8888PlanePixelBuffer resizedImage = resizer.resizeOnGpu(im.pixels(), 256, 192);
```

Then run:
```bash
bazel run //reality/quality/depth:depth-map-from-depthnet -- /path/to/image.jpg /path/to/output.jpg
```
This also supports png files.
