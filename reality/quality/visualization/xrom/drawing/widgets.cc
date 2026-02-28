// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "widgets.h",
  };
  deps = {
    ":components",
    "//c8:color",
    "//c8:hpoint",
    "//c8:map",
    "//c8:string",
    "//c8:vector",
    "//reality/quality/visualization/xrom/api:xrom-components.capnp-cc",
    "//reality/quality/visualization/xrom/framework:xrom-client-interface",
  };
}
cc_end(0x76d15a2f);

#include "reality/quality/visualization/xrom/drawing/widgets.h"

#include "c8/hpoint.h"
#include "c8/map.h"
#include "c8/color.h"
#include "c8/vector.h"
#include "reality/quality/visualization/xrom/drawing/components.h"

namespace c8 {

void drawCompass(XromClientInterface *client, String userKey, String parentKey, float height) {
  Vector<String> colors{
    "green", "darkred", "blue", "darkblue", "darkyellow", "yellow", "red", "purple"};

  TreeMap<String, Color> colorMap{
    {"green", Color::GREEN},
    {"darkred", Color::DARK_RED},
    {"blue", Color::BLUE},
    {"darkblue", Color::DARK_BLUE},
    {"darkyellow", Color::DARK_YELLOW},
    {"yellow", Color::YELLOW},
    {"red", Color::RED},
    {"purple", Color::PURPLE},
  };

  TreeMap<String, Vector<HPoint3>> compassPoints;
  for (int x = -7; x <= 7; ++x) {
    for (int z = -7; z <= 7; ++z) {
      HPoint3 pt(static_cast<float>(x), height, static_cast<float>(z));
      if (x < 0 && z < 0) {
        // bottom left: green: 106, 168, 79
        compassPoints[colors[0]].push_back(pt);
      } else if (x == 0 && z < 0) {
        // back: dark red: 151, 26, 0
        compassPoints[colors[1]].push_back(pt);
      } else if (x > 0 && z < 0) {
        // bottom right: blue: 109, 158, 235
        compassPoints[colors[2]].push_back(pt);
      } else if (x < 0 && z == 0) {
        // left: dark blue: 29, 11, 226
        compassPoints[colors[3]].push_back(pt);
      } else if (x > 0 && z == 0) {
        // right: dark yellow: 212, 148, 21
        compassPoints[colors[4]].push_back(pt);
      } else if (x < 0 && z > 0) {
        // top left: yellow: 255, 217, 102
        compassPoints[colors[5]].push_back(pt);
      } else if (x > 0 && z > 0) {
        // top right: red: 204, 65, 37
        compassPoints[colors[6]].push_back(pt);
      } else {
        // front: purple: 138, 0, 203
        compassPoints[colors[7]].push_back(pt);
      }
    }
  }

  for (const auto &colorSpec : colors) {
    client->update(
      setPointSet(userKey + colorSpec, parentKey, compassPoints[colorSpec], colorMap[colorSpec]));
  }
}


}
