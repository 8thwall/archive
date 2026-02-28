// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Alvin Portilo (alvin@8thwall.com)
//
// Wrapper around a single NSURLSession used to manage XR analytics uploads.

#import <UIKit/UIKit.h>

#include "reality/app/analytics/ios/xr-analytics-upload-session.h"
#include "c8/c8-log.h"

using namespace c8;

static constexpr NSTimeInterval TIMEOUT_INTERVAL_SEC = 10.0;

@interface UploadSessionDelegate
    : NSObject<NSURLSessionDelegate, NSURLSessionDataDelegate, NSURLSessionTaskDelegate>
@end

@implementation UploadSessionDelegate

- (void)URLSession:(NSURLSession *)session
                        task:(NSURLSessionTask *)task
  willPerformHTTPRedirection:(NSHTTPURLResponse *)response
                  newRequest:(NSURLRequest *)request
           completionHandler:(void (^)(NSURLRequest *))completionHandler {
  // TODO(alvin): Handle redirects appropriately.
}

- (void)URLSession:(NSURLSession *)session
          dataTask:(NSURLSessionDataTask *)dataTask
    didReceiveData:(NSData *)data {
  NSHTTPURLResponse *httpResponse = (NSHTTPURLResponse *)dataTask.response;
  C8Log("HTTP Response Status Code: %d", httpResponse.statusCode);
}

- (void)URLSession:(NSURLSession *)session
                  task:(NSURLSessionTask *)task
  didCompleteWithError:(NSError *)error {
  [self removeFileUploadedByTask:task];
}

- (void)removeFileUploadedByTask:(NSURLSessionTask *)task {
  NSString *filePathToRemove = task.taskDescription;
  if (filePathToRemove != nil) {
    [self removeFileWithPath:filePathToRemove];
  }
}

- (void)removeFileWithPath:(NSString *)filePath {
  NSFileManager *fileManager = [NSFileManager defaultManager];
  if (filePath && [fileManager fileExistsAtPath:filePath]) {
    NSError *error;
    [fileManager removeItemAtPath:filePath error:&error];
    const char *pathStr = [filePath UTF8String];
    C8Log("Removed file at path: \"%s\"", pathStr);
  } else if (filePath) {
    const char *pathStr = [filePath UTF8String];
    C8Log("Error: Analytics file did not exist at path \"%s\"", pathStr);
  } else {
    C8Log("Error: %s", "Attempting to delete nil analytics file");
  }
}

@end

@implementation XRAnalyticsUploadSession

+ (NSURLSession *)backgroundUploadSession {
  static NSURLSession *sharedUploadSession = nil;
  static dispatch_once_t onceToken;
  dispatch_once(&onceToken, ^{
    UploadSessionDelegate *delegate = [[UploadSessionDelegate alloc] init];
    NSURLSessionConfiguration *config = [XRAnalyticsUploadSession createURLSessionConfig];
    sharedUploadSession =
      [NSURLSession sessionWithConfiguration:config delegate:delegate delegateQueue:nil];
  });
  return sharedUploadSession;
}

+ (NSURLSessionConfiguration *)createURLSessionConfig {
  NSURLSessionConfiguration *config = nil;
  NSString *configId =
    [NSString stringWithFormat:@"%@.XRAnalytics", [[NSBundle mainBundle] bundleIdentifier]];


  float ver = [[[UIDevice currentDevice] systemVersion] floatValue];
  if (ver >= 8.0) {
    config = [NSURLSessionConfiguration backgroundSessionConfigurationWithIdentifier:configId];
  } else {
// Running a version of iOS (< 8.0) that does not contain the
// backgroundSessionConfigurationWithIdentifier function. Fall back to the deprecated version.
#pragma clang diagnostic push
#pragma clang diagnostic ignored "-Wdeprecated-declarations"
    config = [NSURLSessionConfiguration backgroundSessionConfiguration:configId];
#pragma clang diagnostic pop
  }

  // Do not let the session re-launch the application when all tasks complete.
  config.sessionSendsLaunchEvents = NO;
  config.timeoutIntervalForRequest = TIMEOUT_INTERVAL_SEC;
  return config;
}

+ (void)createAndStartUploadTaskWithRequest:(NSMutableURLRequest *)request fromData:(NSData *)data {
  NSString *filePath = [XRAnalyticsUploadSession writeDataToTmpFile:data];
  [XRAnalyticsUploadSession createAndStartUploadTaskWithRequest:request
                                                       fromFile:filePath
                                                  andRemoveFile:YES];
}

+ (NSString *)writeDataToTmpFile:(NSData *)data {
  NSString *tmpDirPath = NSTemporaryDirectory();
  NSUInteger timestamp = [[NSDate date] timeIntervalSince1970];
  NSString *fileName =
    [NSString stringWithFormat:@"xr-analytics-%lu.txt", (unsigned long)timestamp];
  NSString *filePath = [tmpDirPath stringByAppendingPathComponent:fileName];
  [data writeToFile:filePath atomically:YES];
  return filePath;
}

+ (void)createAndStartUploadTaskWithRequest:(NSMutableURLRequest *)request
                                   fromFile:(NSString *)filePath
                              andRemoveFile:(BOOL)removeFile {
  NSURLSession *session = [XRAnalyticsUploadSession backgroundUploadSession];
  NSURLSessionUploadTask *uploadTask =
    [session uploadTaskWithRequest:request fromFile:[NSURL fileURLWithPath:filePath]];
  if (removeFile) {
    uploadTask.taskDescription = filePath;
  }
  [uploadTask resume];
}
@end
