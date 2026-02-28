# Omniscope

# Omniscope

Omniscope is our custom visualization tool that is used for SLAM and image tracking development and debugging. You can download datasets for Omniscope with:
```bash
bazel run //reality/quality/datasets:dataset-sync -- --direction=down --dataset=benchmark --local=${HOME}/datasets
```

There are several different variations of Omniscope.

### 1\. ImGui
```bash
bazel run //apps/client/internalqa/omniscope/imgui:omniscope --
```

This is the primary form of Omniscope that we use when analyzing sequences on desktop and when developing new Omniscope views.

### 2\. Headless

This creates a mp4 video of a run but doesn't show you a display during the creation of the video.

Examples of using this tool:
```bash
bazel run //apps/client/internalqa/omniscope/headless:omniscope -- -m Semantics -v 0 -o ~/Downloads/log.1619050450884_fix.mp4 -i ~/datarecorder/remote/log.1619050450884
```
```bash
bazel run //apps/client/internalqa/omniscope/headless:omniscope -- -o /tmp/slip.mp4 -i ~/datasets/problematic/log.1619563538665 -v 0 -m Semantics
```

### 3\. Stitcher

Stitcher is a useful tool for visualizing multiple sets of parameters against the same sequence by stacking videos on top of each other. You can easily kick off runs to create videos for multiple videos, Omniscope views, and hyperparameters. It’s commonly used for kicking off an overnight run. You can run it with:
```bash
bazel run //apps/client/internalqa/omniscope/headless:stitcher
```

The typical flow for kicking off stitcher sequences is to specify:

 * Your experiment name by updating `EXPERIMENT_NAME`. This will determine the output directory in `~Movies/<EXPERIMENT_NAME>/.`

 * which sequences you want to run in your `~/datasets/` directory by updating `SEQUENCES` which is near the top of `stitcher.ts`.

 * which Omniscope view you want to create videos of by updating `VIEWS`. You can use multiple but it’s common to only need one.

 * which hyperparameters you want to test by updating `PARAMETERS`. With too many hyperparameters, the stitched videos can become too large making it hard to interpret so this is typically only two or three sets of hyperparameters.

 * Running the above command.

Here is an example output of one sequence using two sets of hyperparameters on vps-view which are stacked vertically. Note that stitcher adds the hyperparameters specified on the top left of each view.

The videos for the above screenshot can be found at `<REMOVED_BEFORE_OPEN_SOURCING>` (Google Drive), which showed off the impact of using a great mesh for 8th Wall engine VPS tracking.

There are two outputs for each run:

 1. `~Movies/stitcher_output/` \- these are the intermediate Omniscope Headless output. We store these so that they can be potentially re-used in subsequent followup stitcher runs. Stitcher creates a hash based off the parameters and checks `stitcher_output/` to see if the video has already been made.

 2. `~Movies/<EXPERIMENT_NAME>/` \- output directory for your stitched videos.

The caching has two benefits:

 1. Speed improvements.

 2. Allows you to test across branches / incompatible code by essentially caching the output from one branch. For example, when testing between the dev and prod VPS backend, I could make them hyperparameters or I could:

 1. have one branch be hardcoded to dev → create the intermediate output by adding something like `{'_name': 'dev url'}`.

 2. have another branch be hardcoded to prod → add to `PARAMETERS` `{'_name': 'dev url'}` so that it will use the cached dev url version.

**Known limitations** :

 * Omniscope headless can only run one video at a time, so stitcher does not parallelize the creation of the individual videos. Fixing this would significantly speed up the creation of stitcher sequences

### 4\. JS

Starts a server that serves an index.html. Uses Emscripten to serve the c++ code as part of the JS bundle. You can run this on your desktop or phone browser. Note, if you want to see the source map you must include `--platforms=//bzl:wasm32`.
```bash
bazel run --platforms=//bzl:wasm32 //apps/client/internalqa/omniscope/js/server:server
```

You can add `--features=simd` to build Omniscope JS with SIMD accelerations.
```bash
bazel run --platforms=//bzl:wasm32 --features=simd //apps/client/internalqa/omniscope/js/server:server
```

**Omniscope JS Domain**

You need to update your domain in order to run Omniscope JS. Otherwise the app will complain about `Domain Not Authorized`

Open ` to update your local domain. From project page, go to HOSTING → Edit, add your domain to the list.

More information please refer to `//apps/client/internalqa/omniscope/js/server/index.html`

### 5\. Android

This will build and install the Android app
`./apps/client/internalqa/omniscope/android/build-install.sh`

Get the data off your phone via:
```bash
./apps/client/exploratory/datarecorder/android/get-logs.sh
```

## Omniscope Cache File

Omniscope is using a cache file to remember data history and user preference. It reads from this cache file when launching. If Omniscope has problems launching, it may due to bad data/parameters in the cache file.

The cache file is located at `${HOME}/.c8/omniscope.json`

Omniscope may hang the first time after the cache file is removed. Close and relaunch Omniscope will solve the problem.

# Dataset

### Cloning the existing dataset

First you’ll need the aws cli.

```bash
brew install awscli
aws configure
# follow the instructions. Note we're using aws-west-2. Ask Tony Tomarchio for credentials.
```

You can clone the dataset down using `dataset-sync.js`

For example:
```bash
bazel run //reality/quality/datasets:dataset-sync -- --direction=down --dataset=face --local=${HOME}/datasets
```

# Creating a new sequence using Recorder8 in OmniscopeJS

Startup the OmniscopeJS app which has Viewer and Recorder8.
```bash
bazel run --platforms=//bzl:wasm32 //apps/client/internalqa/omniscope/js/server:server
```

It’ll output what ip address it’s listening on as well as QR code you could scan which will also take you to that IP address.

There are a few possible issues that could happen at this stage:

### Possible Issue #1: Page doesn’t load.

The most common reason this is happening is because your WiFi doesn’t allow for cross device communication. Niantic considers this a potential security risk, however there are a few WiFis that the team has setup which allow for cross device communication.

For example,

 * in SFO it’s vessel-demark.

 * All wifi will work in Palo Alto

 * in London it’s…. TBD

Make sure your phone and laptop are both on that network, restart the Omniscope JS server so it outputs the correct IP, and now you should be able to load the page.

### Possible Issue #2: You see the “This Connection is Not Private” warning

Just hit “Show Details” and then “visit this website”. This is expected.

### Possible Issue #3: Domain Not Authorized

To authorize your domain, go to . Click on “Edit” below “Hosting”. Add your domain to the list. You should now be good to go.

### Creating a Recording

Hit the “New” button. For sequences meant for omniscope, we want the log files to include the images so, toggle “Video” to be “JPEG” (It’s important to do it in this order otherwise it won’t download correctly). Now you can hit the “Start” button which will start the recording. The data will get added to `~/datarecorder/remote`.

Hit “Stop” once you’ve finished recording. Once the “sent” numerator matches the denominator, then you have successfully sent over all of the data to the server for that sequence. You can now safely hit the “New” button again to create another sequence.

# Creating new data using DataRecorder on iOS

(First time):

* * *

 1. Sign into your nianticlabs email. Preferences → Accounts

2\. Allow the developer profile on your phone. Settings → Device Management → Developer App

* * *

Build the DataRecorder app and Launch Xcode with:
```bash
~/repo/niantic/apps/client/exploratory/datarecorder/ios/build-install.sh
```

Connect your phone via USB to your laptop. Select your phone from the dropdown menu:

If you get the following error then you need to install the ios support files for your iOS version, which you can get here: <https://github.com/iGhibli/iOS-DeviceSupport/tree/master/DeviceSupport>

Move the downloaded support folder into /Applications/Xcode.app/Contents/Developer/Platforms/iPhoneOS.platform/DeviceSupport/

If you get an error related to “signing” like this, you may have yet to sign into xcode.

Sign in using your Niantic email. Then select that account under team. Then hit build.

Hit Play on Xcode and it will add the app to the connected iPhone.

Get the data off your phone via:
```bash
./apps/client/exploratory/datarecorder/ios/get-logs.sh
```

You can create a video from the data using:
```bash
find ~/datarecorder/Paris7 ! -name '*.mp4' -name "*log\.*[0-9]*" | xargs -I {} bazel run //reality/quality/codelab/pixels:video-from-datarecorder -- {}
```

# FAQ

## Why is my breakpoint stopping on engine's code TWICE per frame?

If your Omniscope view has its own VioTracker, you would want to disable the default VioTracker that automatically consumes the recording data in `reality/app/xr/capnp/xr-capnp.cc`

Find the code and comment out this part
```
// Run the request.
engine_->execute(requestBuilder.asReader(), &responseBuilder);
```
