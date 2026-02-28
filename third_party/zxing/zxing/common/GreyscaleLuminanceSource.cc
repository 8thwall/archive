// -*- mode:c++; tab-width:2; indent-tabs-mode:nil; c-basic-offset:2 -*-
/*
 *  GreyscaleLuminanceSource.cpp
 *  zxing
 *
 *  Copyright 2010 ZXing authors All rights reserved.
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
    "GreyscaleLuminanceSource.h",
  };
  deps = {
    ":IllegalArgumentException",
    "//third_party/zxing/zxing:LuminanceSource",
  };
  copts = {
    "-fexceptions",
  };
}
cc_end(0x76cb9af0);

#include "third_party/zxing/zxing/common/GreyscaleLuminanceSource.h"
#include "third_party/zxing/zxing/common/IllegalArgumentException.h"

using zxing::Ref;
using zxing::ArrayRef;
using zxing::LuminanceSource;
using zxing::GreyscaleLuminanceSource;
using zxing::GreyscaleRotatedLuminanceSource;

GreyscaleLuminanceSource::
GreyscaleLuminanceSource(ArrayRef<char> greyData,
                         int dataWidth, int dataHeight,
                         int left, int top,
                         int width, int height)
    : Super(width, height),
      greyData_(greyData),
      dataWidth_(dataWidth), dataHeight_(dataHeight),
      left_(left), top_(top) {

  if (left + width > dataWidth || top + height > dataHeight || top < 0 || left < 0) {
    throw IllegalArgumentException("Crop rectangle does not fit within image data.");
  }
}

ArrayRef<char> GreyscaleLuminanceSource::getRow(int y, ArrayRef<char> row) const {
  if (y < 0 || y >= this->getHeight()) {
    throw IllegalArgumentException("Requested row is outside the image.");
  }
  int width = getWidth();
  if (!row || row->size() < width) {
    ArrayRef<char> temp (width);
    row = temp;
  }
  int offset = (y + top_) * dataWidth_ + left_;
  memcpy(&row[0], &greyData_[offset], width);
  return row;
}

ArrayRef<char> GreyscaleLuminanceSource::getMatrix() const {
  int size = getWidth() * getHeight();
  ArrayRef<char> result (size);
  if (left_ == 0 && top_ == 0 && dataWidth_ == getWidth() && dataHeight_ == getHeight()) {
    memcpy(&result[0], &greyData_[0], size);
  } else {
    for (int row = 0; row < getHeight(); row++) {
      memcpy(&result[row * getWidth()], &greyData_[(top_ + row) * dataWidth_ + left_], getWidth());
    }
  }
  return result;
}

Ref<LuminanceSource> GreyscaleLuminanceSource::crop(int left, int top, int width, int height) const {
  return Ref<LuminanceSource>(new GreyscaleLuminanceSource(greyData_, dataWidth_, dataHeight_, left, top, width, height));
}

Ref<LuminanceSource> GreyscaleLuminanceSource::rotateCounterClockwise() const {
  // Intentionally flip the left, top, width, and height arguments as
  // needed. dataWidth and dataHeight are always kept unrotated.
  Ref<LuminanceSource> result (
      new GreyscaleRotatedLuminanceSource(greyData_,
                                          dataWidth_, dataHeight_,
                                          top_, left_, getHeight(), getWidth()));
  return result;
}


// Note that dataWidth and dataHeight are not reversed, as we need to
// be able to traverse the greyData correctly, which does not get
// rotated.
GreyscaleRotatedLuminanceSource::
GreyscaleRotatedLuminanceSource(ArrayRef<char> greyData,
                                int dataWidth, int dataHeight,
                                int left, int top,
                                int width, int height)
    : Super(width, height),
      greyData_(greyData),
      dataWidth_(dataWidth),
      left_(left), top_(top) {
  // Intentionally comparing to the opposite dimension since we're rotated.
  if (left + width > dataHeight || top + height > dataWidth) {
    throw IllegalArgumentException("Crop rectangle does not fit within image data.");
  }
}

// The API asks for rows, but we're rotated, so we return columns.
ArrayRef<char>
GreyscaleRotatedLuminanceSource::getRow(int y, ArrayRef<char> row) const {
  if (y < 0 || y >= getHeight()) {
    throw IllegalArgumentException("Requested row is outside the image.");
  }
  if (!row || row->size() < getWidth()) {
    row = ArrayRef<char>(getWidth());
  }
  int offset = (left_ * dataWidth_) + (dataWidth_ - 1 - (y + top_));
  using namespace std;
  if (false) {
    cerr << offset << " = "
         << top_ << " " << left_ << " "
         << getHeight() << " " << getWidth() << " "
         << y << endl;
  }
  for (int x = 0; x < getWidth(); x++) {
    row[x] = greyData_[offset];
    offset += dataWidth_;
  }
  return row;
}

ArrayRef<char> GreyscaleRotatedLuminanceSource::getMatrix() const {
  ArrayRef<char> result (getWidth() * getHeight());
  for (int y = 0; y < getHeight(); y++) {
    char* row = &result[y * getWidth()];
    int offset = (left_ * dataWidth_) + (dataWidth_ - 1 - (y + top_));
    for (int x = 0; x < getWidth(); x++) {
      row[x] = greyData_[offset];
      offset += dataWidth_;
    }
  }
  return result;
}
