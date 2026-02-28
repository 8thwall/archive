// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include "c8/pixels/pixels.h"
#include "c8/string.h"
#include "c8/vector.h"

namespace c8 {

struct Ui2Click {
  enum class Type {
    UNSPECIFIED_TYPE = 0,
    PRIMARY_CLICK = 1,
    SECONDARY_CLICK = 2,
  };
  Type type;
  int x;
  int y;
};

void show(const String &windowName, ConstRGBA8888PlanePixels im);

void show(const String &windowName, ConstRGB888PlanePixels im);

void show(const String &windowName, ConstYPlanePixels im);

void show(const String &windowName, OneChannelPixels im);

int waitKey(int keyValue = 10);

Vector<Ui2Click> clicksOnWindow(const String &windowName);

}  // namespace c8
