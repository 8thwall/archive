#!/bin/bash

# Variables
FUNC := ./bootstrap_funcs.sh
COL_BLUE := "\x1b[36;01m"
COL_RED := "\x1b[31;01m"
COL_GREEN := "\x1b[92m"
COL_RESET := "\x1b[39;49;00m"
user_name := $(shell id -un)
full_name := $(shell id -F)
email_address := $(user_name)@8thwall.com

# Directory where progress stamp files will be generated.
OUT := progress
_MKOUT := $(shell mkdir -p $(OUT))

REPO_DIR := ~/repo

ARCH := $(shell arch)
ARM64 := $(findstring arm64,$(ARCH))

CASKS := iterm2 visual-studio-code vlc wine-stable android-commandlinetools

FORMULAE := openssl@3 vim coreutils buildifier typescript awscli awsebcli automake autoconf libtool bash ios-deploy dockutil maven mysql@8.0 openjdk@17 jq

NPM := standard supervisor aws-cloudfront-sign gulp-cli eslint-cli nodemon

REPOS_8W := code8

# Convience definitions. These should have equals without the colon.
casks = $(addprefix $(OUT)/,$(addsuffix .cask,$(CASKS)))
formulae = $(addprefix $(OUT)/,$(addsuffix .formula,$(FORMULAE)))
apple-arm64 = $(OUT)/rosetta.step

all: $(OUT)/bash.step \
  $(OUT)/plist.step \
  $(OUT)/logo.step \
  $(OUT)/git-config.step \
  $(OUT)/tools8.step \
  $(OUT)/lockmessage.step \
  $(OUT)/dock.step \
  $(OUT)/input-bindings.step \
  $(OUT)/bash-profile.step \
  $(OUT)/openjdk-jdk17.step \
  $(OUT)/bashrc.step \
  $(OUT)/disable-chrome-back-gesture.step \
  $(OUT)/android-dir.step \
  $(casks) \
  $(formulae) \
  $(if $(ARM64),$(apple-arm64))

# $(OUT)/pip3.step

$(OUT)/android-dir.step:
	mkdir -p ~/.android
	touch ~/.android/repositories.cfg
	@touch $@

$(OUT)/dockremove.step: | $(OUT)/dockutil.formula
	-dockutil --remove Messages
	-dockutil --remove Mail
	-dockutil --remove Maps
	-dockutil --remove Photos
	-dockutil --remove FaceTime
	-dockutil --remove Calendar
	-dockutil --remove Contacts
	-dockutil --remove Reminders
	-dockutil --remove TV
	-dockutil --remove Music
	-dockutil --remove Podcasts
	-dockutil --remove News
	touch $@

$(OUT)/dock.step: | $(OUT)/dockutil.formula $(OUT)/dockremove.step $(casks)
	-dockutil --add "/Applications/Google Chrome.app" --after Launchpad
	-dockutil --add "/Applications/iTerm.app" --after "Google Chrome"
	-dockutil --add "/Applications/Visual Studio Code.app"
	-dockutil --add "/Applications/zoom.us.app"
	-dockutil --add "/Applications/Slack.app"
	@touch $@

$(OUT)/input-bindings.step:
	cp -n inputrc ~/.inputrc
	echo "bind -f ~/.inputrc" >> ~/.bashrc
	cp -n zshrc ~/.zshrc
	@touch $@

# Custom vtk is not working, at least on arm64. It might be better to remove this requirement.
#$(OUT)/vtk-tap.step:
#	brew tap-new $(user_name)/local-vtk
#	brew extract --version=8.1 vtk $(user_name)/local-vtk

## Add an extra dependency for vtk@8.1 on this local brew extract.
#$(OUT)/vtk@8.1.formula: | $(OUT)/vtk-tap.step

$(OUT)/lockmessage.step:
	sudo defaults write /Library/Preferences/com.apple.loginwindow LoginwindowText "8th Wall, LLC.\n318 Cambridge Ave, Palo Alto, CA 94306\n650-222-4144"
	@touch $@

$(OUT)/disable-chrome-back-gesture.step:
	sudo defaults write com.google.Chrome AppleEnableSwipeNavigateWithScrolls -bool FALSE
	@touch $@

$(OUT)/rosetta.step:
	/usr/sbin/softwareupdate --install-rosetta --agree-to-license
	@touch $@

$(OUT)/%.cask:
	$(FUNC) brew8 install cask --force $(basename $(notdir $@))
	@touch $@

$(OUT)/%.formula:
	$(FUNC) brew8 install $(basename $(notdir $@))
	@touch $@

$(OUT)/pip3.step: | $(OUT)/python.formula 
	$(REPO_DIR)/tools8/pip3.sh
	@touch $@

$(OUT)/logo.step:
	@$(FUNC) print_logo
	@touch $@

$(OUT)/openjdk-jdk17.step: $(OUT)/openjdk@17.formula
	sudo ln -sfn /opt/homebrew/opt/openjdk@17/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk-17.jdk
	@touch $@

$(OUT)/java.step: $(OUT)/openjdk.formula $(if $(ARM64),$(OUT)/zulu-jdk8.step,$(OUT)/openjdk-jdk8.step)
	# Install Java8 and a modern Java. Link the modern Java as the system default.	
	sudo ln -sfn $(shell brew --prefix openjdk)/libexec/openjdk.jdk /Library/Java/JavaVirtualMachines/openjdk.jdk
	@touch $@

$(OUT)/xcode-cli.step:
	@$(FUNC) print_banner "Install Xcode Command Line Tools"
	touch /tmp/.com.apple.dt.CommandLineTools.installondemand.in-progress
	$(eval PROD := $(shell softwareupdate -l | grep "\*.*Command Line" | head -n 1 | awk -F":" '{print $$2}' | sed -e 's/^ *//' | tr -d '\n'))
	softwareupdate -i "${PROD}" --verbose;
	rm /tmp/.com.apple.dt.CommandLineTools.installondemand.in-progress
	@touch $@

$(OUT)/git-config.step: | $(OUT)/git.formula 
	@$(FUNC) print_banner "Git Configuration"
	git config --global user.email "$(email_address)"
	git config --global user.name "$(full_name)"
	git config --global push.default simple
	@touch $@

# $(OUT)/tools8-tap.expect: 
#	brew tap 8thwall/tools8
#	@touch $@
# echo "set timeout -1" > $@
# echo "spawn brew tap 8thwall/tools8" >> $@
# echo "expect \"Username for*\"" >> $@
# echo "send -- \"$(email_address)\r\"" >> $@
# echo "expect \"Password for*\"" >> $@
# echo "send -- \"$(shell cat $<)\r\"" >> $@
# echo "expect eof" >> $@

$(OUT)/tools8-tap.step:
	@$(FUNC) print_banner "Tap tools8"
	brew tap 8thwall/tools8
	@touch $@
# expect -f tools8-tap.expect

$(OUT)/g8.step: | $(OUT)/tools8-tap.step
	@$(FUNC) print_banner "Install g8"
	brew install g8
	@touch $@

$(OUT)/tools8.step: | $(OUT)/tools8-tap.step
	@$(FUNC) print_banner "Install tools8"
	brew update
	brew install tools8 --HEAD
	@touch $@

$(OUT)/repo-dir.step:
	mkdir -p $(REPO_DIR)
	@touch $@

$(OUT)/bash.step: | $(OUT)/bash.formula
	@$(FUNC) print_banner "Change default shell to new bash"
	sudo bash -c 'echo "$$(which bash)" >> /etc/shells'
	sudo chsh -s "$$(which bash)" root
	sudo chsh -s "$$(which bash)" $(user_name)
	@touch $@

$(OUT)/plist.step: | $(OUT)/screenlock.step $(OUT)/disablekeyboardctrlarrow.step

$(OUT)/disablekeyboardctrlarrow.step:
	@#Disable Keyboard -> Shortcuts -> Mission Control -> Move left a space (Ctrl-LeftArrow). Conflicts with .inputrc
	$(FUNC) pListSet ~/Library/Preferences/com.apple.symbolichotkeys.plist :AppleSymbolicHotKeys:79:enabled false
	$(FUNC) pListSet ~/Library/Preferences/com.apple.symbolichotkeys.plist :AppleSymbolicHotKeys:80:enabled false
	$(FUNC) pListSet ~/Library/Preferences/com.apple.symbolichotkeys.plist :AppleSymbolicHotKeys:81:enabled false
	$(FUNC) pListSet ~/Library/Preferences/com.apple.symbolichotkeys.plist :AppleSymbolicHotKeys:82:enabled false
	@#The following two lines will cause this change to be reloaded immediately.
	@defaults read com.apple.symbolichotkeys.plist > /dev/null
	@/System/Library/PrivateFrameworks/SystemAdministration.framework/Resources/activateSettings -u
	@touch $@

$(OUT)/screenlock.step:
	@# Require password as soon as screensaver or sleep mode starts
	$(FUNC) pListSet ~/Library/Preferences/com.apple.screensaver.plist :askForPassword 1
	@touch $@


$(OUT)/bash-profile.step:
	@$(FUNC) print_banner "Configure bash_profile"
	$(FUNC) source_bashrc_from_bash_profile
	@touch $@

# #### BASH STUFF  ####

# # Copy bazel auto complete script to the right directory (it's not included with bazelisk by default)
$(OUT)/bazel-complete.step:
	@$(FUNC) print_banner "Copy bazel auto complete script"
	cp ../bash-complete/bazel-complete.bash $(shell brew --prefix)/etc/bash_completion.d/
	@touch $@

# print_banner "Add .inputrc"
# cp .inputrc ~/

# #refresh sudo timer
# sudo -v

$(OUT)/bashrc.step: | $(OUT)/android-commandlinetools.cask $(OUT)/bazel-complete.step
	$(eval SHARE := $(if $(ARM64),/opt/homebrew/share,/usr/local/share))
	$(FUNC) addBashRC "export ANDROID_HOME=$(SHARE)/android-commandlinetools"
	$(FUNC) addBashRC "export ANDROID_SDK_ROOT=$(SHARE)/android-commandlinetools"
	$(FUNC) addBashRC "export PATH=\$$PATH:$(SHARE)/android-commandlinetools/platform-tools"
	$(FUNC) addBashRC "source $(shell brew --prefix)/etc/bash_completion.d/bazel-complete.bash"
	$(FUNC) addBashRC "export JAVA_HOME=$$(/usr/libexec/java_home -v 17)"
	@touch $@

# cat ~/.bashrc
# sudo chown `whoami` ~/.bashrc


# # if [ -d /usr/local/share/android-commandlinetools/tools ] ; then
# #   cd /usr/local/share/android-commandlinetools
# #   mv /usr/local/share/android-commandlinetools/tools /usr/local/share/android-commandlinetools/tools.orig
# #   unzip /tmp/tools_r25.2.5-macosx.zip
# # fi

# # Add various items to .bashrc
# addAlias "c8" "cd ~/repo/code8"
# addAlias "cdc8" "cd ~/repo/code8"
# addAlias "t8" "cd ~/repo/tools8"
# addAlias "cdt8" "cd ~/repo/tools8"
# addAlias "reinstallg8" "brew reinstall g8 --HEAD"

# source ~/.bashrc

