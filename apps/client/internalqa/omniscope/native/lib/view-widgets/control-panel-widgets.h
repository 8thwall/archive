// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)
//
// Omniscope helper functions related to the control panel.

#pragma once

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/hmatrix.h"
#include "c8/hvector.h"
#include "c8/parameter-data.h"

namespace c8 {

template <typename T>
void setGlobalParamFromConfig(ControlPanelConfig &panelConfig, const String &name, T *prevVal) {
  auto newVal = panelConfig[name].val<T>();
  if (*prevVal != newVal) {
    *prevVal = newVal;
    globalParams().set<T>(name.c_str(), newVal);
  }
}

// HMatrix control panel widget.
void configureHMatrixControlPanel(
  ControlPanelConfig &panelConfig,
  const String &camName,
  const HVector3 &t,
  const HVector3 &r,
  float scale = 1.f);
HMatrix getHMatrixControlPanel(ControlPanelConfig &panelConfig, const String &camName);

// HVector2 control panel widget.
void configureHVector2ControlPanel(
  ControlPanelConfig &panelConfig,
  const String &namePrefix,
  const HVector2 &t,
  float minVal = -1.f,
  float maxVal = 1.f);
HVector2 getHVector2ControlPanel(ControlPanelConfig &panelConfig, const String &namePrefix);

// HVector3 control panel widget.
void configureHVector3ControlPanel(
  ControlPanelConfig &panelConfig,
  const String &namePrefix,
  const HVector3 &t,
  float minVal,
  float maxVal);
HVector3 getHVector3ControlPanel(ControlPanelConfig &panelConfig, const String &namePrefix);

}  // namespace c8
