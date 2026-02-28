#!/bin/bash

# Added to inherit traps in ERR and RETURNS
set -E
set -T

(return 0 2>/dev/null) && sourced=1 || sourced=0

if [ $sourced -eq 0 ];
then
    echo "ERROR: This bash script needs to be sourced!"
    exit 1
fi

# Need to run source unset with hardcoded variables in a file
# because from variable name eval does not work for some reason
TEMPFILE=$(mktemp)
trap '{ rm -f -- "$TEMPFILE"; }' RETURN ERR

echo "Unsetting the env vars found by grepping with expression: $1"
env | awk 'BEGIN{FS="="}{print $1}' | grep $1 | while read i;
do
    echo "unset $i" >> $TEMPFILE
    echo "echo $i removed" >> $TEMPFILE
done

source $TEMPFILE
