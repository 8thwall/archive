#pragma once

#if defined(WIN32) || defined(_WIN32)
#ifndef WIN32_LEAN_AND_MEAN
#define WIN32_LEAN_AND_MEAN
#endif

#pragma push_macro("ERROR")
#undef ERROR
#pragma push_macro("VOID")
#undef VOID
#pragma push_macro("INTERFACE")
#undef INTERFACE
#pragma push_macro("min")
#undef min
#pragma push_macro("max")
#undef max
#else
#endif

#include "reality/quality/visualization/xrom/api/xrom.capnp.h"

namespace c8 {

class XromCallback {
public:
  virtual void processUpdate(UpdateXromRequest::Reader request) = 0;
};

}

#if defined(WIN32) || defined(_WIN32)
#pragma pop_macro("ERROR")
#pragma pop_macro("VOID")
#pragma pop_macro("INTERFACE")
#pragma pop_macro("min")
#pragma pop_macro("max")
#endif
