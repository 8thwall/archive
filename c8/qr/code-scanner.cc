// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  deps = {
    "//c8:c8-log",
    "//c8:hpoint",
    "//c8:string",
    "//c8:vector",
    "//c8/pixels:pixels",
    "//third_party/zxing/zxing:Binarizer",
    "//third_party/zxing/zxing:BinaryBitmap",
    "//third_party/zxing/zxing:DecodeHints",
    "//third_party/zxing/zxing:Exception",
    "//third_party/zxing/zxing:BinaryBitmap",
    "//third_party/zxing/zxing:ReaderException",
    "//third_party/zxing/zxing:Result",
    "//third_party/zxing/zxing/common:Counted",
    "//third_party/zxing/zxing/common:GlobalHistogramBinarizer",
    "//third_party/zxing/zxing/common:IllegalArgumentException",
    "//third_party/zxing/zxing/qrcode:QRCodeReader",
  };
  hdrs = {
    "code-scanner.h",
  };
  copts = {
    "-fexceptions",
  };
}
cc_end(0xa3940d2e);

#include "c8/qr/code-scanner.h"

#include "third_party/zxing/zxing/Binarizer.h"
#include "third_party/zxing/zxing/BinaryBitmap.h"
#include "third_party/zxing/zxing/DecodeHints.h"
#include "third_party/zxing/zxing/Exception.h"
#include "third_party/zxing/zxing/ReaderException.h"
#include "third_party/zxing/zxing/Result.h"
#include "third_party/zxing/zxing/common/Counted.h"
#include "third_party/zxing/zxing/common/GlobalHistogramBinarizer.h"
#include "third_party/zxing/zxing/common/IllegalArgumentException.h"
#include "third_party/zxing/zxing/qrcode/QRCodeReader.h"
#include "c8/c8-log.h"

using namespace c8;

namespace {

class PixelSource : public zxing::LuminanceSource {
private:
  ConstYPlanePixels y_;
  PixelSource(ConstYPlanePixels y) : zxing::LuminanceSource(y.cols(), y.rows()), y_(y) {}

public:
  static zxing::Ref<zxing::LuminanceSource> create(ConstYPlanePixels y) {
    return zxing::Ref<LuminanceSource>(new PixelSource(y));
  }

  zxing::ArrayRef<char> getRow(int r, zxing::ArrayRef<char> row) const override {
    // Allocate row if it doesn't yet exist.
    if (!row) {
      row = zxing::ArrayRef<char>(getWidth());
    }

    // Copy a scanline into the output row.
    std::memcpy(&row[0], y_.pixels() + r * y_.rowBytes(), getWidth());

    return row;
  }

  zxing::ArrayRef<char> getMatrix() const override {
    // Get width and height
    int rows = getHeight();
    int cols = getWidth();

    // Create matrix
    zxing::ArrayRef<char> matrix = zxing::ArrayRef<char>(rows * cols);

    const auto *src = y_.pixels();
    auto *dest = &matrix[0];

    for (int r = 0; r < rows; ++r) {
      std::memcpy(dest, src, cols);
      dest += cols;
      src += y_.rowBytes();
    }

    return matrix;
  }
};

}  // namespace

ScanResult CodeScanner::scanQrCode(ConstYPlanePixels y) {
  zxing::Ref<zxing::Reader> reader(new zxing::qrcode::QRCodeReader());
  auto source = PixelSource::create(y);
  try {
    zxing::Ref<zxing::Binarizer> binarizer(new zxing::GlobalHistogramBinarizer(source));
    zxing::Ref<zxing::BinaryBitmap> bitmap(new zxing::BinaryBitmap(binarizer));
    zxing::Ref<zxing::Result> result(
      reader->decode(bitmap, zxing::DecodeHints(zxing::DecodeHints::TRYHARDER_HINT)));

    // zxing communicates not-found by throwing an excception, so at this point we have a result.
    ScanResult r;
    if (!result) {
      return r;
    }
    r.found = true;
    r.text = result->getText()->getText();
    for (auto pt : result->getResultPoints()->values()) {
      r.pts.emplace_back(pt->getX(), pt->getY());
    }
    return r;
  } catch (const zxing::ReaderException &e) {
    C8Log("[ReaderException] %s (ignoring)", e.what());
  } catch (const zxing::IllegalArgumentException &e) {
    C8Log("[IllegalArgumentException] %s (ignoring)", e.what());
  } catch (const zxing::Exception &e) {
    C8Log("[Exception] %s (ignoring)", e.what());
  } catch (const std::exception &e) {
    C8Log("[std::exception] %s (ignoring)", e.what());
  }
  // Not found.
  return ScanResult();
}
