// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#pragma once

#include "c8/pixels/pixels.h"
#include "c8/string.h"

namespace c8 {

class CodeGenerator {
public:
  // Default constructor.
  CodeGenerator() = default;

  // Default move constructors.
  CodeGenerator(CodeGenerator &&) = default;
  CodeGenerator &operator=(CodeGenerator &&) = default;

  // Disallow copying.
  CodeGenerator(const CodeGenerator &) = delete;
  CodeGenerator &operator=(const CodeGenerator &) = delete;

  static void generateQrCode(const String &text, YPlanePixels output);

private:
};

}  // namespace c8
