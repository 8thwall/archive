#!/bin/bash

# Copyright (c) 2017 8th Wall, Inc.
# Original Author: Tony Tomarchio (tony@8thwall.com)

# TODO(tony): add checks for each task to see if already configured, and skip if so

############
# NOTE:
# Prior to running this, the new user should already have the following setup:
# * Google Account
# * laptop USERNAME should be SAME as email prefix ( i.e. tony / tony@ )
# * Apple ID, created at developer.apple.com
# * GitHub account, with verified email address
# * GitHub Access Token. See https://help.github.com/articles/creating-a-personal-access-token-for-the-command-line/
############

# Variables
COL_BLUE="\x1b[36;01m"
COL_RED="\x1b[31;01m"
COL_GREEN="\x1b[92m"
COL_RESET="\x1b[39;49;00m"
user_name="$(id -un)"
full_name="$(finger $user_name | awk -F: '{ print $3 }' | head -n1 | sed 's/^ //')"
email_address="$user_name@8thwall.com"

XCODE_INSTALLER="Xcode_12.4.xip"

# Various files will be downloaded/extracted in this script, do it in /tmp
cd /tmp

function print_banner() {
  echo -e "############"
  echo -e "############"$COL_BLUE" "$@" "$COL_RESET"############"
  echo -e "############"
}

function print_logo {

  echo "#####################################################################"
  echo "#   █████╗ ████████╗██╗  ██╗    ██╗    ██╗ █████╗ ██╗     ██╗       #"
  echo "#  ██╔══██╗╚══██╔══╝██║  ██║    ██║    ██║██╔══██╗██║     ██║       #"
  echo "#  ╚█████╔╝   ██║   ███████║    ██║ █╗ ██║███████║██║     ██║       #"
  echo "#  ██╔══██╗   ██║   ██╔══██║    ██║███╗██║██╔══██║██║     ██║       #"
  echo "#  ╚█████╔╝   ██║   ██║  ██║    ╚███╔███╔╝██║  ██║███████╗███████╗  #"
  echo "#   ╚════╝    ╚═╝   ╚═╝  ╚═╝     ╚══╝╚══╝ ╚═╝  ╚═╝╚══════╝╚══════╝  #"
  echo "#################### Laptop Bootstrap! ##############################"

}

function brew8_status {
  if [ $1 == "success" ] ; then
    echo -e " "
    echo -e "############"$COL_GREEN" SUCCESS "$COL_RESET"############"
    echo -e " "
  else
    echo -e " "
    echo -e "############"$COL_RED" FAIL "$COL_RESET"############"
    echo -e " "
  fi
}

function brew8 {
  echo -e " "
  echo -e "############"$COL_BLUE" BREW COMMAND: "$COL_RESET"$@ ############"
  echo -e " "
  brew "$@"

  if [ $? -eq 0 ] ; then
    brew8_status "success"
    return 0
  else
    brew8_status "fail"
    return 1
  fi
}

function source_bashrc_from_bash_profile() {
  grep "source ~/.bashrc" ~/.bash_profile
  greprc=$?
  if [ $greprc -ne 0 ] ; then # either string not found or file doesn't exist
    echo "need to source .bashrc within .bash_profile"
    cat >> ~/.bash_profile <<EOL
if [ -f ~/.bashrc ]; then
   source ~/.bashrc
fi
EOL
  else
    echo ".bash_profile looks good, no updates needed"
  fi
  echo "Contents of ~/.bash_profile :"
  echo " "
  cat ~/.bash_profile
  return 0
}

function install_chrome_extension() {
  preferences_dir_path="/opt/google/chrome/extensions"
  pref_file_path="$preferences_dir_path/$1.json"
  upd_url="https://clients2.google.com/service/update2/crx"
  mkdir -p "$preferences_dir_path"
  echo "{" > "$pref_file_path"
  echo "  \"external_update_url\": \"$upd_url\"" >> "$pref_file_path"
  echo "}" >> "$pref_file_path"
  echo Added \""$pref_file_path"\" ["$2"]
}

# addAlias "aliasName" "commandToRun"
function addAlias {
  grep "$1" ~/.bashrc
  greprc=$?
  if [ $greprc -ne 0 ] ; then # either string not found or file doesn't exist
    echo "need to add $1 to .bashrc"
    echo "alias $1=\"$2\"" >> ~/.bashrc
  else
    echo "\"$1\" already exists in .bashrc"
  fi
}

# addBashRC "entryString"
function addBashRC() {
  line="$*"
  grep "$line" ~/.bashrc
  greprc=$?
  if [ $greprc -ne 0 ] ; then # either string not found or file doesn't exist
    echo "Adding ${line} to .bashrc"
    echo "${line}" >> ~/.bashrc
  else
    echo "\"${line}\" already exists in .bashrc"
  fi
}

# pListSet file key value
function pListSet {
  pListFile=$1
  pListKey=$2
  desiredValue=$3

  currentValue=`/usr/libexec/PlistBuddy -c "Print $pListKey" $pListFile`

  # if Key doesn't exist, the command will have rc=1
  if [ $? -eq 1 ] ; then
    echo -e $COL_BLUE"$pListKey"$COL_RESET" DOESN'T EXIST. ADD and SET to "$COL_BLUE"$desiredValue"$COL_RESET
    # Add new key
    /usr/libexec/PlistBuddy -c "Add $pListKey string $desiredValue" $pListFile
    # Print result
    /usr/libexec/PlistBuddy -c "Print $pListKey" $pListFile
  elif [ "$currentValue" == "$desiredValue" ] ; then
    echo -e $COL_BLUE"$pListKey"$COL_RESET" is ALREADY SET to "$COL_BLUE"$desiredValue"$COL_RESET
  else
    echo -e $COL_BLUE"$pListKey"$COL_RESET" CHANGING to "$COL_BLUE"$desiredValue"$COL_RESET
    # Set new value
    /usr/libexec/PlistBuddy -c "Set $pListKey $desiredValue" $pListFile
    # Print result
    /usr/libexec/PlistBuddy -c "Print $pListKey" $pListFile
  fi
}

function addHostFileEntry {
  IP=$1
  HOSTNAME=$2
  HOSTS_LINE="$IP\t$HOSTNAME"

  if [ -n "$(grep $HOSTNAME /etc/hosts)" ] ; then
    echo "$HOSTNAME already exists : $(grep $HOSTNAME /etc/hosts)"
  else
    echo "Adding $HOSTNAME to your /etc/hosts file"
    sudo -- sh -c -e "echo '$HOSTS_LINE' >> /etc/hosts"
    if [ -n "$(grep $HOSTNAME /etc/hosts)" ] ; then
      echo "$HOSTNAME was added succesfully \n $(grep $HOSTNAME /etc/hosts)";
    else
      echo "Failed to Add $HOSTNAME, Try again!";
    fi
  fi
}

# Allow functions to be called.
$*
