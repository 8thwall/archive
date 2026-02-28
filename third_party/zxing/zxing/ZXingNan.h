// -*- mode:c++; tab-width:2; indent-tabs-mode:nil; c-basic-offset:2 -*-
/*
 *  Copyright 2013 ZXing authors All rights reserved.
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
#ifndef __ZXINGNAN_H_
#define __ZXINGNAN_H_

#include <limits>

#if defined(_WIN32) || defined(_WIN64)

#include <float.h>

namespace zxing {
inline bool isnan(float v) {return _isnan(v) != 0;}
inline bool isnan(double v) {return _isnan(v) != 0;}
inline float nan() {return std::numeric_limits<float>::quiet_NaN();}
}

#else

#include <cmath>

namespace zxing {
inline bool isnan(float v) {return ::std::isnan<float>(v);}
inline bool isnan(double v) {return ::std::isnan<double>(v);}
inline float nan() {return std::numeric_limits<float>::quiet_NaN();}
}

#endif

#endif
