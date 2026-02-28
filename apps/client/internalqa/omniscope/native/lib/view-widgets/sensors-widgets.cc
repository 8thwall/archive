// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "sensors-widgets.h",
  };
  deps = {
    "//c8:c8-log",
    "//c8:color",
    "//c8:hmatrix",
    "//c8:hvector",
    "//c8:quaternion",
    "//c8:string",
    "//c8/geometry:device-pose",
    "//c8/geometry:egomotion",
    "//c8/geometry:vectors",
    "//c8/pixels:draw3-widgets",
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//c8/pixels/render:object8",
    "//reality/engine/tracking:tracking-sensor-event",
  };
  visibility = {
    "//apps/client/internalqa/omniscope:__subpackages__",
  };
}
cc_end(0x46dcbc7e);

#include "apps/client/internalqa/omniscope/native/lib/view-widgets/sensors-widgets.h"
#include "c8/geometry/device-pose.h"
#include "c8/geometry/egomotion.h"
#include "c8/geometry/vectors.h"
#include "c8/hmatrix.h"
#include "c8/pixels/draw3-widgets.h"
#include "c8/string.h"

namespace c8 {
namespace {
void plotResiduals(
  const String &name,
  const Vector<float> &residuals,
  const Vector<float> &variances,
  const Vector<float> &xs,
  int numStd,
  SeriesPlot &plot) {
  Vector<float> uncertaintyLower;
  Vector<float> uncertaintyUpper;
  for (auto v : variances) {
    float stdDev = std::sqrt(v);
    uncertaintyLower.push_back(numStd * -stdDev);
    uncertaintyUpper.push_back(numStd * stdDev);
  }
  addLine(plot, format("%s - residual", name.c_str()), xs, residuals);
  addLine(
    plot, format("%s - uncertainty lower (%d std)", name.c_str(), numStd), xs, uncertaintyLower);
  addLine(
    plot, format("%s - uncertainty upper (%d std)", name.c_str(), numStd), xs, uncertaintyUpper);
}

Vector<float> trimNFromStart(Vector<float> v, size_t n) {
  return {v.begin() + std::min(n, v.size()), v.end()};
}

}  // namespace

void plotHMatrix(
  const String &plotName,
  const String &seriesName,
  const Vector<float> xVals,
  const Vector<HMatrix> &yVals,
  OmniscopeViewData *data,
  bool startHidden,
  size_t trimFirstNValues) {
  // Translation.
  Vector<float> xs;
  Vector<float> ys;
  Vector<float> zs;
  // Pitch-yaw-roll.
  Vector<float> pitch;
  Vector<float> yaw;
  Vector<float> roll;
  for (int i = trimFirstNValues; i < yVals.size(); ++i) {
    auto t = translation(yVals[i]);
    auto r = rotation(yVals[i]).toPitchYawRollDegrees();
    xs.push_back(t.x());
    ys.push_back(t.y());
    zs.push_back(t.z());
    pitch.push_back(r.x());
    yaw.push_back(r.y());
    roll.push_back(r.z());
  }
  auto trimmedXVals = trimNFromStart(xVals, trimFirstNValues);
  addLine(
    data->mutableSeriesPlot(format("%s X", plotName.c_str())),
    seriesName,
    trimmedXVals,
    xs,
    startHidden);
  addLine(
    data->mutableSeriesPlot(format("%s Y", plotName.c_str())),
    seriesName,
    trimmedXVals,
    ys,
    startHidden);
  addLine(
    data->mutableSeriesPlot(format("%s Z", plotName.c_str())),
    seriesName,
    trimmedXVals,
    zs,
    startHidden);
  addLine(
    data->mutableSeriesPlot(format("%s Pitch", plotName.c_str())),
    seriesName,
    trimmedXVals,
    pitch,
    startHidden);
  addLine(
    data->mutableSeriesPlot(format("%s Yaw", plotName.c_str())),
    seriesName,
    trimmedXVals,
    yaw,
    startHidden);
  addLine(
    data->mutableSeriesPlot(format("%s Roll", plotName.c_str())),
    seriesName,
    trimmedXVals,
    roll,
    startHidden);
}

void fillRequestSensorMessage(
  RequestPose::Reader eventQueue,
  int64_t timeNanos,
  int64_t videoTimeNanos,
  int64_t frameTimeNanos,
  double latitude,
  double longitude,
  double horizontalAccuracy,
  RequestSensor::Builder requestSensor) {
  MutableRootMessage<RequestCamera> requestCamera;
  requestCamera.builder().getCurrentFrame().setTimestampNanos(timeNanos);
  requestCamera.builder().getCurrentFrame().setVideoTimestampNanos(videoTimeNanos);
  requestCamera.builder().getCurrentFrame().setFrameTimestampNanos(frameTimeNanos);

  requestSensor.getGps().setLatitude(latitude);
  requestSensor.getGps().setLongitude(longitude);
  requestSensor.getGps().setHorizontalAccuracy(horizontalAccuracy);
  requestSensor.setCamera(requestCamera.reader());
  requestSensor.setPose(eventQueue);
}

void fillRequestSensorMessage(const OmniscopeViewData &data, RequestSensor::Builder requestSensor) {
  fillRequestSensorMessage(
    data.eventQueue(),
    data.timeNanos(),
    data.videoTimeNanos(),
    data.frameTimeNanos(),
    data.latitude(),
    data.longitude(),
    data.horizontalAccuracy(),
    requestSensor);
}

void plotLine(
  const String &name,
  const Vector<float> xVals,
  const Vector<float> &yVals,
  SeriesPlot &plot,
  bool startHidden,
  float minVal,
  float maxVal) {
  addLine(plot, name, xVals, yVals, startHidden);

  // TODO(paris): Implement this with ImPlot directly so that there are not extra lines drawn.
  // Add place holder lines so the chart stays fixed in place even if the min/max of yVals change.
  // Vector<float> lowerBoundLine(yVals.size(), minVal);
  // Vector<float> upperBoundLine(yVals.size(), maxVal);
  // addLine(plot, "", xVals, lowerBoundLine);
  // addLine(plot, "", xVals, upperBoundLine);
}

void plotKalmanResiduals(
  const String &name,
  const KalmanResiduals &kalmanResiduals,
  const Vector<float> &xs,
  int numStd,
  SeriesPlot &x,
  SeriesPlot &y,
  SeriesPlot &z) {
  plotResiduals(name, kalmanResiduals.xResiduals, kalmanResiduals.xVariances, xs, numStd, x);
  plotResiduals(name, kalmanResiduals.yResiduals, kalmanResiduals.yVariances, xs, numStd, y);
  plotResiduals(name, kalmanResiduals.zResiduals, kalmanResiduals.zVariances, xs, numStd, z);
}

void drawLinearAccelerationArrows(
  Group &g,
  const Vector<Vector<TrackingSensorEvent>> &allSensorEvents,
  const Vector<HPoint3> &extrinsicTranslations,
  const Vector<Quaternion> &extrinsicRotations,
  float scale,
  bool justFirstEventPerFrame,
  Color c) {
  // Count the number of sensor events we will add arrows for.
  auto size = 0;
  if (justFirstEventPerFrame) {
    size = allSensorEvents.size();
  } else {
    for (const auto &v : allSensorEvents) {
      for (auto event : v) {
        if (event.kind == TrackingSensorEvent::LINEAR_ACCELERATION) {
          size++;
        }
      }
    }
  }

  // Make sure we have GPU resources for all arrows.
  while (size > g.children().size()) {
    g.add(ObGen::arrow(c));
  }

  // Update position of arrows.
  int j = 0;
  for (int i = 0; i < allSensorEvents.size(); ++i) {
    for (auto event : allSensorEvents[i]) {
      if (event.kind == TrackingSensorEvent::LINEAR_ACCELERATION) {
        auto linAccelInWorld = extrinsicRotations[i].toRotationMat() * event.hvector();
        auto rot = rotationToVector(linAccelInWorld);
        auto s = scale * linAccelInWorld.l2Norm();
        g.children()[j]
          ->setLocal(cameraMotion(extrinsicTranslations[i], rot) * HMatrixGen::scale(s))
          .setEnabled(true);
        j++;
        if (justFirstEventPerFrame) {
          break;
        }
      }
    }
  }

  // Disable objects who we don't have sensor events for.
  while (j < g.children().size()) {
    g.children()[j]->setEnabled(false);
    j++;
  }
}

void drawIMUGravityArrows(
  Group &g,
  const Vector<TrackingSensorFrame> &allSensorFrames,
  const Vector<HPoint3> &extrinsicTranslations,
  float scale,
  Color c) {
  Vector<HPoint3> positionInWorld;
  Vector<HVector3> imuGravityInWorld;
  for (int i = 0; i < allSensorFrames.size(); ++i) {
    HVector3 linAccelInCam;
    HVector3 accelInCam;
    int hasLinAccel = 0;
    int hasAccel = 0;
    for (auto event : allSensorFrames[i].sensorEvents) {
      if (event.kind == TrackingSensorEvent::LINEAR_ACCELERATION) {
        linAccelInCam = event.hvector();
        hasLinAccel++;
      }
      if (event.kind == TrackingSensorEvent::ACCELEROMETER) {
        accelInCam = event.hvector();
        hasAccel++;
      }
    }
    if (hasLinAccel != hasAccel) {
      // NOTE(paris): We assume that accelerometer and linear acceleration events are 1:1, but you
      // can comment this back in to test this assumption if you end up using ACCELEROMETER events
      // and manually removing gravity.
      // C8Log(
      //   "[sensors-widgets] LINEAR_ACCELERATION (%d) and ACCELEROMETER (%d) don't match on frame "
      //   "%d.",
      //   hasLinAccel,
      //   hasAccel,
      //   i);
      continue;
    }
    auto camToWorld = xrRotationFromDeviceRotation(allSensorFrames[i].devicePose).toRotationMat();
    auto linAccelInWorld = camToWorld * linAccelInCam;
    auto accelInWorld = camToWorld * accelInCam;
    imuGravityInWorld.push_back((accelInWorld - linAccelInWorld) * -1.f);
    positionInWorld.push_back(extrinsicTranslations[i]);
  }
  drawArrows(g, positionInWorld, imuGravityInWorld, scale, c);
}

void drawArrows(
  Group &g,
  const Vector<HPoint3> &positionInWorld,
  const Vector<HVector3> &directionInWorld,
  float scale,
  Color c) {
  // Make sure we have GPU resources for all arrows.
  while (positionInWorld.size() > g.children().size()) {
    g.add(ObGen::arrow(c));
  }

  // Update position of arrows.
  for (int i = 0; i < g.children().size(); ++i) {
    if (i < positionInWorld.size()) {
      auto rot = rotationToVector(directionInWorld[i]);
      auto s = scale * directionInWorld[i].l2Norm();
      g.children()[i]
        ->setLocal(cameraMotion(positionInWorld[i], rot) * HMatrixGen::scale(s))
        .setEnabled(true);
    } else {
      // If we had more arrows previously, hide ones we aren't rendering anymore.
      g.children()[i]->setEnabled(false);
    }
  }
}

}  // namespace c8
