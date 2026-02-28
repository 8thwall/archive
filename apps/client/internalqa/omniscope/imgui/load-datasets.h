// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include <memory>

#include "apps/client/internalqa/omniscope/imgui/ui-config.h"
#include "c8/set.h"
#include "c8/string.h"
#include "c8/vector.h"
#include "third_party/imgui/icons/IconsFontAwesome4.h"

namespace c8 {

struct DatasetNode {
  Vector<std::unique_ptr<DatasetNode>> children;
  String name;
  String path;
  String icon = " ";
};

// Returns the '~/datasets' folder path.
String defaultPath();

DatasetNode loadDatasets(UiConfig *config, bool mapsOnly = false);

// Crawl one directory / file (recursively) and build a tree structure of DatasetNodes.
DatasetNode crawlPath(const String &pathStr, const TreeSet<String> &targetExtensions = {});

// Returns all the file paths in the Tree.
Vector<String> filePaths(const DatasetNode *node);

}  // namespace c8
