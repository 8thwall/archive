// -*- mode:c++; tab-width:2; indent-tabs-mode:nil; c-basic-offset:2 -*-
/*
 *  GenericGF.cpp
 *  zxing
 *
 *  Created by Lukas Stabe on 13/02/2012.
 *  Copyright 2012 ZXing authors All rights reserved.
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
    "GenericGF.h",
  };
  deps = {
    "//third_party/zxing/zxing/common:Array",
    "//third_party/zxing/zxing/common:Counted",
    "//third_party/zxing/zxing/common:IllegalArgumentException",
  };
  copts = {
    "-fexceptions",
  };
}
cc_end(0x19d864db);

#include <iostream>
#include "third_party/zxing/zxing/common/reedsolomon/GenericGF.h"
#include "third_party/zxing/zxing/common/IllegalArgumentException.h"

using zxing::ArrayRef;
using zxing::GenericGF;
using zxing::GenericGFPoly;
using zxing::Ref;

Ref<GenericGF> GenericGF::AZTEC_DATA_12(new GenericGF(0x1069, 4096, 1));
Ref<GenericGF> GenericGF::AZTEC_DATA_10(new GenericGF(0x409, 1024, 1));
Ref<GenericGF> GenericGF::AZTEC_DATA_6(new GenericGF(0x43, 64, 1));
Ref<GenericGF> GenericGF::AZTEC_PARAM(new GenericGF(0x13, 16, 1));
Ref<GenericGF> GenericGF::QR_CODE_FIELD_256(new GenericGF(0x011D, 256, 0));
Ref<GenericGF> GenericGF::DATA_MATRIX_FIELD_256(new GenericGF(0x012D, 256, 1));
Ref<GenericGF> GenericGF::AZTEC_DATA_8 = DATA_MATRIX_FIELD_256;
Ref<GenericGF> GenericGF::MAXICODE_FIELD_64 = AZTEC_DATA_6;

namespace {
  int INITIALIZATION_THRESHOLD = 0;
}

GenericGF::GenericGF(int primitive_, int size_, int b)
  : size(size_), primitive(primitive_), generatorBase(b), initialized(false) {
  if (size <= INITIALIZATION_THRESHOLD) {
    initialize();
  }
}

void GenericGF::initialize() {
  expTable.resize(size);
  logTable.resize(size);

  int x = 1;

  for (int i = 0; i < size; i++) {
    expTable[i] = x;
    x <<= 1; // x = x * 2; we're assuming the generator alpha is 2
    if (x >= size) {
      x ^= primitive;
      x &= size-1;
    }
  }
  for (int i = 0; i < size-1; i++) {
    logTable[expTable[i]] = i;
  }
  //logTable[0] == 0 but this should never be used
  zero =
    Ref<GenericGFPoly>(new GenericGFPoly(*this, ArrayRef<int>(new Array<int>(1))));
  zero->getCoefficients()[0] = 0;
  one =
    Ref<GenericGFPoly>(new GenericGFPoly(*this, ArrayRef<int>(new Array<int>(1))));
  one->getCoefficients()[0] = 1;
  initialized = true;
}

void GenericGF::checkInit() {
  if (!initialized) {
    initialize();
  }
}

Ref<GenericGFPoly> GenericGF::getZero() {
  checkInit();
  return zero;
}

Ref<GenericGFPoly> GenericGF::getOne() {
  checkInit();
  return one;
}

Ref<GenericGFPoly> GenericGF::buildMonomial(int degree, int coefficient) {
  checkInit();

  if (degree < 0) {
    throw IllegalArgumentException("Degree must be non-negative");
  }
  if (coefficient == 0) {
    return zero;
  }
  ArrayRef<int> coefficients(new Array<int>(degree + 1));
  coefficients[0] = coefficient;

  return Ref<GenericGFPoly>(new GenericGFPoly(*this, coefficients));
}

int GenericGF::addOrSubtract(int a, int b) {
  return a ^ b;
}

int GenericGF::exp(int a) {
  checkInit();
  return expTable[a];
}

int GenericGF::log(int a) {
  checkInit();
  if (a == 0) {
    throw IllegalArgumentException("cannot give log(0)");
  }
  return logTable[a];
}

int GenericGF::inverse(int a) {
  checkInit();
  if (a == 0) {
    throw IllegalArgumentException("Cannot calculate the inverse of 0");
  }
  return expTable[size - logTable[a] - 1];
}

int GenericGF::multiply(int a, int b) {
  checkInit();

  if (a == 0 || b == 0) {
    return 0;
  }

  return expTable[(logTable[a] + logTable[b]) % (size - 1)];
  }

int GenericGF::getSize() {
  return size;
}

int GenericGF::getGeneratorBase() {
  return generatorBase;
}

GenericGFPoly::GenericGFPoly(GenericGF &field,
                             ArrayRef<int> coefficients)
  :  field_(field) {
  if (coefficients->size() == 0) {
    throw IllegalArgumentException("need coefficients");
  }
  int coefficientsLength = coefficients->size();
  if (coefficientsLength > 1 && coefficients[0] == 0) {
    // Leading term must be non-zero for anything except the constant polynomial "0"
    int firstNonZero = 1;
    while (firstNonZero < coefficientsLength && coefficients[firstNonZero] == 0) {
      firstNonZero++;
    }
    if (firstNonZero == coefficientsLength) {
      coefficients_ = field.getZero()->getCoefficients();
    } else {
      coefficients_ = ArrayRef<int>(new Array<int>(coefficientsLength-firstNonZero));
      for (int i = 0; i < (int)coefficients_->size(); i++) {
        coefficients_[i] = coefficients[i + firstNonZero];
      }
    }
  } else {
    coefficients_ = coefficients;
  }
}

ArrayRef<int> GenericGFPoly::getCoefficients() {
  return coefficients_;
}

int GenericGFPoly::getDegree() {
  return coefficients_->size() - 1;
}

bool GenericGFPoly::isZero() {
  return coefficients_[0] == 0;
}

int GenericGFPoly::getCoefficient(int degree) {
  return coefficients_[coefficients_->size() - 1 - degree];
}

int GenericGFPoly::evaluateAt(int a) {
  if (a == 0) {
    // Just return the x^0 coefficient
    return getCoefficient(0);
  }

  int size = coefficients_->size();
  if (a == 1) {
    // Just the sum of the coefficients
    int result = 0;
    for (int i = 0; i < size; i++) {
      result = GenericGF::addOrSubtract(result, coefficients_[i]);
    }
    return result;
  }
  int result = coefficients_[0];
  for (int i = 1; i < size; i++) {
    result = GenericGF::addOrSubtract(field_.multiply(a, result), coefficients_[i]);
  }
  return result;
}

Ref<GenericGFPoly> GenericGFPoly::addOrSubtract(Ref<zxing::GenericGFPoly> other) {
  if (!(&field_ == &other->field_)) {
    throw IllegalArgumentException("GenericGFPolys do not have same GenericGF field");
  }
  if (isZero()) {
    return other;
  }
  if (other->isZero()) {
    return Ref<GenericGFPoly>(this);
  }

  ArrayRef<int> smallerCoefficients = coefficients_;
  ArrayRef<int> largerCoefficients = other->getCoefficients();
  if (smallerCoefficients->size() > largerCoefficients->size()) {
    ArrayRef<int> temp = smallerCoefficients;
    smallerCoefficients = largerCoefficients;
    largerCoefficients = temp;
  }

  ArrayRef<int> sumDiff(new Array<int>(largerCoefficients->size()));
  int lengthDiff = largerCoefficients->size() - smallerCoefficients->size();
  // Copy high-order terms only found in higher-degree polynomial's coefficients
  for (int i = 0; i < lengthDiff; i++) {
    sumDiff[i] = largerCoefficients[i];
  }

  for (int i = lengthDiff; i < (int)largerCoefficients->size(); i++) {
    sumDiff[i] = GenericGF::addOrSubtract(smallerCoefficients[i-lengthDiff],
                                          largerCoefficients[i]);
  }

  return Ref<GenericGFPoly>(new GenericGFPoly(field_, sumDiff));
}

Ref<GenericGFPoly> GenericGFPoly::multiply(Ref<zxing::GenericGFPoly> other) {
  if (!(&field_ == &other->field_)) {
    throw IllegalArgumentException("GenericGFPolys do not have same GenericGF field");
  }

  if (isZero() || other->isZero()) {
    return field_.getZero();
  }

  ArrayRef<int> aCoefficients = coefficients_;
  int aLength = aCoefficients->size();

  ArrayRef<int> bCoefficients = other->getCoefficients();
  int bLength = bCoefficients->size();

  ArrayRef<int> product(new Array<int>(aLength + bLength - 1));
  for (int i = 0; i < aLength; i++) {
    int aCoeff = aCoefficients[i];
    for (int j = 0; j < bLength; j++) {
      product[i+j] = GenericGF::addOrSubtract(product[i+j],
                                              field_.multiply(aCoeff, bCoefficients[j]));
    }
  }

  return Ref<GenericGFPoly>(new GenericGFPoly(field_, product));
}

Ref<GenericGFPoly> GenericGFPoly::multiply(int scalar) {
  if (scalar == 0) {
    return field_.getZero();
  }
  if (scalar == 1) {
    return Ref<GenericGFPoly>(this);
  }
  int size = coefficients_->size();
  ArrayRef<int> product(new Array<int>(size));
  for (int i = 0; i < size; i++) {
    product[i] = field_.multiply(coefficients_[i], scalar);
  }
  return Ref<GenericGFPoly>(new GenericGFPoly(field_, product));
}

Ref<GenericGFPoly> GenericGFPoly::multiplyByMonomial(int degree, int coefficient) {
  if (degree < 0) {
    throw IllegalArgumentException("degree must not be less then 0");
  }
  if (coefficient == 0) {
    return field_.getZero();
  }
  int size = coefficients_->size();
  ArrayRef<int> product(new Array<int>(size+degree));
  for (int i = 0; i < size; i++) {
    product[i] = field_.multiply(coefficients_[i], coefficient);
  }
  return Ref<GenericGFPoly>(new GenericGFPoly(field_, product));
}

std::vector<Ref<GenericGFPoly> > GenericGFPoly::divide(Ref<GenericGFPoly> other) {
  if (!(&field_ == &other->field_)) {
    throw IllegalArgumentException("GenericGFPolys do not have same GenericGF field");
  }
  if (other->isZero()) {
    throw IllegalArgumentException("divide by 0");
  }

  Ref<GenericGFPoly> quotient = field_.getZero();
  Ref<GenericGFPoly> remainder = Ref<GenericGFPoly>(this);

  int denominatorLeadingTerm = other->getCoefficient(other->getDegree());
  int inverseDenominatorLeadingTerm = field_.inverse(denominatorLeadingTerm);

  while (remainder->getDegree() >= other->getDegree() && !remainder->isZero()) {
    int degreeDifference = remainder->getDegree() - other->getDegree();
    int scale = field_.multiply(remainder->getCoefficient(remainder->getDegree()),
                                inverseDenominatorLeadingTerm);
    Ref<GenericGFPoly> term = other->multiplyByMonomial(degreeDifference, scale);
    Ref<GenericGFPoly> iterationQuotiont = field_.buildMonomial(degreeDifference,
                                                                scale);
    quotient = quotient->addOrSubtract(iterationQuotiont);
    remainder = remainder->addOrSubtract(term);
  }

  std::vector<Ref<GenericGFPoly> > returnValue(2);
  returnValue[0] = quotient;
  returnValue[1] = remainder;
  return returnValue;
}
