#!/bin/bash
OIFS="$IFS"
IFS=$'\n'

echo $1
for f in `ls -1 $1/*.blend`
do
  echo "Rendering: *** $f ***"
  blender -b $f -P ~/repo/code8/reality/quality/training/blender/renderscene.py
done

IFS="$OIFS"
