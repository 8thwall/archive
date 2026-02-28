// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "omniscope-plot.h",
  };
  deps = {
    "//c8/stats:histogram",
    ":omniscope-view",
    "//c8:c8-log",
    "//c8:string",
    "//c8:vector",
  };
  visibility = {
    "//apps/client/internalqa/omniscope:__subpackages__",
  };
}
cc_end(0x167c571f);

#include "apps/client/internalqa/omniscope/native/omniscope-plot.h"
#include "c8/c8-log.h"

namespace c8 {

void drawHistogram(const Vector<float> &data, SeriesPlot &seriesPlot, size_t numBins) {
  Histogram histogramData;

  if (seriesPlot.xAxis.limits.maxVal < seriesPlot.xAxis.limits.minVal) {
    computeHistogramMetadata(data, numBins, &histogramData);
  } else {
    histogramData.numBins = numBins;
    histogramData.maxVal = seriesPlot.xAxis.limits.maxVal;
    histogramData.minVal = seriesPlot.xAxis.limits.minVal;
  }

  computeHistogram(data, &histogramData);

  Vector<float> shiftedXs;
  shiftedXs.reserve(histogramData.binXs.size());
  std::transform(
    histogramData.binXs.begin(),
    histogramData.binXs.end(),
    std::back_inserter(shiftedXs),
    [&](float x) { return x + histogramData.binWidth * 0.5; });

  auto &plot = seriesPlot.dataPerLine[""];
  plot.xs = shiftedXs;
  plot.ys = histogramData.binYs;
  plot.type = SeriesPlotType::BAR;
  plot.barWidth = histogramData.binWidth;
}

}  // namespace c8
