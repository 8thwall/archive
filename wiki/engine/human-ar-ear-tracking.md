# Human AR - Ear Tracking

Research Repo

EarAR pipeline

Cropping algorithm

## Datasets

We will use the face datasets:
```bash
bazel run //reality/quality/datasets:dataset-sync -- --direction=down --dataset=face --local=${HOME}/datasets
```

## Ear Tracking Pipeline

Reference code in `eartracker-view.cc`

function `EarTrackerView::processCpu` \--

 1. Read from GPU textures `earRoiProducer.faceRenderer().result()` `earRoiProducer.earRenderer().result()`

 2. Analyze faces and ears `tracker_->track(faceRenderResult, deviceK_)` `tracker_->trackEars(earRenderResult, deviceK_)`

 3. Using current ROIs to render to GPU textures `earRoiProducer.faceRenderer().setDetectedFaces()` `earRoiProducer.earRenderer().setDetectedEars()`

## Cropping

Cropping is following researchers' algorithm described in

8th Wall implementation of bounding box is at `Vector<DetectedPoints> earRoisByFaceMesh(const DetectedPoints &face)` in file `reality/engine/ears/ear-types.cc`

## ROI Rendering

ROI rendering of the ears are using `reality/engine/ears/ear-roi-renderer.cc`

## Lifting to 3D

ROI rendering

The lift3D algorithm in Python is at

The implementation within the reality engine is located at `reality/engine/ears/ear-types.cc`

The function `earLiftLandmarksTo3D`takes in 2D face landmarks and 3D face mesh, transform them into the same normalized image space, then compute the depths in this normalized image space. Then transform the vertices back from the normalized image space to face mesh space.

## Smoothing

 1. Face anchor points smoothing in `Vector<DetectedPoints> earRoisByFaceMesh(const DetectedPoints &face)` in file `reality/engine/ears/ear-types.cc`
