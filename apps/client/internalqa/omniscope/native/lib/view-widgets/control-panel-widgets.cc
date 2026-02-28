// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "control-panel-widgets.h",
  };
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//c8:c8-log",
    "//c8:hvector",
    "//c8:hmatrix",
    "//c8:parameter-data",
    "//c8:quaternion",
    "//c8/stats:scope-timer",
    "//c8/string:format",
  };
  visibility = {
    "//apps/client/internalqa/omniscope:__subpackages__",
  };
}
cc_end(0x5bbb7f7d);

#include "apps/client/internalqa/omniscope/native/lib/view-widgets/control-panel-widgets.h"

namespace c8 {

void configureHMatrixControlPanel(
  ControlPanelConfig &panelConfig,
  const String &camName,
  const HVector3 &t,
  const HVector3 &r,
  float scale) {
  auto txLabel = format("%s_tx", camName.c_str());
  auto tyLabel = format("%s_ty", camName.c_str());
  auto tzLabel = format("%s_tz", camName.c_str());
  auto rxLabel = format("%s_rx", camName.c_str());
  auto ryLabel = format("%s_ry", camName.c_str());
  auto rzLabel = format("%s_rz", camName.c_str());
  auto scaleLabel = format("%s_scale", camName.c_str());
  panelConfig[txLabel] =
    ControlPanelElement::inputSlider(txLabel, t.x(), "Double-click me", -5.f, 5.f);
  panelConfig[tyLabel] =
    ControlPanelElement::inputSlider(tyLabel, t.y(), "Double-click me", -2.f, 2.f);
  panelConfig[tzLabel] =
    ControlPanelElement::inputSlider(tzLabel, t.z(), "Double-click me", -5.f, 5.f);
  panelConfig[rxLabel] =
    ControlPanelElement::inputSlider(rxLabel, r.x(), "Double-click me", -180.f, 180.f);
  panelConfig[ryLabel] =
    ControlPanelElement::inputSlider(ryLabel, r.y(), "Double-click me", -180.f, 180.f);
  panelConfig[rzLabel] =
    ControlPanelElement::inputSlider(rzLabel, r.z(), "Double-click me", -180.f, 180.f);
  panelConfig[scaleLabel] =
    ControlPanelElement::inputSlider(scaleLabel, scale, "Double-click me", .1f, 10.f);
}

HMatrix getHMatrixControlPanel(ControlPanelConfig &panelConfig, const String &camName) {
  auto txLabel = format("%s_tx", camName.c_str());
  auto tyLabel = format("%s_ty", camName.c_str());
  auto tzLabel = format("%s_tz", camName.c_str());
  auto rxLabel = format("%s_rx", camName.c_str());
  auto ryLabel = format("%s_ry", camName.c_str());
  auto rzLabel = format("%s_rz", camName.c_str());
  auto scaleLabel = format("%s_scale", camName.c_str());
  return HMatrixGen::translation(
           panelConfig[txLabel].val<float>(),
           panelConfig[tyLabel].val<float>(),
           panelConfig[tzLabel].val<float>())
    * HMatrixGen::rotationD(
           panelConfig[rxLabel].val<float>(),
           panelConfig[ryLabel].val<float>(),
           panelConfig[rzLabel].val<float>())
    * HMatrixGen::scale(panelConfig[scaleLabel].val<float>());
}

void configureHVector2ControlPanel(
  ControlPanelConfig &panelConfig,
  const String &namePrefix,
  const HVector2 &t,
  float minVal,
  float maxVal) {
  auto txLabel = format("%s_tx", namePrefix.c_str());
  auto tyLabel = format("%s_ty", namePrefix.c_str());
  panelConfig[txLabel] =
    ControlPanelElement::inputSlider(txLabel, t.x(), "Double-click me", minVal, maxVal);
  panelConfig[tyLabel] =
    ControlPanelElement::inputSlider(tyLabel, t.y(), "Double-click me", minVal, maxVal);
}

HVector2 getHVector2ControlPanel(ControlPanelConfig &panelConfig, const String &namePrefix) {
  auto txLabel = format("%s_tx", namePrefix.c_str());
  auto tyLabel = format("%s_ty", namePrefix.c_str());
  return {panelConfig[txLabel].val<float>(), panelConfig[tyLabel].val<float>()};
}

void configureHVector3ControlPanel(
  ControlPanelConfig &panelConfig,
  const String &namePrefix,
  const HVector3 &t,
  float minVal,
  float maxVal) {
  auto txLabel = format("%s_tx", namePrefix.c_str());
  auto tyLabel = format("%s_ty", namePrefix.c_str());
  auto tzLabel = format("%s_tz", namePrefix.c_str());
  panelConfig[txLabel] =
    ControlPanelElement::inputSlider(txLabel, t.x(), "Double-click me", minVal, maxVal);
  panelConfig[tyLabel] =
    ControlPanelElement::inputSlider(tyLabel, t.y(), "Double-click me", minVal, maxVal);
  panelConfig[tzLabel] =
    ControlPanelElement::inputSlider(tzLabel, t.z(), "Double-click me", minVal, maxVal);
}

HVector3 getHVector3ControlPanel(ControlPanelConfig &panelConfig, const String &namePrefix) {
  auto txLabel = format("%s_tx", namePrefix.c_str());
  auto tyLabel = format("%s_ty", namePrefix.c_str());
  auto tzLabel = format("%s_tz", namePrefix.c_str());
  return {
    panelConfig[txLabel].val<float>(),
    panelConfig[tyLabel].val<float>(),
    panelConfig[tzLabel].val<float>()};
}
}  // namespace c8
