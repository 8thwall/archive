// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"control-panel-element.h"};
  deps = {
    "//c8:string",
    "//c8:vector",
    "//c8/string:format",
    "//c8:c8-log",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0xfd9e173b);

#include "apps/client/internalqa/omniscope/native/control-panel-element.h"

namespace c8 {

const ControlPanelElement ControlPanelElement::checkBox(
  const String &name, bool initialVal, const String &tooltip) {
  return ControlPanelElement(name, Type::CHECKBOX, initialVal, tooltip);
}

const ControlPanelElement ControlPanelElement::slider(
  const String &name, float initialVal, const String &tooltip, float rangeMin, float rangeMax) {
  return ControlPanelElement(name, Type::SLIDER, initialVal, tooltip, rangeMin, rangeMax);
}

const ControlPanelElement ControlPanelElement::intSlider(
  const String &name, int initialVal, const String &tooltip, int rangeMin, int rangeMax) {
  return ControlPanelElement(name, Type::INT_SLIDER, initialVal, tooltip, rangeMin, rangeMax);
}

const ControlPanelElement ControlPanelElement::inputSlider(
  const String &name, float initialVal, const String &tooltip, float rangeMin, float rangeMax) {
  return ControlPanelElement(name, Type::INPUT_SLIDER, initialVal, tooltip, rangeMin, rangeMax);
}

const ControlPanelElement ControlPanelElement::radioButton(
  const String &name, int initialVal, const Vector<String> &options, const String &tooltip) {
  return ControlPanelElement(name, Type::RADIO_BUTTON, initialVal, options, tooltip);
}

const ControlPanelElement ControlPanelElement::button(const String &name, const String &tooltip) {
  return ControlPanelElement(name, Type::BUTTON, tooltip);
}

const ControlPanelElement ControlPanelElement::listBox(
  const String &name, int initialVal, const Vector<String> &options, const String &tooltip) {
  return ControlPanelElement(name, Type::LIST_BOX, initialVal, options, tooltip);
}

String ControlPanelElement::toString() const noexcept {
  return c8::format(
    "(name: %s, type: %d, fVal %f, bVal: %d, iVal: %d, tooltip: %s, # options: %d, rMin: %f, rMax: "
    "%f)",
    name_.c_str(),
    type_,
    fVal_.load(),
    bVal_.load(),
    iVal_.load(),
    tooltip_.c_str(),
    options_.size(),
    rangeMin_,
    rangeMax_);
}

}  // namespace c8
