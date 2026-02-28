// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <memory>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/map.h"
#include "c8/string.h"
#include "c8/vector.h"

namespace c8 {

// View group names. These can be used by frontends to hardcode a default view group to use, instead
// of or in addition to allowing a user to choose or swap groups dynamically.
constexpr const char *BENCHMARK_VIEW_GROUP = "Benchmark";
constexpr const char *EXPERIMENTAL_VIEW_GROUP = "Experimental";
constexpr const char *IMAGE_TARGET_VIEW_GROUP = "Image Targets";
constexpr const char *POSE_VIEW_GROUP = "Pose";
constexpr const char *SENSORS_VIEW_GROUP = "Sensors";
constexpr const char *SEMANTICS_VIEW_GROUP = "Semantics";
constexpr const char *UITEST_VIEW_GROUP = "UI Test";
constexpr const char *FEATURES_VIEW_GROUP = "Visual-Inertial Odometry";
constexpr const char *SLICK_VIEW_GROUP = "SLICK Algorithm";
constexpr const char *MASSF_VIEW_GROUP = "MASSF";

class OmniscopeApp {
public:
  OmniscopeApp();

  void initializeViews();
  void clearViews();

  int numViews() const { return views().size(); }
  int currentView() const { return currentView_; }

  OmniscopeView *current() { return views()[currentView_].get(); }

  void setView(int newCurrentView) {
    if (numViews() == 0) {
      C8_THROW("[omniscope-app] There are 0 views in viewGroup \"%s\"", currentViewGroup_.c_str());
    }
    currentView_ = newCurrentView % numViews();
    C8Log(
      "[omniscope-app] Setting view to %d (%s) (currentViewGroup_: %s)",
      currentView_,
      views_[currentViewGroup_][currentView_]->name().c_str(),
      currentViewGroup_.c_str());
  }

  void setViewGroup(const String &group);

  void goNext() { return setView((currentView_ + 1) % views().size()); }

  void goPrev() {
    return currentView_ == 0 ? setView(views().size() - 1) : setView(currentView_ - 1);
  }

  Vector<String> viewNames() const;
  Vector<String> viewGroupNames() const;

  // Default move constructors.
  OmniscopeApp(OmniscopeApp &&) = default;
  OmniscopeApp &operator=(OmniscopeApp &&) = default;

  // Disallow copying.
  OmniscopeApp(const OmniscopeApp &) = delete;
  OmniscopeApp &operator=(const OmniscopeApp &) = delete;

private:
  Vector<std::unique_ptr<OmniscopeView>> &views() { return views_[currentViewGroup_]; }
  const Vector<std::unique_ptr<OmniscopeView>> &views() const {
    return views_.at(currentViewGroup_);
  }

  TreeMap<String, Vector<std::unique_ptr<OmniscopeView>>> views_;
  int currentView_ = 0;
  String currentViewGroup_;

  std::unique_ptr<Scene> syntheticScene_;
};

}  // namespace c8
