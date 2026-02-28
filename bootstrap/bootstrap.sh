#!/bin/bash

# Define the following env var to prevent brew from automatically upgrading
# installed but outdated formulae.
export HOMEBREW_NO_INSTALL_UPGRADE=1

if [[ $(arch) == arm64* ]]; then
  BREW=/opt/homebrew/bin/brew
else
  BREW=brew
fi

# Install homebrew if not installed.
if ! command -v ${BREW} >/dev/null 2>&1; then
  /bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
fi

# Update homebrew shellenv if needed
${BREW} shellenv >> ~/.zprofile
${BREW} shellenv >> ~/.bashrc

# Source the shellenv updates.
if [[ $0 == *zsh ]]; then
  . ~/.zprofile || true
else
  . ~/.bashrc || true
fi

git_prefix=$(${BREW} --prefix git)
git_binary=${git_prefix}/bin/git

# Install git and git-lfs, using brew versions with support for keychain credentials.
${BREW} install git git-lfs
$git_binary lfs install

# Install JDK and the android sdkmanager.
${BREW} install openjdk
${BREW} tap homebrew/cask-versions
${BREW} install --cask temurin@8
${BREW} install --cask android-commandlinetools

# Ensure bazelisk is installed and not bazel.
${BREW} list bazel &>/dev/null && ${BREW} uninstall bazel
${BREW} install bazelisk

git_osx_cred_helper=${git_prefix}/libexec/git-core/git-credential-osxkeychain

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

# Store admin credentials for git in OSX Keychain.
cat << EOF | ${git_osx_cred_helper} store
host=github.com
username=${github_username}
password=${github_token}
protocol=https

EOF

# Tell git client to use the credentials in the OSX keychain.
$git_binary config --global credential.helper osxkeychain

# Install g8.
if ! [ -x "$(command -v g8)" ]; then
  ${BREW} tap 8thwall/tools8 https://github.com/8thwall/homebrew-tools8
  ${BREW} install g8
fi

echo
echo "Your g8 installation is now complete."
echo "If prompted by OSX to enter your laptop password, click 'Always Allow' (otherwise you'll be entering your password *a lot*)."
echo
