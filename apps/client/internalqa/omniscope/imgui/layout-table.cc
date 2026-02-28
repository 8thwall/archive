// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"layout-table.h"};
  deps = {
    ":layout-formatting",
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//c8:string",
    "@imgui//:imgui",
  };
}
cc_end(0x3b263704);

#include <imgui.h>

#include "apps/client/internalqa/omniscope/imgui/layout-formatting.h"
#include "apps/client/internalqa/omniscope/imgui/layout-table.h"

namespace c8 {

void layoutTable(const String &windowName, const Table &table) {
  if (!ImGui::Begin(windowName.c_str())) {
    ImGui::End();
    return;
  }

  int numCols = table.columns.size();
  ImGui::BeginTable(
    "table",
    table.columns.size() + 1,
    ImGuiTableFlags_SizingStretchProp | ImGuiTableFlags_Resizable);
  ImGui::TableSetupScrollFreeze(0, 1);

  // Print the headers
  ImGui::TableHeadersRow();
  ImGui::TableSetColumnIndex(0);
  ImGui::Text("(%lu rows)", table.dataPerRow.size());
  for (int i = 0; i < numCols; i++) {
    // the first column is empty since it is always ID
    ImGui::TableSetColumnIndex(i + 1);
    ImGui::Text("%s", table.columns.at(i).c_str());
  }

  // Print the table content in sorted row ID
  for (const auto &[rowName, rowData] : table.dataPerRow) {
    ImGui::TableNextRow();
    if (rowData.size() < numCols) {
      C8Log("[omniscope-layout-thread] Line %s has less than %d columns", rowName.c_str(), numCols);
    }
    // The first column is the row id
    ImGui::TableSetColumnIndex(0);
    ImGui::Text("%s", rowName.c_str());
    // NOTE(dat): we are only printing as much data is available per row
    for (int i = 0; i < rowData.size(); i++) {
      ImGui::TableSetColumnIndex(i + 1);
      const auto &datum = rowData[i];

      if (table.highlights.count(rowName) > 0) {
        ImGui::TextColored(toImColor(table.highlights.at(rowName)), "%s", datum.c_str());
      } else {
        ImGui::Text("%s", datum.c_str());
      }
    }
  }
  ImGui::EndTable();
  ImGui::End();
}
}  // namespace c8
