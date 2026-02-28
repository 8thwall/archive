// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "code-generator.h",
  };
  deps = {
    "//c8:string",
    "//c8/pixels:pixels",
    "@qrcodegen//:qrcodegen",
  };
}
cc_end(0x4df71d59);

#include <QrCode.hpp>

#include "c8/qr/code-generator.h"

using namespace c8;

namespace {

void setPixelBytes(OneChannelPixels p, uint8_t val) {
  for (int i = 0; i < p.rows(); ++i) {
    for (int j = 0; j < p.cols(); ++j) {
      p.pixels()[i * p.rowBytes() + j] = val;
    }
  }
}

void drawQrCode(const qrcodegen::QrCode &qr, YPlanePixels im) {
  int border = 4;
  int boxes = qr.getSize() + border * 2;
  for (int y = -border; y < qr.getSize() + border; y++) {
    int startr = (y + border) * im.rows() / boxes;
    int endr = (y + border + 1) * im.rows() / boxes;
    for (int x = -border; x < qr.getSize() + border; x++) {
      int startc = (x + border) * im.cols() / boxes;
      int endc = (x + border + 1) * im.cols() / boxes;
      bool filled = qr.getModule(x, y);
      YPlanePixels box(
        endr - startr, endc - startc, im.rowBytes(), im.pixels() + startr * im.rowBytes() + startc);
      setPixelBytes(box, filled ? 0 : 255);
    }
  }
}

}  // namespace

void CodeGenerator::generateQrCode(const String &text, YPlanePixels output) {
  auto qr = qrcodegen::QrCode::encodeText(text.c_str(), qrcodegen::QrCode::Ecc::MEDIUM);
  drawQrCode(qr, output);
}
