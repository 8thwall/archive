// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#pragma once

#include "c8/color.h"
#include "c8/string.h"

namespace c8 {

String typeToIcon(const String &typeName);
ImVec4 toImColor(const Color &color);

// Uses ImGui::InputText() to display selectable read-only text.
void selectableText(String s);

}  // namespace c8
