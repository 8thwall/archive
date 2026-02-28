// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Alvin Portilo (alvin@8thwall.com)
//
// Implementation of {@link AppKeyStatusStorage} using {@link NSUserDefaults}. Will
// keep a key status as valid for 15 minutes before marking it as invalid.

#import <AVFoundation/AVFoundation.h>

#include "c8/c8-log.h"
#include "reality/app/validation/ios/app-key-status-user-defaults.h"

using namespace c8;

static constexpr double TIME_TO_EXPIRE_MS = 1000 * 60 * 15;  // 15min in milliseconds
static constexpr NSString *STATUS_KEY_SUFFIX = @"_status";
static constexpr NSString *EXPIRATION_KEY_SUFFIX = @"_expiration";

@implementation AppKeyStatusStorageUserDefaults

- (AppLogRecordHeader::MobileAppKeyStatus)getStatusForKey:(NSString *)appKey {
  NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];

  NSString *expirationKey = [self createUserDefaultsKeyForStatusExpirationFromAppKey:appKey];
  NSString *statusKey = [self createUserDefaultsKeyForStatusFromAppKey:appKey];

  double expirationTimeMs = [userDefaults doubleForKey:expirationKey];
  double currentTimeMs = [[NSDate date] timeIntervalSince1970];

  if (expirationTimeMs == 0.0) {
    // Entry does not already exist.
    return AppLogRecordHeader::MobileAppKeyStatus::UNKNOWN;
  } else if (currentTimeMs > expirationTimeMs) {
    // Entry has expired. Remove it so it is no longer used.
    [userDefaults removeObjectForKey:expirationKey];
    [userDefaults removeObjectForKey:statusKey];
    return AppLogRecordHeader::MobileAppKeyStatus::UNKNOWN;
  }

  NSInteger statusValue = [userDefaults integerForKey:statusKey];
  return [self getStatusFromInt:statusValue];
}

- (NSString *)createUserDefaultsKeyForStatusFromAppKey:(NSString *)appKey {
  return [appKey stringByAppendingString:STATUS_KEY_SUFFIX];
}

- (NSString *)createUserDefaultsKeyForStatusExpirationFromAppKey:(NSString *)appKey {
  return [appKey stringByAppendingString:EXPIRATION_KEY_SUFFIX];
}

- (AppLogRecordHeader::MobileAppKeyStatus)getStatusFromInt:(NSInteger)statusValue {
  if (statusValue == static_cast<int>(AppLogRecordHeader::MobileAppKeyStatus::SERVER_VALID)) {
    return AppLogRecordHeader::MobileAppKeyStatus::SERVER_VALID;
  } else if (
    statusValue == static_cast<int>(AppLogRecordHeader::MobileAppKeyStatus::SERVER_INVALID)) {
    return AppLogRecordHeader::MobileAppKeyStatus::SERVER_INVALID;
  } else if (statusValue == static_cast<int>(AppLogRecordHeader::MobileAppKeyStatus::MISSING)) {
    return AppLogRecordHeader::MobileAppKeyStatus::MISSING;
  } else {
    return AppLogRecordHeader::MobileAppKeyStatus::UNKNOWN;
  }
}

- (void)setStatus:(AppLogRecordHeader::MobileAppKeyStatus)status forAppKey:(NSString *)appKey {
  NSString *expirationKey = [self createUserDefaultsKeyForStatusExpirationFromAppKey:appKey];
  NSString *statusKey = [self createUserDefaultsKeyForStatusFromAppKey:appKey];
  double currentTimeMs = [[NSDate date] timeIntervalSince1970];
  double expirationTimeMs = currentTimeMs + TIME_TO_EXPIRE_MS;

  NSUserDefaults *userDefaults = [NSUserDefaults standardUserDefaults];
  [userDefaults setDouble:expirationTimeMs forKey:expirationKey];
  [userDefaults setInteger:static_cast<int>(status) forKey:statusKey];
}

@end
