// Copyright (c) 2018 8th Wall, Inc.
// Original Author: Alvin Portillo (alvin@8thwall.com)
//
// Controller class responsible for validating the mobile app key provided by the developer.

#import <AVFoundation/AVFoundation.h>

#include "c8/c8-log.h"
#include "reality/app/validation/ios/local-app-key-validator.h"
#include "reality/app/validation/ios/xr-validation-controller.h"

using namespace c8;

@interface XRValidationControllerImpl : NSObject

@property(nonatomic, strong) AppKeyStatusStorageUserDefaults *statusStorage_;
@property(nonatomic, strong) LocalAppKeyValidator *localAppKeyValidator_;

- (void)validateApplication:(const char *)appKey;

@end

@implementation XRValidationControllerImpl

- (id)init {
  if (!(self = [super init])) {
    return nil;
  }
  self.statusStorage_ = [[AppKeyStatusStorageUserDefaults alloc] init];
  self.localAppKeyValidator_ = [[LocalAppKeyValidator alloc] init];
  return self;
}

- (NSMutableURLRequest *)createValidationURLRequestForAppKey:(NSString *)appKey {
  NSString *urlString =
    [NSString stringWithFormat:@"https://console.8thwall.com/public/verify/%@", appKey];
  NSURL *url = [NSURL URLWithString:urlString];
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];
  request.HTTPMethod = @"GET";
  request.timeoutInterval = 10.0;
  return request;
}

- (void)handleValidationResponse:(NSInteger)responseCode forAppKey:(NSString *)appKey {
  if (responseCode == 200) {
    [self.statusStorage_ setStatus:AppLogRecordHeader::MobileAppKeyStatus::SERVER_VALID
                         forAppKey:appKey];
  } else if (responseCode == 403) {
    [self.statusStorage_ setStatus:AppLogRecordHeader::MobileAppKeyStatus::SERVER_INVALID
                         forAppKey:appKey];
    @throw [NSException
      exceptionWithName:@"IllegalMobileAppKeyException"
                 reason:[NSString
                          stringWithFormat:@"Error: \"%@\" is an invalid mobile app key.", appKey]
               userInfo:nil];
  }
}

- (void)validateAppKeyWithServer:(NSString *)appKey {
  NSMutableURLRequest *urlRequest = [self createValidationURLRequestForAppKey:appKey];
  NSURLSession *session = [NSURLSession sharedSession];

  NSURLSessionDataTask *dataTask =
    [session dataTaskWithRequest:urlRequest
               completionHandler:^(NSData *data, NSURLResponse *response, NSError *error) {
                 NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)response;
                 C8Log("App Key Validation Response Status Code: %d", httpResponse.statusCode);
                 [self handleValidationResponse:httpResponse.statusCode forAppKey:appKey];
               }];
  [dataTask resume];
}

- (void)validateApplication:(const char *)appKey {
  if ([self.localAppKeyValidator_ validateAppKey:appKey]) {
    // Validity of app key can be completely determined from the client.
    return;
  }

  // Validity of the mobile app key is still unknown. Let's query server for it.
  NSString *nsAppKey = [NSString stringWithUTF8String:appKey];
  [self validateAppKeyWithServer:nsAppKey];
}

@end

namespace c8 {
void c8ValidationController_validateApplication(const char *mobileAppKey) {
  XRValidationControllerImpl *impl = [[XRValidationControllerImpl alloc] init];
  [impl validateApplication:mobileAppKey];
}
}  // namespace c8
