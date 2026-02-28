// -*- mode:c++; tab-width:2; indent-tabs-mode:nil; c-basic-offset:2 -*-
/*
 *  Copyright 2010 ZXing authors. All rights reserved.
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
    "Counted.h",
  };
  deps = {
  };
  visibility = {
    "//visibility:public",
  };
  copts = {
    "-fexceptions",
  };
}
cc_end(0x1f11e978);

#include "third_party/zxing/zxing/common/Counted.h"

int64_t zxing::Counted::globalObjects = 0;
int64_t zxing::Counted::globalNew = 0;
int64_t zxing::Counted::globalDelete = 0;

int64_t zxing::Counted::globalCount = 0;
int64_t zxing::Counted::globalRetainCount = 0;
int64_t zxing::Counted::globalReleaseCount = 0;
