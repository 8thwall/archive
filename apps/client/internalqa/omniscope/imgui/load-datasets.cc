// Copyright (c) 2020 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  visibility = {
    "//visibility:public",
  };
  hdrs = {"load-datasets.h"};
  deps = {
    ":ui-config",
    "//c8:c8-log",
    "//c8:set",
    "//c8:string",
    "//c8:vector",
    "//third_party/imgui/icons:imgui-fontawesome",
  };
}
cc_end(0x5305ce4b);

#include <algorithm>
#include <filesystem>

#include "apps/client/internalqa/omniscope/imgui/load-datasets.h"
#include "c8/c8-log.h"

namespace c8 {

String defaultPath() { return std::filesystem::path(std::getenv("HOME")) / "datasets"; }

// Don't attempt to load files with these extensions.
TreeSet<String> ignoreExtensions = {
  ".swp",
  ".mp4",
  ".json",
  ".jpeg",
  ".jpg",
  ".png",
  ".txt",
  ".tgz",
  ".pcd",
  ".map8",
  ".mapslick",
  ".bin",
};

// std::filesystem considers ".DS_Store" to be a filename, not an extension, ignore it too.
TreeSet<String> ignoreNames = {
  ".DS_Store",
};

// Allow files with these names to load, regardless of extensions
TreeSet<String> allowNames = {
  "capture.json",
  "item_0.bin"
};

DatasetNode crawlPath(const String &pathStr, const TreeSet<String> &targetExtensions) {
  // Basic info for this node, not including children.
  std::filesystem::path nodePath(pathStr);
  DatasetNode node = {{}, std::filesystem::path(nodePath).filename(), nodePath, ICON_FA_FOLDER_O};

  // If not a directory, this is a leaf node, so return it without children.
  if (!std::filesystem::is_directory(nodePath)) {
    node.icon = ICON_FA_FILE;
    return node;
  }

  // This is a directory. Find the subfiles / subdirectories we want to process, keep them separate
  // for now so we can sort directories above files later.
  Vector<String> directories;
  Vector<String> files;
  for (auto &p : std::filesystem::directory_iterator(nodePath)) {
    if (p.is_directory()) {
      // Add subdirectories.
      directories.push_back(p.path());
    }
    if (p.is_regular_file()) {
      if (!targetExtensions.empty()) {
        if (targetExtensions.find(p.path().extension()) != targetExtensions.end()) {
          files.push_back(p.path());
        }
        // If searching by targetExtension, skip all other checks.
        continue;
      }
      // Always allow files with allowNames
      if (allowNames.find(p.path().filename()) != allowNames.end()) {
        files.push_back(p.path());
        continue;
      }
      // Exclude files with ignoreNames or ignoreExtensions.
      if (ignoreNames.find(p.path().filename()) != ignoreNames.end()) {
        continue;
      }
      if (ignoreExtensions.find(p.path().extension()) != ignoreExtensions.end()) {
        continue;
      }
      // Add regular files.
      files.push_back(p.path());
    }
  }

  // Sort the directory and file lists alphabetically.
  std::sort(directories.begin(), directories.end());
  std::sort(files.begin(), files.end());

  // Crawl all subdirectories, but if a subdirectory has no contents after crawing, don't add it.
  for (const auto &e : directories) {
    auto crawledDirectory = crawlPath(e, targetExtensions);
    if (!crawledDirectory.children.empty()) {
      node.children.emplace_back(new DatasetNode(std::move(crawledDirectory)));
    }
  }
  // Crawl all files under this directory.
  for (const auto &e : files) {
    node.children.emplace_back(new DatasetNode(crawlPath(e, targetExtensions)));
  }

  // Return the node.
  return node;
}

DatasetNode loadDatasets(UiConfig *config, bool mapsOnly) {
  // Get the path to crawl from the UI config, or fill in a default path if it's not set in the
  // config.
  auto cfg = config->get();
  if (cfg.datasetsPath.empty()) {
    cfg.datasetsPath = defaultPath();
    config->set(cfg);
  }

  DatasetNode rootNode;

  // Crawl the datasets directory, and if we find something, add it to the list.
  DatasetNode crawlNode;
  if (mapsOnly) {
    crawlNode = crawlPath(cfg.datasetsPath, {".map8", ".mapslick"});
  } else {
    crawlNode = crawlPath(cfg.datasetsPath);
  }
  if (!crawlNode.children.empty()) {
    rootNode.children.emplace_back(new DatasetNode(std::move(crawlNode)));
  }

  if (mapsOnly) {
    // Don't want "remote" and "recent" options for map selection
    return rootNode;
  }

  // Add "remote" as an option.
  rootNode.children.emplace_back(new DatasetNode({{}, "remote", "remote", ICON_FA_EXTERNAL_LINK}));

  // Add recent sources, if present.
  if (!cfg.recentSources.empty()) {
    DatasetNode recents = {{}, "recent", "recent", ICON_FA_HISTORY};
    for (const auto &recent : cfg.recentSources) {
      recents.children.emplace_back(
        new DatasetNode({{}, std::filesystem::path(recent).filename(), recent, ICON_FA_FILE_O}));
    }
    rootNode.children.emplace_back(new DatasetNode(std::move(recents)));
  }
  return rootNode;
}

Vector<String> filePaths(const DatasetNode *node) {
  if (node->children.empty()) {
    return {node->path};
  }

  Vector<String> res{};
  for (const auto &child : node->children) {
    for (const auto &filePath : filePaths(child.get())) {
      res.push_back(filePath);
    }
  }
  return res;
}

}  // namespace c8
