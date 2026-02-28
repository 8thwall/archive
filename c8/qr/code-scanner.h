// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include "c8/hpoint.h"
#include "c8/pixels/pixels.h"
#include "c8/vector.h"

namespace c8 {

struct ScanResult {
  bool found = false;
  Vector<HPoint2> pts;
  String text = "";
};

class CodeScanner {
public:
  // Default constructor.
  CodeScanner() = default;

  // Default move constructors.
  CodeScanner(CodeScanner &&) = default;
  CodeScanner &operator=(CodeScanner &&) = default;

  // Disallow copying.
  CodeScanner(const CodeScanner &) = delete;
  CodeScanner &operator=(const CodeScanner &) = delete;

  ScanResult scanQrCode(ConstYPlanePixels y);
};

}  // namespace c8
