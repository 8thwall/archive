// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"layout-formatting.h"};
  deps = {
    "//c8:string",
    "//c8:string-view",
    "//c8:color",
    "//c8:map",
    "//third_party/imgui/icons:imgui-fontawesome",
    "@imgui//:imgui",
  };
}
cc_end(0xd818d855);

#include <imgui.h>

#include "apps/client/internalqa/omniscope/imgui/layout-formatting.h"
#include "c8/map.h"
#include "c8/string-view.h"
#include "third_party/imgui/icons/IconsFontAwesome4.h"

namespace c8 {
namespace {
const TreeMap<StringView, String> TYPE_TO_ICON = {
  {"Scene", ICON_FA_WINDOW_MAXIMIZE},
  {"Group", ICON_FA_CUBES},
  {"Renderable", ICON_FA_CUBE},
  {"Camera", ICON_FA_CAMERA},
  {"Light", ICON_FA_LIGHTBULB_O},
};
}

String typeToIcon(const String &typeName) {
  if (TYPE_TO_ICON.find(typeName) != TYPE_TO_ICON.end()) {
    return TYPE_TO_ICON.at(typeName);
  }
  return ICON_FA_QUESTION;
}

ImVec4 toImColor(const Color &color) {
  return {color.r() / 255.f, color.g() / 255.f, color.b() / 255.f, color.a() / 255.f};
}

void selectableText(String s) {
  // Based off of ImGui extension for stl types which lets you pass a std::string* to InputText
  // directly. We write our own version to allow callers to pass a std::string instead of a
  // std::string*. We do this because our text is read-only, so it's not important for the caller to
  // be returned changes to the string (the main purpose of InputText is as a text input box).
  // https://github.com/ocornut/imgui/blob/master/misc/cpp/imgui_stdlib.cpp#L47
  ImGui::PushStyleColor(ImGuiCol_FrameBg, {0, 0, 0, 0});
  ImGui::PushItemWidth(ImGui::CalcTextSize(s.c_str()).x);
  ImGui::PushID(s.c_str());
  ImGui::InputText(
    "",
    const_cast<char *>(s.c_str()),
    s.capacity() + 1,
    ImGuiInputTextFlags_ReadOnly | ImGuiInputTextFlags_NoHorizontalScroll);
  ImGui::PopID();
  ImGui::PopItemWidth();
  ImGui::PopStyleColor();
}

}  // namespace c8
