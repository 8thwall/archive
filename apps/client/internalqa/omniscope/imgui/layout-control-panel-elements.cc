// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"layout-control-panel-elements.h"};
  deps = {
    "//apps/client/internalqa/omniscope/native:control-panel-element",
    "//c8/pixels/render:object8",
    "@imgui//:imgui",
  };
}
cc_end(0xfff7e06b);

#include <imgui.h>

#include "apps/client/internalqa/omniscope/imgui/layout-control-panel-elements.h"

namespace c8 {
namespace {

void setControlPanelElementWidth() {
  ImGui::SetNextItemWidth(ImGui::GetContentRegionAvail().x * .4f);
}
}  // namespace

bool layoutCheckbox(ControlPanelElement *c, bool val) {
  setControlPanelElementWidth();
  if (ImGui::Checkbox(c->name().c_str(), &val)) {
    c->setVal(val);
    return true;
  }
  return false;
}

bool layoutSlider(ControlPanelElement *c, float val) {
  setControlPanelElementWidth();
  if (ImGui::SliderFloat(c->name().c_str(), &val, c->rangeMin(), c->rangeMax(), "%.6f")) {
    c->setVal(val);
    return true;
  }
  return false;
}

bool layoutIntSlider(ControlPanelElement *c, int val) {
  setControlPanelElementWidth();
  if (ImGui::SliderInt(c->name().c_str(), &val, c->rangeMin(), c->rangeMax())) {
    c->setVal(val);
    return true;
  }
  return false;
}

bool layoutInputSlider(ControlPanelElement *c, float val) {
  setControlPanelElementWidth();
  if (ImGui::DragFloat(
        c->name().c_str(),
        &val,
        (c->rangeMax() - c->rangeMin()) / 100.f,
        c->rangeMin(),
        c->rangeMax(),
        "%.6f")) {
    c->setVal(val);
    return true;
  }
  return false;
}

bool layoutRadioButton(ControlPanelElement *c, int val) {
  bool dirty = false;
  ImGui::Text("%s: ", c->name().c_str());
  for (int i = 0; i < c->options().size(); ++i) {
    ImGui::SameLine();
    if (ImGui::RadioButton(c->options()[i].c_str(), &val, i)) {
      c->setVal(val);
      dirty = true;
    }
  }
  return dirty;
}

bool layoutButton(ControlPanelElement *c, bool val) {
  setControlPanelElementWidth();
  auto currentState = ImGui::Button(c->name().c_str());
  c->setVal(val || currentState);
  return currentState;
}

bool layoutListBox(ControlPanelElement *c, int val) {
  bool dirty = false;
  ImGui::Text("%s: ", c->name().c_str());
  if (ImGui::BeginListBox("")) {
    for (int i = 0; i < c->options().size(); i++) {
      const bool is_selected = (val == i);
      if (ImGui::Selectable(c->options()[i].c_str(), is_selected)) {
        val = i;
        c->setVal(val);
        dirty = true;
      }

      if (is_selected) {
        ImGui::SetItemDefaultFocus();
      }
    }
    ImGui::EndListBox();
  }
  return dirty;
}

}  // namespace c8
