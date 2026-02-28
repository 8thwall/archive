// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Alvin Portillo (alvin@8thwall.com)
//
// Controller class responsible for validating the mobile app key provided by the developer.

#pragma once

namespace c8 {

// Validates the mobile app key provided by the developer. Any key known to be invalid
// will crash the application. A missing key, valid key, or key whose validity cannot be
// determined will allow the application to continue normally.
void c8ValidationController_validateApplication(const char * mobileAppKey);

}  // namespace c8
