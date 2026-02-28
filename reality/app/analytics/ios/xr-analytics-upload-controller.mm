// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Alvin Portillo (alvin@8thwall.com)
//
// Controller class responsible for uploading analytics logs to the server.

#import <AVFoundation/AVFoundation.h>

#include "c8/c8-log.h"
#include "c8/vector.h"
#include "reality/app/analytics/ios/xr-analytics-upload-controller.h"
#include "reality/app/analytics/ios/xr-analytics-upload-session.h"

using namespace c8;

static constexpr BOOL UPLOAD_LOGS = YES;
static constexpr NSTimeInterval TIMEOUT_INTERVAL_SEC = 10.0;

@interface XRAnalyticsUploadControllerImpl : NSObject

- (void)logRecordToServer:(std::unique_ptr<c8::Vector<uint8_t>> &)recordBytesPtr;

@end

@implementation XRAnalyticsUploadControllerImpl

- (NSMutableURLRequest *)createURLRequestWithContentLength:(size_t)length {
  NSURL *url = [NSURL URLWithString:@"https://<REMOVED_BEFORE_OPEN_SOURCING>.8thwall.com/log"];
  NSMutableURLRequest *request = [[NSMutableURLRequest alloc] initWithURL:url];
  request.HTTPMethod = @"POST";
  request.timeoutInterval = TIMEOUT_INTERVAL_SEC;
  [request setValue:@"application/octet-stream" forHTTPHeaderField:@"Content-Type"];
  [request setValue:@"deflate" forHTTPHeaderField:@"Content-Encoding"];
  [request setValue:[@(length) stringValue] forHTTPHeaderField:@"Content-Length"];
  return request;
}

- (void)logRecordToServer:(std::unique_ptr<c8::Vector<uint8_t>> &)recordBytesPtr {
  // TODO(alvin): Check if connectivity is available. Otherwise, ignore.
  NSData *data = [[NSData alloc] initWithBytes:recordBytesPtr->data()
                                        length:recordBytesPtr->size()];
  NSMutableURLRequest *request = [self createURLRequestWithContentLength:recordBytesPtr->size()];
  [XRAnalyticsUploadSession createAndStartUploadTaskWithRequest:request fromData:data];
}

@end

namespace c8 {

void c8AnalyticsUploadController_logRecordToServer(
  std::unique_ptr<c8::Vector<uint8_t>> &recordBytesPtr) {
  if (UPLOAD_LOGS) {
    C8Log("Starting XRAnalytics upload of %d bytes", recordBytesPtr->size());
    XRAnalyticsUploadControllerImpl *impl = [[XRAnalyticsUploadControllerImpl alloc] init];
    [impl logRecordToServer:recordBytesPtr];
  }
}

}  // namespace c8
