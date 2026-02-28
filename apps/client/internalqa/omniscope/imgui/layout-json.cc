// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"layout-json.h"};
  deps = {
    "//c8/pixels/render:object8",
    "//c8:string",
    "@imgui//:imgui",
    "@json//:json",
  };
}
cc_end(0x54776fba);

#include <imgui.h>

#include "apps/client/internalqa/omniscope/imgui/layout-json.h"

namespace c8 {

// Given a list that you want to turn into groups, return the length of each group
// list of 100 items -> 10 groups of 10. delimiter = 10
// list of 500 items -> 5 groups of 100. delimiter = 100
// list of 550 items -> 5 groups of 100 and one group of 50. delimiter = 100
// list of 10,000 items -> 10 groups of 1000. delimiter = 1000
int getDelimiter(int size) {
  const auto logNum = std::log10(size - 1.0f);
  const auto delimiter = std::max(std::pow(10, std::floor(logNum)), 1.0);
  return static_cast<int>(delimiter);
}

// Given a size of a list, it will push the correct layout of group nodes
// For laying out metadata, we want to group large lists into subtrees.  Each group is further
// divided into more groups until we're at groups of 10.
void layoutGrouping(
  const Object8 &node,
  int start,
  int end,
  const TreeMap<int, std::pair<String, nlohmann::json>> &jsonMap,
  bool isElementMetadata,
  bool didSelectNodeInView,
  int selectedElementIndex) {
  ImGuiTreeNodeFlags nodeFlags =
    ImGuiTreeNodeFlags_OpenOnArrow | ImGuiTreeNodeFlags_OpenOnDoubleClick;
  const int size = end - start;
  const int delimiter = getDelimiter(size);

  for (int i = start; i < end; i += delimiter) {
    // if the delimiter is one, then we are now able to render the json
    if (delimiter == 1) {
      const auto &jsonData = jsonMap.at(i);
      layoutJSON(
        node,
        jsonData.first,
        jsonData.second,
        i,
        isElementMetadata,
        didSelectNodeInView,
        selectedElementIndex);
    } else {
      // If the delimiter is greater than one, then we need to keep laying out more group nodes.
      const String groupName = format("[%d-%d]", i, std::min(end, i + delimiter) - 1);
      // We associate the node with the groupKey so that opening or closing one node's metadata
      // won't affect another node's metadata.
      const String groupKey = format("%s_%s", node.id().c_str(), groupName.c_str());

      // If didSelectNodeInView == true, the user clicked on an element this frame.  Highlight the
      // node and element that was clicked on by opening up parent group nodes to the element and
      // collapsing all the others.
      if (didSelectNodeInView && isElementMetadata && selectedElementIndex > -1) {
        ImGui::SetNextItemOpen(i <= selectedElementIndex && selectedElementIndex < i + delimiter);
      }

      if (ImGui::TreeNodeEx(groupKey.c_str(), nodeFlags, "%s", groupName.c_str())) {
        layoutGrouping(
          node,
          i,
          std::min(end, i + delimiter),
          jsonMap,
          isElementMetadata,
          didSelectNodeInView,
          selectedElementIndex);
        ImGui::TreePop();
      }
    }
  }
}

// returns if it's a primitive JSON value (non object/array), renders it if it is.
bool layoutJSONPrimitive(const String &key, const nlohmann::json &value) {
  if (value.is_string()) {
    ImGui::BulletText("%s: %s", key.c_str(), value.get<String>().c_str());
    return true;
  } else if (value.is_boolean()) {
    ImGui::BulletText("%s: %s", key.c_str(), value.get<bool>() ? "true" : "false");
    return true;
  } else if (value.is_number_float()) {
    ImGui::BulletText("%s: %f", key.c_str(), value.get<float>());
    return true;
  } else if (value.is_number_integer()) {
    ImGui::BulletText("%s: %d", key.c_str(), value.get<int>());
    return true;
  }

  return false;
}

void layoutJSON(
  const Object8 &node,
  const String &key,
  const nlohmann::json &json,
  int index,
  bool isElementMetadata,
  bool didSelectNodeInView,
  int selectedElementIndex) {
  // If we have a primitive (non object/array), then just render it and return.
  if (layoutJSONPrimitive(key, json)) {
    return;
  }

  // We are now assuming an object or array.
  ImGuiTreeNodeFlags nodeFlags =
    ImGuiTreeNodeFlags_OpenOnArrow | ImGuiTreeNodeFlags_OpenOnDoubleClick;

  // Open the root JSON (index == -1) for both metadata() and elementMetadata() by default.
  if (index == -1) {
    nodeFlags |= ImGuiTreeNodeFlags_DefaultOpen;
  }

  // This logic is for visualizing elements selected in the view, which involves elementMetadata()
  // and not metadata().
  if (isElementMetadata) {
    // Highlight the selected element.  Don't highlight the root element.
    if (index == selectedElementIndex && index != -1) {
      nodeFlags |= ImGuiTreeNodeFlags_Selected;
    }

    // If didSelectNodeInView is true, the user has clicked on an item in the view this frame.
    // We can assume node == selectedNode. We want to open both the root of the element JSON, which
    // will have index == -1, as well as the individual element.  This also will close nodes that
    // did not match that criteria, thus highlighting the selected element.
    if (didSelectNodeInView) {
      ImGui::SetNextItemOpen(index == selectedElementIndex || index == -1);
    }
  }

  const String nodeId = format("%s_%s", node.id().c_str(), key.c_str());
  if (ImGui::TreeNodeEx(nodeId.c_str(), nodeFlags, "%s", key.c_str())) {
    TreeMap<int, std::pair<String, nlohmann::json>> jsonMap;
    int i = 0;
    // (nathan): this was the only way I was able to find to get a key() from both an array and
    // object.  I could not get the iterator to also provide the key nor was I able to get the type
    // of the iterator (object vs array)
    for (const auto &el : json.items()) {
      jsonMap[i] = std::make_pair(el.key(), el.value());
      ++i;
    }

    layoutGrouping(
      node,
      0,
      static_cast<int>(json.size()),
      jsonMap,
      isElementMetadata,
      didSelectNodeInView,
      selectedElementIndex);
    ImGui::TreePop();
  }
}

}  // namespace c8
