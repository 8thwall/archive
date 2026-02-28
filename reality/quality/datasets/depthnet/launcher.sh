# Simple wrapper around train.py used for remote training.  Required to install necessary
# dependencies on the docker image.

useRelativeDepth=""

# Get named arguments
while [ $# -gt 0 ]; do
  case "$1" in
    --batch_size)
      batchSize="$2"
      ;;
    --num_epochs)
      numEpochs="$2"
      ;;
    --name)
      experimentName="$2"
      ;;
    --num_scale)
      numScale="$2"
      ;;
    --max_dim)
      maxDim="$2"
      ;;
    --subset)
      subset="$2"
      ;;
    --use_relative_depth)
      if [$2 == "" || $2 == "true" || $2 == "True"];
      then
        useRelativeDepth="--use_relative_depth"
      fi
      ;;
    *)

  esac
  shift
done

echo "Installing dependencies"
# Having difficulties installing opencv in the docker container despite it already being installed.
# apt-get throws what seem to be permission errors with /tmp inside the docker container:
#      Couldn't create temporary file /tmp/apt.conf.ngKBZX for passing config to apt-key
# This leads do the following error when running train.py:
#      Traceback (most recent call last):
#        File "train.py", line 19, in <module>
#          from datautils import *
#        File "/opt/ml/code/datautils.py", line 11, in <module>
#          import cv2
#        File "/usr/local/lib/python3.6/dist-packages/cv2/__init__.py", line 5, in <module>
#          from .cv2 import *
#      ImportError: libGL.so.1: cannot open shared object file: No such file or directory
pip install $(grep -ivE "opencv" requirements.txt)

echo "Running training script"
# SM_MODEL_DIR is the local path where the training job writes the model artifacts to. After
# training, artifacts in this directory are uploaded to S3 for model hosting.  It is always set to
# /opt/ml/model.
# SM_CHANNEL_TRAINING is the local path to the cloned s3 training data bucket.
python train.py \
--log_dir ${SM_MODEL_DIR} \
--datasets ${SM_CHANNEL_TRAINING} \
--name $experimentName \
$useRelativeDepth \
--log_wandb \
--num_epochs $numEpochs \
--batch_size $batchSize \
--num_scale $numScale \
--max_dim $maxDim \
--subset $subset
