// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Dat Chu (dat@8thwall.com)

#pragma once

#include "apps/client/internalqa/omniscope/native/omniscope-view.h"
#include "c8/stats/histogram.h"
#include "c8/vector.h"

namespace c8 {

void drawHistogram(const Vector<float> &data, SeriesPlot &seriesPlot, size_t numBins = 100);

}  // namespace c8
