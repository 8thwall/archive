// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)
//
// Omniscope helper functions related to sensor data.

#pragma once

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/color.h"
#include "c8/hvector.h"
#include "c8/pixels/render/object8.h"
#include "reality/engine/tracking/tracking-sensor-event.h"

namespace c8 {

// Fills RequestSensor. Sets timestamps on RequestCamera and then the full RequestPose.
void fillRequestSensorMessage(
  RequestPose::Reader eventQueue,
  int64_t timeNanos,
  int64_t videoTimeNanos,
  int64_t frameTimeNanos,
  double latitude,
  double longitude,
  double horizontalAccuracy,
  RequestSensor::Builder requestSensor);
void fillRequestSensorMessage(const OmniscopeViewData &data, RequestSensor::Builder requestSensor);

// Plots a line graph with a starting lower bound at minVal and an uppperbound at maxVal
void plotLine(
  const String &name,
  const Vector<float> xVals,
  const Vector<float> &yVals,
  SeriesPlot &plot,
  bool startHidden = false,
  float minVal = 0.f,
  float maxVal = 2.f);

// Takes in a vector which contains elements that provide x(), y(), and z() accesors, and plots
// the x, y, and z values of these elements. Uses xVals as the x-axis values.
template <typename T>
void plotXYZ(
  const String &name,
  const Vector<float> xVals,
  const Vector<T> &vec,
  SeriesPlot &x,
  SeriesPlot &y,
  SeriesPlot &z,
  bool startHidden = false) {
  Vector<float> xs;
  Vector<float> ys;
  Vector<float> zs;
  for (const auto &elem : vec) {
    xs.push_back(elem.x());
    ys.push_back(elem.y());
    zs.push_back(elem.z());
  }
  addLine(x, name, xVals, xs, startHidden);
  addLine(y, name, xVals, ys, startHidden);
  addLine(z, name, xVals, zs, startHidden);
}

// Splits up matrix into X, Y, Z, and pitch, yaw, roll and plots onto six plots.
// @param startHidden if true we will hide these series on their plots.
// @param trimFirstNValues how many values to trim from the start of the data. If set to 0 trims
// nothing. If set to 1 removes the first element, i.e. index 0.
void plotHMatrix(
  const String &plotName,
  const String &seriesName,
  const Vector<float> xVals,
  const Vector<HMatrix> &yVals,
  OmniscopeViewData *data,
  bool startHidden = false,
  size_t trimFirstNValues = 0);

struct KalmanResiduals {
  Vector<float> xResiduals;
  Vector<float> yResiduals;
  Vector<float> zResiduals;
  Vector<float> xVariances;
  Vector<float> yVariances;
  Vector<float> zVariances;
};

template <typename OutputVector, typename EstimateUncertaintyMatrix>
KalmanResiduals kalmanPositionResiduals(
  const Vector<OutputVector> &residuals, const Vector<EstimateUncertaintyMatrix> &uncertainties) {
  KalmanResiduals kr;
  for (size_t i = 0; i < residuals.size(); i++) {
    kr.xResiduals.push_back(residuals[i](0));
    kr.yResiduals.push_back(residuals[i](1));
    kr.zResiduals.push_back(residuals[i](2));
    kr.xVariances.push_back(uncertainties[i](0, 0));
    kr.yVariances.push_back(uncertainties[i](1, 1));
    kr.zVariances.push_back(uncertainties[i](2, 2));
  }
  return kr;
}

// Plot the residual chart (measurement - predicted vs uncertainty).
void plotKalmanResiduals(
  const String &name,
  const KalmanResiduals &kalmanResiduals,
  const Vector<float> &xs,
  int numStd,
  SeriesPlot &x,
  SeriesPlot &y,
  SeriesPlot &z);

// Draws arrows where the shape represents the direction of linear acceleration and the length
// represents the magnitude. Arrows are positioned at the given extrinsicTranslations, and use the
// given extrinsicRotations to convert from camera space to world space.
// @param justFirstEventPerFrame whether to only draw one arrow per frame.
void drawLinearAccelerationArrows(
  Group &g,
  const Vector<Vector<TrackingSensorEvent>> &allSensorEvents,
  const Vector<HPoint3> &extrinsicTranslations,
  const Vector<Quaternion> &extrinsicRotations,
  float scale = .04f,
  bool justFirstEventPerFrame = false,
  Color c = Color::DULL_PURPLE);

// Uses IMU events to compute the direction of gravity. Arrows point in direction of gravity, with
// size representing the magnitude. Arrows are positioned at the given extrinsicTranslations.
// NOTE: We only draw one arrow per frame using the last ACCELEROMETER and LINEAR_ACCELERATION
// events that we've received that frame. This means we'll ignore earlier events within each frame.
void drawIMUGravityArrows(
  Group &g,
  const Vector<TrackingSensorFrame> &allSensorFrames,
  const Vector<HPoint3> &extrinsicTranslations,
  float scale = .04f,
  Color c = Color::LIGHT_PURPLE);

// Draws arrows where the shape represents the direction of acceleration and the length
// represents the magnitude. Arrows are positioned at the given positionInWorld.
void drawArrows(
  Group &g,
  const Vector<HPoint3> &positionInWorld,
  const Vector<HVector3> &directionInWorld,
  float scale = .04f,
  Color c = Color::PURPLE_GRAY);

}  // namespace c8
