// Copyright (c) 2024 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_library {
  visibility = {
    "//visibility:public",
  };
  hdrs = {
    "url-decode.h",
  };
  deps = {
    "//c8:string",
  };
}
cc_end(0x9afcb008);

#include <sstream>

#include "c8/url/url-decode.h"

namespace c8 {

String urlDecode(const String &encoded) {
  std::ostringstream decoded;
  for (size_t i = 0; i < encoded.length(); ++i) {
    if (encoded[i] == '%') {
      if (i + 2 < encoded.length() && isxdigit(encoded[i + 1]) && isxdigit(encoded[i + 2])) {
        // Convert hex digits following '%' to the original character
        std::string hex = encoded.substr(i + 1, 2);
        char character = static_cast<char>(std::stoi(hex, nullptr, 16));
        decoded << character;

        // Skip the next two characters as they were processed
        i += 2;
      } else {
        // Invalid encoding (e.g., incomplete hex sequence) - add '%' as-is
        decoded << '%';
      }
    } else {
      decoded << encoded[i];
    }
  }
  return String(decoded.str());
}

}  // namespace c8
