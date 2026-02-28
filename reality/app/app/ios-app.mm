// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)
//
// Objective-C implementation of iOS app context provider.

#import <UIKit/UIKit.h>

#include "reality/app/app/ios-app.h"

namespace c8 {

void exportAppContext(AppContext::Builder appContextBuilder) {
  // Unity's definition of LandscapeLeft and LandscapeRight are inverted to Apple's definition.
  switch ([[UIApplication sharedApplication] statusBarOrientation]) {
    case UIInterfaceOrientationPortrait:
      appContextBuilder.setDeviceOrientation(AppContext::DeviceOrientation::PORTRAIT);
      break;
    case UIInterfaceOrientationLandscapeRight:
      appContextBuilder.setDeviceOrientation(AppContext::DeviceOrientation::LANDSCAPE_LEFT);
      break;
    case UIInterfaceOrientationPortraitUpsideDown:
      appContextBuilder.setDeviceOrientation(AppContext::DeviceOrientation::PORTRAIT_UPSIDE_DOWN);
      break;
    case UIInterfaceOrientationLandscapeLeft:
      appContextBuilder.setDeviceOrientation(AppContext::DeviceOrientation::LANDSCAPE_RIGHT);
      break;
    default:
      // Unspecified.
      break;
  }
}
}
