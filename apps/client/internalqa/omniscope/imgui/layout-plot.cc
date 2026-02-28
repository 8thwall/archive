// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {"layout-plot.h"};
  deps = {
    ":layout-formatting",
    "//apps/client/internalqa/omniscope/native:omniscope-view",
    "//c8:string",
    "@imgui//:imgui",
    "@implot//:implot",
  };
}
cc_end(0x28c1d806);

#include <imgui.h>

#include "apps/client/internalqa/omniscope/imgui/layout-formatting.h"
#include "apps/client/internalqa/omniscope/imgui/layout-plot.h"
#include "implot.h"
#include "implot_internal.h"

namespace c8 {

namespace {
struct AxisLimits {
  float xMin = std::numeric_limits<float>::max();
  float xMax = std::numeric_limits<float>::lowest();
  float yMin = std::numeric_limits<float>::max();
  float yMax = std::numeric_limits<float>::lowest();

  bool operator==(const AxisLimits &b) {
    return xMin == b.xMin && yMin == b.yMin && xMax == b.xMax && yMax == b.yMax;
  }

  bool operator!=(const AxisLimits &b) { return !(*this == b); }

  AxisLimits merge(const AxisLimits &b) {
    return {
      std::min(xMin, b.xMin),
      std::max(xMax, b.xMax),
      std::min(yMin, b.yMin),
      std::max(yMax, b.yMax),
    };
  }
};

AxisLimits axisLimits(const PlotSeries &p) {
  if (p.xs.empty() || p.ys.empty()) {
    return {};
  }
  return {
    *std::min_element(p.xs.begin(), p.xs.end()),
    *std::max_element(p.xs.begin(), p.xs.end()),
    *std::min_element(p.ys.begin(), p.ys.end()),
    *std::max_element(p.ys.begin(), p.ys.end()),
  };
}

AxisLimits axisLimits(const SeriesPlot &p) {
  AxisLimits l;
  for (const auto &e : p.dataPerLine) {
    l = l.merge(axisLimits(e.second));
  }
  return l;
}

bool hasAxisLimit(const Axis &a) { return a.limits.maxVal > a.limits.minVal; }

ImPlotMarker toImPlotMarker(const SeriesPlotMarker &marker) {
  switch (marker) {
    case SeriesPlotMarker::NONE:
      return ImPlotMarker_None;
    case SeriesPlotMarker::CIRCLE:
      return ImPlotMarker_Circle;
    case SeriesPlotMarker::SQUARE:
      return ImPlotMarker_Square;
    case SeriesPlotMarker::DIAMOND:
      return ImPlotMarker_Diamond;
    case SeriesPlotMarker::CROSS:
      return ImPlotMarker_Cross;
    case SeriesPlotMarker::PLUS:
      return ImPlotMarker_Plus;
    case SeriesPlotMarker::ASTERISK:
      return ImPlotMarker_Asterisk;
  }
  return ImPlotMarker_None;
}

ImPlotLocation toImPlotLocation(const PlotLocation &plotLocation) {
  switch (plotLocation) {
    case PlotLocation::CENTER:
      return ImPlotLocation_Center;
    case PlotLocation::N:
      return ImPlotLocation_North;
    case PlotLocation::S:
      return ImPlotLocation_South;
    case PlotLocation::W:
      return ImPlotLocation_West;
    case PlotLocation::E:
      return ImPlotLocation_East;
    case PlotLocation::NW:
      return ImPlotLocation_NorthWest;
    case PlotLocation::NE:
      return ImPlotLocation_NorthEast;
    case PlotLocation::SW:
      return ImPlotLocation_SouthWest;
    case PlotLocation::SE:
      return ImPlotLocation_SouthEast;
  }
  return ImPlotLocation_Center;
}
}  // namespace

void layoutPlot(const String &windowName, const SeriesPlot &seriesPlot) {
  if (!ImGui::Begin(windowName.c_str())) {
    ImGui::End();
    return;
  }
  // NOTE(paris): If you use default with lmb pan then you drag the window out of the dock.
  ImPlot::MapInputReverse(&ImPlot::GetInputMap());

  // Set the axis limit
  bool fitX = true;
  bool fitY = true;
  if (hasAxisLimit(seriesPlot.xAxis)) {
    ImPlot::SetNextAxisLimits(
      ImAxis_X1, seriesPlot.xAxis.limits.minVal, seriesPlot.xAxis.limits.maxVal);
    fitX = false;
  }

  if (hasAxisLimit(seriesPlot.yAxis)) {
    ImPlot::SetNextAxisLimits(
      ImAxis_Y1, seriesPlot.yAxis.limits.minVal, seriesPlot.yAxis.limits.maxVal);
    fitY = false;
  }

  // Check whether chart data has changed for this window, and if so, re-fit the plot to snap to the
  // new data. Otherwise, if the user changes the chart position, keep the user's selected position.
  auto l = axisLimits(seriesPlot);
  static TreeMap<String, AxisLimits> limitMap;
  auto &limitsForWindow = limitMap[windowName];
  if (l != limitsForWindow) {
    limitsForWindow = l;
    if (fitX) {
      ImPlot::SetNextAxisToFit(ImAxis_X1);
    }
    if (fitY) {
      ImPlot::SetNextAxisToFit(ImAxis_Y1);
      ImPlot::SetNextAxisToFit(ImAxis_Y2);
      ImPlot::SetNextAxisToFit(ImAxis_Y3);
    }
  }

  // Time to do the actual plotting
  String error = "";
  if (ImPlot::BeginPlot(seriesPlot.title.c_str(), {-1, -1})) {
    // Set plot axes and legends
    ImPlot::SetupAxes(seriesPlot.xAxis.name.c_str(), seriesPlot.yAxis.name.c_str());
    ImPlot::SetupLegend(toImPlotLocation(seriesPlot.legendLocation));

    // Drawing normal lines
    for (const auto &[lineName, plotSeries] : seriesPlot.dataPerLine) {
      if (
        plotSeries.xs.empty() || plotSeries.ys.empty()
        || plotSeries.xs.size() != plotSeries.ys.size()) {
        error += format(
          "Skipping series %s because it has %lu xs and %lu ys.\n",
          lineName.c_str(),
          plotSeries.xs.size(),
          plotSeries.ys.size());
        continue;
      }

      // Set the color if a non-zero-alpha color is set.
      auto c = plotSeries.color;
      if (c.a() != 0) {
        // If the color has alpha, set its legend item to be alpha-less.
        if (ImPlot::BeginItem(lineName.c_str())) {
          ImPlot::GetCurrentItem()->Color = ImGui::GetColorU32(toImColor(c.alpha(255)));
          ImPlot::EndItem();
        }
        // Color the next line to be the full color with alpha.
        ImPlot::SetNextLineStyle(toImColor(c));
      }

      // Set the marker.
      ImPlot::SetNextMarkerStyle(toImPlotMarker(plotSeries.marker), 2.f);

      // Optionally hide the plot.
      if (plotSeries.startHidden) {
        ImPlot::HideNextItem();
      }

      // Draw depending on the series type.
      auto seriesType = plotSeries.type;
      if (seriesType == SeriesPlotType::LINE) {
        ImPlot::PlotLine(
          lineName.c_str(), plotSeries.xs.data(), plotSeries.ys.data(), plotSeries.xs.size());
      } else if (seriesType == SeriesPlotType::SCATTER) {
        ImPlot::PlotScatter(
          lineName.c_str(), plotSeries.xs.data(), plotSeries.ys.data(), plotSeries.xs.size());
      } else if (seriesType == SeriesPlotType::BAR) {
        ImPlot::PlotBars(
          lineName.c_str(),
          plotSeries.xs.data(),
          plotSeries.ys.data(),
          plotSeries.xs.size(),
          plotSeries.barWidth);
      } else if (seriesType == SeriesPlotType::STEM) {
        ImPlot::PlotStems(
          lineName.c_str(), plotSeries.xs.data(), plotSeries.ys.data(), plotSeries.xs.size());
      }
    }

    // Drawing vertical lines
    for (const auto &[lineName, vLine] : seriesPlot.vLines) {
      ImPlot::PlotVLines(lineName.c_str(), vLine.data.data(), vLine.data.size());
    }

    // Drawing horizontal lines
    for (const auto &[lineName, hLine] : seriesPlot.hLines) {
      ImPlot::PlotHLines(lineName.c_str(), hLine.data.data(), hLine.data.size());
    }

    // Drawing annotations
    for (const auto &[name, annotation] : seriesPlot.annotations) {
      ImPlot::Annotation(
        annotation.x,
        annotation.y,
        ImPlot::GetLastItemColor(),
        {annotation.shiftX, annotation.shiftY},
        true,  // clamp to the plot
        "%s",
        annotation.text.c_str());
    }

    ImPlot::EndPlot();
    if (!error.empty()) {
      ImGui::Text("%s", error.c_str());
    }
    if (!seriesPlot.description.empty()) {
      ImGui::Text("%s", seriesPlot.description.c_str());
    }
    if (hasAxisLimit(seriesPlot.xAxis)) {
      ImGui::Text(
        "X-axis limit to %f %f", seriesPlot.xAxis.limits.minVal, seriesPlot.xAxis.limits.maxVal);
    }
    if (hasAxisLimit(seriesPlot.yAxis)) {
      ImGui::Text(
        "Y-axis limit to %f %f", seriesPlot.yAxis.limits.minVal, seriesPlot.yAxis.limits.maxVal);
    }
  }
  ImGui::End();
}
}  // namespace c8
