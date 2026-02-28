// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"layout-logging-summary.h"};
  deps = {
    "//c8:map",
    "//c8:string",
    "//c8/stats:latency-summarizer",
    "//c8/stats:logging-summaries",
    "//c8/string:format",
    "@imgui//:imgui",
  };
}
cc_end(0x32218912);

#include <imgui.h>

#include "apps/client/internalqa/omniscope/imgui/layout-logging-summary.h"
#include "c8/stats/latency-summarizer.h"
#include "c8/string/format.h"

namespace c8 {

enum SummaryEventType {
  UNSPECIFIED,
  LATENCY,
  COUNT,
  RATIO,
};

// Converts a value in the range [0, 100] to a shade of red.
ImU32 valToImGuiColor(float val) {
  val = std::min(100.f, std::max(0.f, val));
  val = std::sqrt(val / 100.f);
  return ImGui::GetColorU32(ImVec4(val, 0.f, 0.f, 1.f));
}

// Gets a quantile string from an event summary.
String getQuantileString(const EventSummary::Reader &event) {
  if (hasLatency(event)) {
    auto q50 = latencyQuantile(.5f, event) * 1e-3f;
    auto q90 = latencyQuantile(.9f, event) * 1e-3f;
    auto q99 = latencyQuantile(.99f, event) * 1e-3f;
    return format("%.3f / %.3f / %.3f", q50, q90, q99);
  }
  if (hasCounter(event)) {
    auto q50 = counterQuantile(.5f, event);
    auto q90 = counterQuantile(.9f, event);
    auto q99 = counterQuantile(.99f, event);
    return format("%.1f / %.1f / %.1f", q50, q90, q99);
  }
  if (hasRatio(event)) {
    return format("%.3f", 100.f * ratioMean(event));
  }
  return "";
}

// Extracts the type and value from an event summary.
void eventSummaryData(const EventSummary::Reader &event, float *value, SummaryEventType *type) {
  if (hasLatency(event)) {
    *value = latencyMean(event) * 1e-3f;
    *type = SummaryEventType::LATENCY;
  } else if (hasCounter(event)) {
    *value = counterMean(event);
    *type = SummaryEventType::COUNT;
  } else if (hasRatio(event)) {
    *value = 100.f * ratioMean(event);
    *type = SummaryEventType::RATIO;
  } else {
    *value = 0.f;
    *type = SummaryEventType::UNSPECIFIED;
  }
}

// TODO(paris): Investigate turning this into a tree structure.
// TODO(paris): Better split & format data into columns.
// TODO(paris): Map of path -> parentPath & topParentPath would prevent constant string splitting.
// TODO(paris): Investigate histogram we want for counters.
void layoutLoggingSummary(LoggingSummary::Reader summary) {
  TreeMap<String, float> pathToLatency;
  TreeMap<String, int> pathToEvents;
  const ImGuiTableFlags flags = ImGuiTableFlags_Resizable | ImGuiTableFlags_BordersInner;
  if (ImGui::BeginTable("Logging Summary", 7, flags)) {
    ImGui::TableSetupColumn("Summary");
    ImGui::TableSetupColumn("Type");
    ImGui::TableSetupColumn("Total %");
    ImGui::TableSetupColumn("Total % in Event");
    ImGui::TableSetupColumn("Event %");
    ImGui::TableSetupColumn("50% / 90% / 99%");
    ImGui::TableSetupColumn("Latency PDF");
    ImGui::TableHeadersRow();

    for (auto event : summary.getEvents()) {
      String path = event.getEventName().cStr();
      float value;
      SummaryEventType type;
      eventSummaryData(event, &value, &type);

      // Get shortname and parent paths. Examples:
      // - '/xr-engine/features/gr8gl' -> name: 'gr8gl', parentPath: '/xr-engine/features',
      //     topParentPath: '/xr-engine'
      // - '/xr-engine' -> name: 'xr-engine', parentPath: '', topParentPath: '/xr-engine'
      auto lastToken = path.rfind("/");
      auto firstToken = path.find("/", 1);  // exclude the very first slash
      auto name = path.substr(lastToken + 1, path.size());
      auto parentPath = path.substr(0, lastToken);
      auto topParentPath = path.substr(0, firstToken);

      float totalPercentage = -1.f;
      float totalPercentageInEvent = -1.f;
      float eventPercentage = -1.f;
      if (type == SummaryEventType::LATENCY) {
        pathToLatency[path] = value;
        pathToEvents[path] = event.getEventCount();
        if (!parentPath.empty()) {
          totalPercentage = (pathToLatency[path] * pathToEvents[path])
            / (pathToLatency[topParentPath] * pathToEvents[topParentPath]) * 100.f;
          totalPercentageInEvent = (pathToLatency[path] * pathToEvents[path])
            / (pathToLatency[parentPath] * pathToEvents[parentPath]) * 100.f;
          eventPercentage = pathToLatency[path] / pathToLatency[topParentPath] * 100.f;
        }
      }

      ImGui::TableNextRow();
      ImGui::PushStyleVar(ImGuiStyleVar_FramePadding, ImVec2(0, 0));
      // Summary
      ImGui::TableNextColumn();
      ImGui::Text("%s", LatencySummarizer::briefSummaryForEvent(event).c_str());
      // Type
      ImGui::TableNextColumn();
      ImGui::Text("%d", type);
      // Total %
      ImGui::TableNextColumn();
      if (type == SummaryEventType::LATENCY) {
        ImGui::TableSetBgColor(ImGuiTableBgTarget_CellBg, valToImGuiColor(totalPercentage));
        ImGui::Text("%.3f", totalPercentage);
      }
      // Total % in Event
      ImGui::TableNextColumn();
      if (type == SummaryEventType::LATENCY) {
        ImGui::TableSetBgColor(ImGuiTableBgTarget_CellBg, valToImGuiColor(totalPercentageInEvent));
        ImGui::Text("%.3f", totalPercentageInEvent);
      }
      // Event %
      ImGui::TableNextColumn();
      if (type == SummaryEventType::LATENCY) {
        ImGui::TableSetBgColor(ImGuiTableBgTarget_CellBg, valToImGuiColor(eventPercentage));
        ImGui::Text("%.3f", eventPercentage);
      }
      // 50% / 90% / 99%
      ImGui::TableNextColumn();
      ImGui::Text("%s", getQuantileString(event).c_str());
      // Latency PDF
      ImGui::TableNextColumn();
      if (type == SummaryEventType::LATENCY) {
        Vector<uint64_t> binStart;
        Vector<uint64_t> count;
        extractPDF(event.getLatencyMicros(), &binStart, &count);
        Vector<float> countF;
        for (const auto &c : count) {
          countF.push_back(static_cast<float>(c));
        }
        ImGui::PlotHistogram("", countF.data(), countF.size());
      }
      ImGui::PopStyleVar();
    }
    ImGui::EndTable();
  }
}

}  // namespace c8
