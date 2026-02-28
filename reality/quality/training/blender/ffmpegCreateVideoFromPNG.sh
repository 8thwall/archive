#!/bin/bash
# Copyright (c) 2017 8th Wall, Inc.
# Original Author: Tony Tomarchio (tony@8thwall.com)

# This script uses ffmpeg to take a series of RGB/DEPTH/NORMALS png's 
# and piece them together into a video

# create video from 3 sets of PNGs
ffmpeg \
  -i blender_75692_The_Modern_Living_Room-Scene-Camera-RGB0%03d.png \
  -i blender_75692_The_Modern_Living_Room-Scene-Camera-DEPTH0%03d.png \
  -i blender_75692_The_Modern_Living_Room-Scene-Camera-NORMALS0%03d.png \
  -filter_complex '[0:v][1:v]hstack[t];[t][2:v]hstack[vid]'\
  -map [vid] \
  -c:v libx264 -preset slow -profile:v high -crf 18 -coder 1 -pix_fmt yuv420p -movflags +faststart -g 30 -bf 2 \
  video-forward.mp4

# create a reversed copy of the first video
ffmpeg -i video-forward.mp4 \
  -vf reverse \
  video-reverse.mp4

# combine forward and reversed videos
ffmpeg -i video-forward.mp4 \
  -i video-reverse.mp4 \
  -filter_complex '[0][1]concat' \
  video-final.mp4
