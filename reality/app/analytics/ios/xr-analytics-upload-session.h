// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Alvin Portilo (alvin@8thwall.com)
//
// Wrapper around a single NSURLSession used to manage XR analytics uploads.

#import <AVFoundation/AVFoundation.h>

@interface XRAnalyticsUploadSession : NSObject

/**
 * Creates and starts an {@link NSURLSessionUploadTask} which will upload the provided data
 * by writing the data to a temporary file, then deleting it once the upload is complete.
 */
+ (void)createAndStartUploadTaskWithRequest:(NSMutableURLRequest *)request
                                   fromData:(NSData *)data;

/**
 * Creates and starts an {@link NSURLSessionUploadTask} which will upload the data in the
 * given file. When the {@code removeFile} parameter is set to {@code YES}, the file will be
 * deleted once the upload completes.
 */
+ (void)createAndStartUploadTaskWithRequest:(NSMutableURLRequest *)request
                                   fromFile:(NSString *)filePath
                                   andRemoveFile:(BOOL)removeFile;
@end
