// Copyright (c) 2021 8th Wall, Inc.
// Original Author: Paris Morgan (paris@8thwall.com)
//
// Color palette for use in Omniscope.

#pragma once

#include "c8/color.h"
namespace c8 {
class ColorPalette {
public:
  ColorPalette(
    Color RECENT_GROUND,
    Color TENURED_GROUND,
    Color RECENT_TRIANGULATED,
    Color TENURED_TRIANGULATED,
    Color RECENT_SKY,
    Color TENURED_SKY,
    Color RECENT_DEPTH,
    Color TENURED_DEPTH,
    Color CLOUD,
    Color UNDEAD,
    Color MATCHED_GROUND,
    Color MATCHED_TRIANGULATED,
    Color MATCHED_SKY,
    Color MATCHED_DEPTH,
    Color MATCHED_CLOUD,
    Color UNMATCHED)
      : RECENT_GROUND_(RECENT_GROUND),
        TENURED_GROUND_(TENURED_GROUND),
        RECENT_TRIANGULATED_(RECENT_TRIANGULATED),
        TENURED_TRIANGULATED_(TENURED_TRIANGULATED),
        RECENT_SKY_(RECENT_SKY),
        TENURED_SKY_(TENURED_SKY),
        RECENT_DEPTH_(RECENT_DEPTH),
        TENURED_DEPTH_(TENURED_DEPTH),
        CLOUD_(CLOUD),
        UNDEAD_(UNDEAD),
        MATCHED_GROUND_(MATCHED_GROUND),
        MATCHED_TRIANGULATED_(MATCHED_TRIANGULATED),
        MATCHED_SKY_(MATCHED_SKY),
        MATCHED_DEPTH_(MATCHED_DEPTH),
        MATCHED_CLOUD_(MATCHED_CLOUD),
        UNMATCHED_(UNMATCHED) {}

  static const ColorPalette defaultPalette();
  static const ColorPalette lightPalette();
  static const ColorPalette darkPalette();

  const Color RECENT_GROUND() const { return RECENT_GROUND_; }
  const Color TENURED_GROUND() const { return TENURED_GROUND_; }
  const Color RECENT_TRIANGULATED() const { return RECENT_TRIANGULATED_; }
  const Color TENURED_TRIANGULATED() const { return TENURED_TRIANGULATED_; }
  const Color RECENT_SKY() const { return RECENT_SKY_; }
  const Color TENURED_SKY() const { return TENURED_SKY_; }
  const Color RECENT_DEPTH() const { return RECENT_DEPTH_; }
  const Color TENURED_DEPTH() const { return TENURED_DEPTH_; }
  const Color CLOUD() const { return CLOUD_; }
  const Color UNDEAD() const { return UNDEAD_; }

  const Color MATCHED_GROUND() const { return MATCHED_GROUND_; }
  const Color MATCHED_TRIANGULATED() const { return MATCHED_TRIANGULATED_; }
  const Color MATCHED_SKY() const { return MATCHED_SKY_; }
  const Color MATCHED_DEPTH() const { return MATCHED_DEPTH_; }
  const Color MATCHED_CLOUD() const { return MATCHED_CLOUD_; }

  const Color UNMATCHED() const { return UNMATCHED_; }

private:
  const Color RECENT_GROUND_;
  const Color TENURED_GROUND_;
  const Color RECENT_TRIANGULATED_;
  const Color TENURED_TRIANGULATED_;
  const Color RECENT_SKY_;
  const Color TENURED_SKY_;
  const Color RECENT_DEPTH_;
  const Color TENURED_DEPTH_;
  const Color CLOUD_;
  const Color UNDEAD_;

  const Color MATCHED_GROUND_;
  const Color MATCHED_TRIANGULATED_;
  const Color MATCHED_SKY_;
  const Color MATCHED_DEPTH_;
  const Color MATCHED_CLOUD_;

  const Color UNMATCHED_;
};
}  // namespace c8
