// Copyright (c) 2024 Niantic, Inc.
// Original Author: Riyaan Bakhda (riyaanbakhda@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"layout-notification.h", "fa_solid_900.h"};
  deps = {
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//third_party/imgui/icons:imgui-fontawesome",
    "@imgui//:imgui",
  };
  visibility = {
    "//visibility:public",
  };
}
cc_end(0x34a2d614);

#include "layout-notification.h"

namespace c8 {

void layoutNotification(const OmniscopeNotification &notification) {
  ImGui::InsertNotification(
    {static_cast<NotificationType>(notification.type),
     notification.dismissTimeMs,
     notification.message.c_str()});
}

}  // namespace c8