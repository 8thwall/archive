#!/bin/bash

echo
echo "This script updates your GitHub token for g8."
echo "If you haven't used g8 before, exit this script and run the Prerequisite Bootstrap script instead, linked in the repo's README."
echo

# Prompt for GitHub Username.
if [[ $0 == *zsh ]]; then
  github_username=${USER}
  vared -p "Enter your GitHub username: " github_username
else
  read -e -p "Enter your GitHub username [${USER}]: " github_username
  github_username=${github_username:-$USER}
fi

echo
echo "Go to the following URL:"
echo "https://github.com/settings/tokens"
echo "and generate a Personal Access Token (classic) with the following scopes:"
echo "   * repo"
echo
echo "Give the Token any name for your reference, such as 'g8-{username}-{machine}'."
echo

# Prompt for GitHub Username and GitHub Personal Access Token.
if [[ $0 == *zsh ]]; then
  read -s "github_token?Enter your GitHub Personal Access Token: "
else
  read -s -p "Enter your GitHub Personal Access Token: " github_token; echo
fi

security add-internet-password -a "${github_username}" -s 'github.com' -w "${github_token}" -U

echo
echo "Your g8's github token has been updated."
echo "If prompted by OSX to enter your laptop password, click 'Always Allow' (otherwise you'll be entering your password *a lot*)."
echo
