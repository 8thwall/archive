// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Alvin Portilo (alvin@8thwall.com)
//
// Functions for initializing the header struct for an analytics record sent to the server.

#import <AVFoundation/AVFoundation.h>
#import <CommonCrypto/CommonDigest.h>
#import <UIKit/UIKit.h>

#include "c8/c8-log.h"
#include "c8/io/base-x-encoding.h"
#include "reality/app/analytics/ios/xr-analytics-log-header-factory.h"
#include "reality/app/device/ios-device-info.h"
#include "reality/app/validation/ios/app-key-status-user-defaults.h"

@interface XRAnalyticsLogHeaderFactoryImpl : NSObject

- (const char *)getBundleId;

- (const char *)getVendorId;

- (const char *)getDeviceLocale;

@end

@implementation XRAnalyticsLogHeaderFactoryImpl

- (const char *)getBundleId {
  NSString *bundleId = [[NSBundle mainBundle] bundleIdentifier];
  return [bundleId UTF8String];
}

- (const char *)getVendorId {
  NSString *vendorId = [[[UIDevice currentDevice] identifierForVendor] UUIDString];
  return [vendorId UTF8String];
}

- (const char *)getDeviceLocale {
  NSString *language = [[NSLocale preferredLanguages] objectAtIndex:0];
  NSDictionary *languageDic = [NSLocale componentsFromLocaleIdentifier:language];
  NSString *languageCode = [languageDic objectForKey:@"kCFLocaleLanguageCodeKey"];
  NSString *countryCode = [languageDic objectForKey:@"kCFLocaleCountryCodeKey"];
  NSString *locale = [NSString stringWithFormat:@"%@_%@", languageCode, countryCode];
  return [locale UTF8String];
}

- (c8::AppLogRecordHeader::MobileAppKeyStatus)getAppKeyStatus:(const char *)appKey {
  AppKeyStatusStorageUserDefaults *statusStorage = [[AppKeyStatusStorageUserDefaults alloc] init];
  NSString *nsAppKey = [NSString stringWithUTF8String:appKey];
  return [statusStorage getStatusForKey:nsAppKey];
}

@end

namespace c8 {
namespace {

void exportAppHeader(
  XRAnalyticsLogHeaderFactoryImpl *impl,
  const char *mobileAppKey,
  AppLogRecordHeader::Builder *builder) {
  builder->setAppId([impl getBundleId]);
  if (mobileAppKey != nullptr && strlen(mobileAppKey) != 0) {
    builder->setMobileAppKey(mobileAppKey);
    builder->setMobileAppKeyStatus([impl getAppKeyStatus:mobileAppKey]);
  } else {
    builder->setMobileAppKeyStatus(AppLogRecordHeader::MobileAppKeyStatus::MISSING);
  }
}

void exportDeviceHeader(
  XRAnalyticsLogHeaderFactoryImpl *impl, DeviceLogRecordHeader::Builder *builder) {
  DeviceInfo::Builder deviceInfoBuilder = builder->getDeviceInfo();
  c8_exportDeviceInfo(deviceInfoBuilder);
  builder->setLocale([impl getDeviceLocale]);

  auto vendorId = [impl getVendorId];
  auto bundleId = [impl getBundleId];
  builder->setIdForVendor(vendorId);

  // Generate a device ID for the application. MD5 hash of
  // the vendor ID and the bundle ID, then base62 encoding of that result.
  uint8_t digest[CC_MD5_DIGEST_LENGTH];
  CC_MD5_CTX md5Ctx;
  CC_MD5_Init(&md5Ctx);
  CC_MD5_Update(&md5Ctx, vendorId, static_cast<uint32_t>(strlen(vendorId)));
  CC_MD5_Update(&md5Ctx, bundleId, static_cast<uint32_t>(strlen(bundleId)));
  CC_MD5_Final(digest, &md5Ctx);

  BaseXEncoding base62("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ");
  String md5Str(digest, digest + CC_MD5_DIGEST_LENGTH);
  auto encodedHash = base62.encode(md5Str);

  auto idForApp = String(encodedHash->begin(), encodedHash->end());
  auto testStr = idForApp.c_str();
  builder->setIdForApp(idForApp);
}

void exportEngineHeader(
  RealityEngineLogRecordHeader::EngineType engineType,
  RealityEngineLogRecordHeader::Builder *builder) {
  builder->setEngineId(engineType);
}
}  // namespace

void c8_exportLogHeaderInfo(
  RealityEngineLogRecordHeader::EngineType engineType,
  const char *mobileAppKey,
  LogRecordHeader::Builder *headerBuilder) {
  XRAnalyticsLogHeaderFactoryImpl *impl = [[XRAnalyticsLogHeaderFactoryImpl alloc] init];

  AppLogRecordHeader::Builder appHeader = headerBuilder->getApp();
  exportAppHeader(impl, mobileAppKey, &appHeader);

  DeviceLogRecordHeader::Builder deviceHeader = headerBuilder->getDevice();
  exportDeviceHeader(impl, &deviceHeader);

  RealityEngineLogRecordHeader::Builder engineHeader = headerBuilder->getReality();
  exportEngineHeader(engineType, &engineHeader);
}
}  // namespace c8
