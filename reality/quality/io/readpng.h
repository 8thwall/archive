// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include "c8/pixels/pixel-buffer.h"
#include "c8/string.h"

namespace c8 {

RGBA8888PlanePixelBuffer readPng(const String &filename);
void writePng(const String &filename, ConstRGBA8888PlanePixels pixels);

}  // namespace c8
