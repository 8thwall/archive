// -*- mode:c++; tab-width:2; indent-tabs-mode:nil; c-basic-offset:2 -*-
/*
 *  QRCodeReader.cpp
 *  zxing
 *
 *  Created by Christian Brunschen on 20/05/2008.
 *  Copyright 2008 ZXing authors All rights reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

#include "bzl/inliner/rules2.h"
cc_library {
  hdrs = {
    "QRCodeReader.h",
  };
  deps = {
    "//third_party/zxing/zxing:DecodeHints",
    "//third_party/zxing/zxing:Reader",
    "//third_party/zxing/zxing/qrcode/decoder:Decoder",
    "//third_party/zxing/zxing/qrcode/detector:Detector",
  };
  visibility = {
    "//c8/qr:__subpackages__",
    "//third_party/zxing:__subpackages__",
  };
  copts = {
    "-fexceptions",
  };
}
cc_end(0x5b34ff14);

#include "third_party/zxing/zxing/qrcode/QRCodeReader.h"
#include "third_party/zxing/zxing/qrcode/detector/Detector.h"

#include <iostream>

namespace zxing {
  namespace qrcode {

    using namespace std;

    QRCodeReader::QRCodeReader() :decoder_() {
    }
    //TODO: see if any of the other files in the qrcode tree need tryHarder
    Ref<Result> QRCodeReader::decode(Ref<BinaryBitmap> image, DecodeHints hints) {

      Detector detector(image->getBlackMatrix());
      Ref<DetectorResult> detectorResult(detector.detect(hints));
      if (!detectorResult) {
        return Ref<Result>();
      }

      ArrayRef< Ref<ResultPoint> > points (detectorResult->getPoints());
      Ref<DecoderResult> decoderResult(decoder_.decode(detectorResult->getBits()));
      Ref<Result> result(
                 new Result(decoderResult->getText(), decoderResult->getRawBytes(), points, BarcodeFormat::QR_CODE));
      return result;
    }

    QRCodeReader::~QRCodeReader() {
    }

    Decoder& QRCodeReader::getDecoder() {
        return decoder_;
    }
  }
}
