// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "c8/string.h"
#include "reality/quality/visualization/xrom/api/xrom-components.capnp.h"
#include "reality/quality/visualization/xrom/framework/xrom-client-interface.h"

#pragma once

namespace c8 {

void drawCompass(XromClientInterface *client, String userKey, String parentUserKey, float height);

}  // namespace c8
