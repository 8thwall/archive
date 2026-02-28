// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#pragma once

#include <atomic>

#include "c8/c8-log.h"
#include "c8/string.h"
#include "c8/string/format.h"
#include "c8/vector.h"

namespace c8 {

// ControlPanelElement holds all information needed to display a control panel element. Usage:
//
// YourOmniscopeView::configure() {
//   ...
// controlPanelConfig()["Checkbox"] = ControlPanelElement::checkBox("Checkbox", true, "Tooltip");
// controlPanelConfig()["Slider"] = ControlPanelElement::slider("Slider", .3f, "", 0.f, 10.f);
// controlPanelConfig()["IntSlider"] = ControlPanelElement::intSlider("IntSlider", 2, "", 0, 10);
// controlPanelConfig()["InputSlider"] =
//   ControlPanelElement::inputSlider("Input Slider", 34.f, "Double-click me", -100.f, 100.f);
// controlPanelConfig()["RadioButton"] =
//   ControlPanelElement::radioButton("RadioButton", 2, {"a", "b", "c"});
// }
//
// And then to get the value:
// C8Log("%d", controlPanelConfig()["Checkbox"].val<bool>());
// C8Log("%f", controlPanelConfig()["Slider"].val<float>());
// C8Log("%d", controlPanelConfig()["IntSlider"].val<int>());
// C8Log("%f", controlPanelConfig()["InputSlider"].val<float>());
// C8Log("%d", controlPanelConfig()["RadioButton"].val<int>());
class ControlPanelElement {
public:
  enum Type {
    UNSPECIFIED,
    CHECKBOX,
    SLIDER,
    INT_SLIDER,
    INPUT_SLIDER,
    RADIO_BUTTON,
    BUTTON,
    LIST_BOX,
  };
  // Default constructor.
  ControlPanelElement() = default;

  // Disallow move constructors and copy constructor.
  ControlPanelElement(ControlPanelElement &&) = delete;
  ControlPanelElement &operator=(ControlPanelElement &&) = delete;
  ControlPanelElement(const ControlPanelElement &other) = delete;

  // Define copy assignment operator to allow controlPanelConfig()["foo"] =
  // ControlPanelElement::checkBox().
  ControlPanelElement &operator=(const ControlPanelElement &other) {
    if (this != &other) {
      this->bVal_.store(other.bVal_.load());
      this->fVal_.store(other.fVal_.load());
      this->iVal_.store(other.iVal_.load());
      this->name_ = other.name_;
      this->type_ = other.type_;
      this->options_ = other.options_;
      this->tooltip_ = other.tooltip_;
      this->rangeMin_ = other.rangeMin_;
      this->rangeMax_ = other.rangeMax_;
      return *this;
    }
    return *this;
  };

  static const ControlPanelElement checkBox(
    const String &name, bool val, const String &tooltip = "");
  static const ControlPanelElement slider(
    const String &name,
    float val,
    const String &tooltip = "",
    float rangeMin = 0.f,
    float rangeMax = 1.f);
  static const ControlPanelElement intSlider(
    const String &name, int val, const String &tooltip = "", int rangeMin = 0, int rangeMax = 100);
  static const ControlPanelElement inputSlider(
    const String &name,
    float val,
    const String &tooltip = "",
    float rangeMin = 0.f,
    float rangeMax = 1.f);
  static const ControlPanelElement radioButton(
    const String &name, int val, const Vector<String> &options, const String &tooltip = "");
  static const ControlPanelElement button(const String &name, const String &tooltip = "");
  static const ControlPanelElement listBox(
    const String &name, int val, const Vector<String> &options, const String &tooltip = "");

  void setVal(bool val) { bVal_ = val; }
  void setVal(float val) { fVal_ = val; }
  void setVal(int val) { iVal_ = val; }
  void setRangeMax(float val) { rangeMax_ = val; }

  template <typename T>
  T val() const {
    T::unsupported_data_type;
  }
  template <>
  bool val<bool>() const {
    auto retVal = bVal_.load();
    if (type_ == ControlPanelElement::Type::BUTTON) {
      // Buttons must reset once the val is accessed
      bVal_ = false;
    }
    return retVal;
  }
  template <>
  float val<float>() const {
    return fVal_.load();
  }
  template <>
  int val<int>() const {
    return iVal_.load();
  }

  const String &name() const { return name_; }
  const Type &type() const { return type_; }
  const String &tooltip() const { return tooltip_; }
  const Vector<String> &options() const { return options_; }
  float rangeMin() const { return rangeMin_; }
  float rangeMax() const { return rangeMax_; }
  String toString() const noexcept;

private:
  ControlPanelElement(const String &name, Type type, bool initialVal, const String &tooltip)
      : name_(name), type_(type), bVal_(initialVal), tooltip_(tooltip) {}
  ControlPanelElement(
    const String &name,
    Type type,
    int initialVal,
    const String &tooltip,
    int rangeMin,
    int rangeMax)
      : name_(name),
        type_(type),
        iVal_(initialVal),
        tooltip_(tooltip),
        rangeMin_(rangeMin),
        rangeMax_(rangeMax) {}
  ControlPanelElement(
    const String &name,
    Type type,
    float initialVal,
    const String &tooltip,
    float rangeMin,
    float rangeMax)
      : name_(name),
        type_(type),
        fVal_(initialVal),
        tooltip_(tooltip),
        rangeMin_(rangeMin),
        rangeMax_(rangeMax) {}
  ControlPanelElement(
    const String &name,
    Type type,
    int initialVal,
    const Vector<String> &options,
    const String &tooltip)
      : name_(name), type_(type), iVal_(initialVal), options_(options), tooltip_(tooltip) {}
  ControlPanelElement(const String &name, Type type, const String &tooltip)
      : name_(name), type_(type), tooltip_(tooltip) {}

  String name_;
  Type type_ = UNSPECIFIED;
  mutable std::atomic<bool> bVal_ = false;  // Mutable so that Button value can reset once used
  std::atomic<float> fVal_ = 0.f;
  std::atomic<int> iVal_ = 0;
  Vector<String> options_;
  String tooltip_;
  float rangeMin_ = 0.f;
  float rangeMax_ = 1.f;
};

}  // namespace c8
