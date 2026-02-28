#!/usr/local/bin/bash

FILENAME=$1

if [ ! -f $1 ] ; then
  echo "Input file doesn't exist"
  exit 1
fi

read NAME EXT <<<$(IFS="."; echo $1)

echo $NAME
echo $EXT

ffmpeg -i $FILENAME -c copy -an $NAME-nosound.$EXT

