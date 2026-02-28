#!/bin/bash
# Copyright (c) 2017 8th Wall, Inc.
# Original Author: Tony Tomarchio (tony@8thwall.com)

# This script uses ffmpeg to concat two videos together

ffmpeg -i video1.mp4 \
  -i  video2.mp4\
  -filter_complex '[0][1]concat' \
  video-combined.mp4 
