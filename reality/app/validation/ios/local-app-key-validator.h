// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Alvin Portillo (alvin@8thwall.com)
//
// Utility class to provide client-side validation of mobile app keys.

#pragma once

#import <AVFoundation/AVFoundation.h>

#include "reality/app/validation/ios/app-key-status-user-defaults.h"

@interface LocalAppKeyValidator : NSObject

@property(nonatomic, strong) AppKeyStatusStorageUserDefaults *keyStorage_;

- (bool)validateAppKey:(const char *)appKey;

@end
