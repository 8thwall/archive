// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Alvin Portillo (alvin@8thwall.com)
//
// Objective-C implementation of iOS device information provider.

#import <AVFoundation/AVFoundation.h>
#import <UIKit/UIKit.h>
#import <sys/utsname.h>

#include "reality/app/device/ios-device-info.h"

@interface DeviceInfoImpl : NSObject

- (const char *)getDeviceModel;

- (const char *)getDeviceOsVersion;

@end

@implementation DeviceInfoImpl

- (const char *)getDeviceModel {
  struct utsname systemInfo;
  uname(&systemInfo);

  // TODO(alvin): Map model identifier to a more understandable iPhone model(e.g. iPhone7S).
  NSString *device = [NSString stringWithCString:systemInfo.machine encoding:NSUTF8StringEncoding];
  return [device UTF8String];
}

- (const char *)getDeviceOsVersion {
  NSString *osVersion = [[UIDevice currentDevice] systemVersion];
  return [osVersion UTF8String];
}

@end

void c8::c8_exportDeviceInfo(c8::DeviceInfo::Builder &infoBuilder) {
  DeviceInfoImpl *impl = [[DeviceInfoImpl alloc] init];
  infoBuilder.setModel([impl getDeviceModel]);
  infoBuilder.setManufacturer("Apple");
  infoBuilder.setOs("iOS");
  infoBuilder.setOsVersion([impl getDeviceOsVersion]);
}
