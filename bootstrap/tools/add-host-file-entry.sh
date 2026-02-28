#!/bin/bash

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

# addHostFileEntry 10.8.8.20 jenkins.8thwall.com
