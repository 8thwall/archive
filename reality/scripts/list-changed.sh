#!/bin/bash

# List the filenames of files that have changed in the current branch

function list() {
  git diff --name-only $(git merge-base --fork-point master) | xargs ls -d 2>/dev/null
  git ls-files  -o --exclude-standard
}

list | awk '!a[$0]++'
