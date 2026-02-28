// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Alvin Portilo (alvin@8thwall.com)
//
// Interface for managing the status of mobile app keys.

#pragma once

#import <AVFoundation/AVFoundation.h>

#include "c8/protolog/api/log-request.capnp.h"

// Caches mobile app key statuses using {@link NSUserDefaults}. Will
// keep a key status as valid for 15 minutes before marking it as invalid.
@interface AppKeyStatusStorageUserDefaults : NSObject

/**
 * Retrieves the status of the given app key. If a status does not already exist,
 * {@link AppKeyStatus::UNKNOWN} will be returned.
 */
- (c8::AppLogRecordHeader::MobileAppKeyStatus)getStatusForKey:(NSString *)appKey;

/**
 * Sets the status for the given app key.
 */
- (void)setStatus:(c8::AppLogRecordHeader::MobileAppKeyStatus)status forAppKey:(NSString *)appKey;

@end
