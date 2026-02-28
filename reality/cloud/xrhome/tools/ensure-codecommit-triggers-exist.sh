#!/bin/bash

# Examples (remove -t for non-test-run):
# $ ./upload -t -m "^8w\.my-app$" - A specific app
# $ ./upload -t -m "^8w\." - All apps for the workspace
# $ ./upload -t

which jq > /dev/null

if [ $? -ne 0 ]; then
  echo could not find jq, please install and run this program again
  exit
fi

which aws > /dev/null
if [ $? -ne 0 ]; then
  echo could not find aws, please install and run this program again
  exit
fi

echo Friendly reminder: make sure your aws-cli is configure properly else these commands will be sad
echo

match=""
is_test=false

while getopts "tm:" OPTION
do
  case $OPTION in
    t)
      echo "Running in test mode"
      is_test=true
      ;;
    m)
      match=$OPTARG
      ;;
    \?)
      echo "'-m [regex]' to limit repo to the regex, -t to run a dry run without updating anything"
      exit
      ;;
  esac
done


current_trigger_version="codecommit-trigger-kelznly7"

for repo in `aws codecommit list-repositories | jq 'map(.[].repositoryName)|.[]' -r | grep "$match"`
do
  sleep 6 # Keep the request rate less than 20 per minute (two requests per loop)
  info=`aws codecommit get-repository-triggers --repository-name ${repo}`
  trigger=`echo ${info} | jq '.triggers[0].name' -r`
  if [ $trigger = $current_trigger_version ]; then
    echo "Already updated: ${repo}"
  elif $is_test; then
    echo "Needs update: $repo, current: $trigger"
  else
    echo "Putting trigger for ${repo}"
    aws codecommit put-repository-triggers --repository-name ${repo} --triggers \
      name=$current_trigger_version,destinationArn=arn:aws:lambda:us-west-2:<REMOVED_BEFORE_OPEN_SOURCING>:function:codecommit-trigger:master,branches='[]',events=all
  fi
done



