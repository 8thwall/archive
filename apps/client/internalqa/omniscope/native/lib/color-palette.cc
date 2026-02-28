// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "color-palette.h",
  };
  deps = {
    "//c8:color",
  };
  visibility = {
    "//apps/client/internalqa/omniscope:__subpackages__",
  };
}
cc_end(0x79b80d75);

#include "apps/client/internalqa/omniscope/native/lib/color-palette.h"

namespace c8 {

const ColorPalette ColorPalette::defaultPalette() {
  return ColorPalette(
    Color::MATCHA,       // RECENT_GROUND
    Color::GREEN,        // TENURED_GROUND
    Color::BLUE,         // RECENT_TRIANGULATED
    Color::DULL_BLUE,    // TENURED_TRIANGULATED
    Color::CHERRY,       // RECENT_SKY
    Color::RED,          // TENURED_SKY
    Color::MANGO,        // RECENT_DEPTH
    Color::MINT,         // TENURED_DEPTH
    Color::DARK_YELLOW,  // CLOUD
    Color::WHITE,        // UNDEAD
    Color::DARK_MATCHA,  // MATCHED_GROUND
    Color::BLUE,         // MATCHED_TRIANGULATED
    Color::DULL_PINK,    // MATCHED_SKY
    Color::DULL_PURPLE,  // MATCHED_DEPTH
    Color::ORANGE,       // MATCHED_CLOUD
    Color::GRAY_04);     // UNMATCHED
}

const ColorPalette ColorPalette::lightPalette() {
  return ColorPalette(
    Color::gradient(Color::MATCHA, Color::WHITE, 0.3f),       // RECENT_GROUND
    Color::gradient(Color::GREEN, Color::WHITE, 0.3f),        // TENURED_GROUND
    Color::gradient(Color::BLUE, Color::WHITE, 0.3f),         // RECENT_TRIANGULATED
    Color::gradient(Color::DULL_BLUE, Color::WHITE, 0.3f),    // TENURED_TRIANGULATED
    Color::gradient(Color::CHERRY, Color::WHITE, 0.3f),       // RECENT_SKY
    Color::gradient(Color::RED, Color::WHITE, 0.3f),          // TENURED_SKY
    Color::gradient(Color::MANGO, Color::WHITE, 0.3f),        // RECENT_DEPTH
    Color::gradient(Color::MINT, Color::WHITE, 0.3f),         // TENURED_DEPTH
    Color::gradient(Color::DARK_YELLOW, Color::WHITE, 0.3f),  // CLOUD
    Color::gradient(Color::WHITE, Color::WHITE, 3.6f),        // UNDEAD
    Color::gradient(Color::DARK_MATCHA, Color::WHITE, 0.3f),  // MATCHED_GROUND
    Color::gradient(Color::BLUE, Color::WHITE, 0.3f),         // MATCHED_TRIANGULATED
    Color::gradient(Color::DULL_PINK, Color::WHITE, 0.3f),    // MATCHED_SKY
    Color::gradient(Color::DULL_PURPLE, Color::WHITE, 0.3f),  // MATCHED_DEPTH
    Color::gradient(Color::ORANGE, Color::WHITE, 0.3f),       // MATCHED_CLOUD
    Color::gradient(Color::GRAY_04, Color::WHITE, 0.3f));     // UNMATCHED
}

const ColorPalette ColorPalette::darkPalette() {
  return ColorPalette(
    Color::gradient(Color::MATCHA, Color::BLACK, 0.6f),       // RECENT_GROUND
    Color::gradient(Color::GREEN, Color::BLACK, 0.6f),        // TENURED_GROUND
    Color::gradient(Color::BLUE, Color::BLACK, 0.6f),         // RECENT_TRIANGULATED
    Color::gradient(Color::DULL_BLUE, Color::BLACK, 0.6f),    // TENURED_TRIANGULATED
    Color::gradient(Color::CHERRY, Color::BLACK, 0.6f),       // RECENT_SKY
    Color::gradient(Color::RED, Color::BLACK, 0.6f),          // TENURED_SKY
    Color::gradient(Color::MANGO, Color::BLACK, 0.6f),        // RECENT_DEPTH
    Color::gradient(Color::MINT, Color::BLACK, 0.6f),         // TENURED_DEPTH
    Color::gradient(Color::DARK_YELLOW, Color::BLACK, 0.6f),  // CLOUD
    Color::gradient(Color::WHITE, Color::BLACK, 0.6f),        // UNDEAD
    Color::gradient(Color::DARK_MATCHA, Color::BLACK, 0.6f),  // MATCHED_GROUND
    Color::gradient(Color::BLUE, Color::BLACK, 0.6f),         // MATCHED_TRIANGULATED
    Color::gradient(Color::DULL_PINK, Color::BLACK, 0.6f),    // MATCHED_SKY
    Color::gradient(Color::DULL_PURPLE, Color::BLACK, 0.6f),  // MATCHED_DEPTH
    Color::gradient(Color::ORANGE, Color::BLACK, 0.6f),       // MATCHED_CLOUD
    Color::gradient(Color::GRAY_04, Color::BLACK, 0.6f));     // UNMATCHED
}
}  // namespace c8
