// Copyright (c) 2025 8th Wall, Inc.
// Original Author: Lucas Reyna (lucas@8thwall.com)

#include "c8/html-shell/android/android-helpers.h"

#include <sys/system_properties.h>

namespace c8 {

String getUserAgent() {
  char version[PROP_VALUE_MAX] = {0};
  char codename[PROP_VALUE_MAX] = {0};
  char model[PROP_VALUE_MAX] = {0};

  if (__system_property_get("ro.build.version.release", version) <= 0) {
    strncpy(version, "unknown", PROP_VALUE_MAX - 1);
  }
  if (__system_property_get("ro.build.version.codename", codename) <= 0) {
    strncpy(codename, "unknown", PROP_VALUE_MAX - 1);
  }
  if (__system_property_get("ro.product.model", model) <= 0) {
    strncpy(model, "unknown", PROP_VALUE_MAX - 1);
  }

  char userAgent[256] = {0};
  snprintf(
    userAgent,
    sizeof(userAgent),
    "Mozilla/5.0 (Linux; Android %s; %s; %s)",
    version,
    model,
    codename);

  return String(userAgent);
}
}  // namespace c8
