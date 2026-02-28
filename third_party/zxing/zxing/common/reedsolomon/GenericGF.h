// -*- mode:c++; tab-width:2; indent-tabs-mode:nil; c-basic-offset:2 -*-
/*
 *  GenericGF.h
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

#ifndef GENERICGF_H
#define GENERICGF_H

#include <vector>
#include "third_party/zxing/zxing/common/Array.h"
#include "third_party/zxing/zxing/common/Counted.h"

namespace zxing {
  class GenericGFPoly;

  class GenericGF : public Counted {

  private:
    std::vector<int> expTable;
    std::vector<int> logTable;
    Ref<GenericGFPoly> zero;
    Ref<GenericGFPoly> one;
    int size;
    int primitive;
    int generatorBase;
    bool initialized;

    void initialize();
    void checkInit();

  public:
    static Ref<GenericGF> AZTEC_DATA_12;
    static Ref<GenericGF> AZTEC_DATA_10;
    static Ref<GenericGF> AZTEC_DATA_8;
    static Ref<GenericGF> AZTEC_DATA_6;
    static Ref<GenericGF> AZTEC_PARAM;
    static Ref<GenericGF> QR_CODE_FIELD_256;
    static Ref<GenericGF> DATA_MATRIX_FIELD_256;
    static Ref<GenericGF> MAXICODE_FIELD_64;

    GenericGF(int primitive, int size, int b);

    Ref<GenericGFPoly> getZero();
    Ref<GenericGFPoly> getOne();
    int getSize();
    int getGeneratorBase();
    Ref<GenericGFPoly> buildMonomial(int degree, int coefficient);

    static int addOrSubtract(int a, int b);
    int exp(int a);
    int log(int a);
    int inverse(int a);
    int multiply(int a, int b);
  };

class GenericGFPoly : public Counted {
private:
  GenericGF &field_;
  ArrayRef<int> coefficients_;

public:
  GenericGFPoly(GenericGF &field, ArrayRef<int> coefficients);
  ArrayRef<int> getCoefficients();
  int getDegree();
  bool isZero();
  int getCoefficient(int degree);
  int evaluateAt(int a);
  Ref<GenericGFPoly> addOrSubtract(Ref<GenericGFPoly> other);
  Ref<GenericGFPoly> multiply(Ref<GenericGFPoly> other);
  Ref<GenericGFPoly> multiply(int scalar);
  Ref<GenericGFPoly> multiplyByMonomial(int degree, int coefficient);
  std::vector<Ref<GenericGFPoly> > divide(Ref<GenericGFPoly> other);


};

}

#endif //GENERICGF_H

