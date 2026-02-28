// Copyright (c) 2022 8th Wall, LLC.
// Created by Anthony Maes on 5/4/20.

#import <CoreLocation/CoreLocation.h>
#import <Foundation/Foundation.h>

NS_ASSUME_NONNULL_BEGIN

@interface CoreLocationController : NSObject <CLLocationManagerDelegate>

- (void)resume;

- (void)pause;

// coordinates of the last location
@property(readonly) CLLocation *lastLocation;

// heading of the last location
// currently unused
@property(readonly) CLHeading *lastHeading;

@end

#pragma once

#ifdef __cplusplus
extern "C" {
#endif

struct c8_CoreLocation;
struct c8_CoreLocation *c8CoreLocation_create();

void c8CoreLocation_destroy(struct c8_CoreLocation *_coreLocationController);

void c8CoreLocation_resume(struct c8_CoreLocation *_coreLocationController);

void c8CoreLocation_pause(struct c8_CoreLocation *_coreLocationController);

void c8CoreLocation_getLastLocation(
  struct c8_CoreLocation *c8CoreLocation,
  bool *hasLocation,
  double *latitude,
  double *longitude,
  double *horizontalAccuracy_);

#ifdef __cplusplus
}
#endif

NS_ASSUME_NONNULL_END
