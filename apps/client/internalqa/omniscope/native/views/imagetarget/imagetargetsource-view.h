// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <memory>

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/string.h"

namespace c8 {

class ImageTargetSourceView : public OmniscopeView {
public:
  ImageTargetSourceView() = default;

  String name() override { return "Image Targets Sources"; }
  void configure(const AppConfiguration &appConfig) override;
  void initialize(std::unique_ptr<OmniscopeViewData> &data) override;
  void processCpu(OmniscopeViewData *in) override;
  void gotTouches(const Vector<Touch> &touches) override;

  // Default move constructors.
  ImageTargetSourceView(ImageTargetSourceView &&) = default;
  ImageTargetSourceView &operator=(ImageTargetSourceView &&) = default;

  // Disallow copying.
  ImageTargetSourceView(const ImageTargetSourceView &) = delete;
  ImageTargetSourceView &operator=(const ImageTargetSourceView &) = delete;

private:
  AppConfiguration appConfig_;
  String srcName_;
};

}  // namespace c8
