// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Alvin Portillo (alvin@8thwall.com)
//
// Utility class to provide client-side validation of mobile app keys.

#import <AVFoundation/AVFoundation.h>
#import <CommonCrypto/CommonDigest.h>

#include <string.h>
#include "c8/c8-log.h"
#include "c8/io/base-x-encoding.h"
#include "c8/protolog/api/log-request.capnp.h"
#include "c8/vector.h"
#include "reality/app/validation/ios/app-key-status-user-defaults.h"
#include "reality/app/validation/ios/local-app-key-validator.h"

using namespace c8;

@implementation LocalAppKeyValidator

- (id)init {
  if (!(self = [super init])) {
    return nil;
  }
  self.keyStorage_ = [[AppKeyStatusStorageUserDefaults alloc] init];
  return self;
}

- (bool)hasInvalidChecksum:(NSString *)appKey forBundleId:(NSString *)bundleId {
  BaseXEncoding base62("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
  auto appKeyCStr = [appKey UTF8String];
  auto bundleIdCStr = [bundleId UTF8String];
  auto decodedBytes = base62.decode(appKeyCStr);

  if (decodedBytes->size() < CC_SHA1_DIGEST_LENGTH) {
    // Decoded size isn't even as large as the expected checksum.
    return YES;
  }

  Vector<uint8_t> decodedKey(decodedBytes->begin(), decodedBytes->end() - CC_SHA1_DIGEST_LENGTH);
  Vector<uint8_t> decodedChecksum(decodedBytes->end() - CC_SHA1_DIGEST_LENGTH, decodedBytes->end());
  uint8_t digest[CC_SHA1_DIGEST_LENGTH];

  CC_SHA1_CTX sha1Ctx;
  CC_SHA1_Init(&sha1Ctx);
  CC_SHA1_Update(&sha1Ctx, decodedKey.data(), static_cast<unsigned int>(decodedKey.size()));
  CC_SHA1_Update(&sha1Ctx, bundleIdCStr, static_cast<unsigned int>(strlen(bundleIdCStr)));
  CC_SHA1_Final(digest, &sha1Ctx);

  for (int i = 0; i < CC_SHA1_DIGEST_LENGTH; ++i) {
    if (digest[i] != decodedChecksum[i]) {
      return YES;
    }
  }

  return NO;
}

- (bool)validateAppKey:(const char *)appKey {
  NSString *nsAppKey = [NSString stringWithUTF8String:appKey];
  AppLogRecordHeader::MobileAppKeyStatus status = [self.keyStorage_ getStatusForKey:nsAppKey];

  if (
    status == AppLogRecordHeader::MobileAppKeyStatus::SERVER_INVALID ||
    [self hasInvalidChecksum:nsAppKey forBundleId:[[NSBundle mainBundle] bundleIdentifier]]) {
    @throw [NSException
      exceptionWithName:@"IllegalMobileAppKeyException"
                 reason:[NSString
                          stringWithFormat:@"Error: \"%@\" is an invalid mobile app key.", nsAppKey]
               userInfo:nil];
  }

  return status == AppLogRecordHeader::MobileAppKeyStatus::SERVER_VALID;
}

@end
