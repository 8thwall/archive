// Copyright (c) 2022 8th Wall, LLC.
// Created by Anthony Maes on 5/4/20.

#include "reality/app/sensors/gps/core-location-controller.h"
#include "c8/c8-log.h"

using namespace c8;

@interface CoreLocationController()

// kicks off CoreLocation
- (void)run;

@end

@interface CoreLocationController () {
    CLLocationManager* _locationManager;
    bool _started;
}
@end

@implementation CoreLocationController

#pragma mark - CoreLocationController

- (id)init {
    if (self = [super init])
    {
        _started = false;
        _locationManager = [[CLLocationManager alloc] init];
        [_locationManager setDelegate:self];
        [_locationManager setDesiredAccuracy:kCLLocationAccuracyBest];
        [_locationManager setDistanceFilter:kCLDistanceFilterNone];
    }
    return self;
}

- (void)resume {
  C8Log("[core-location-controller] %s", "resume");
  if (_started) {
    return;
  }
  C8Log("[core-location-controller] %s", "Start CoreLocation");
  _started = true;
  [self run];
}

- (void)run {
    switch ([CLLocationManager authorizationStatus]) {
        case kCLAuthorizationStatusNotDetermined:
            [_locationManager requestWhenInUseAuthorization];
            break;
        case kCLAuthorizationStatusAuthorizedAlways:
        case kCLAuthorizationStatusAuthorizedWhenInUse:
            [_locationManager startUpdatingLocation];
            [_locationManager startUpdatingHeading];
            break;
        case kCLAuthorizationStatusDenied:
        case kCLAuthorizationStatusRestricted:
        default:
            [self setValue:nil forKey:@"lastLocation"];
            [self setValue:nil forKey:@"lastHeading"];
            break;
    }
}

- (void)pause {
  C8Log("[core-location-controller] %s", "pause");
  if (!_started) {
    return;
  }
  C8Log("[core-location-controller] %s", "Stop CoreLocation");
    [_locationManager stopUpdatingLocation];
    [_locationManager stopUpdatingHeading];
    _started = false;
}

#pragma mark - CLLocationManagerDelegate

- (void)locationManager:(CLLocationManager *)manager
     didUpdateLocations:(NSArray<CLLocation *> *)locations {
    [self setValue:[locations lastObject] forKey:@"lastLocation"];
}

- (void)locationManager:(CLLocationManager *)manager
       didUpdateHeading:(CLHeading *)newHeading {
    [self setValue:newHeading forKey:@"lastHeading"];
}

- (void)locationManager:(CLLocationManager *)manager
       didFailWithError:(NSError *)error {
    [self setValue:nil forKey:@"lastLocation"];
    [self setValue:nil forKey:@"lastHeading"];
}

- (void)locationManager:(CLLocationManager *)manager
didChangeAuthorizationStatus:(CLAuthorizationStatus)status {
    switch (status) {
        case kCLAuthorizationStatusNotDetermined:
            // should never be that value
            break;
        case kCLAuthorizationStatusAuthorizedAlways:
        case kCLAuthorizationStatusAuthorizedWhenInUse:
            [_locationManager startUpdatingLocation];
            [_locationManager startUpdatingHeading];
            break;
        case kCLAuthorizationStatusDenied:
        case kCLAuthorizationStatusRestricted:
        default:
            [self setValue:nil forKey:@"lastLocation"];
            [self setValue:nil forKey:@"lastHeading"];
            break;
    }
}

@end

extern "C" c8_CoreLocation *c8CoreLocation_create() {
  // Take manual ownership of ObjC class an return as a C pointer.
  return (__bridge_retained c8_CoreLocation *)[[CoreLocationController alloc] init];
}

extern "C" void c8CoreLocation_destroy(c8_CoreLocation *c8CoreLocation) {
  CFRelease(c8CoreLocation);
  C8Log("[core-location-controller] %s", "destroy");
}

extern "C" void c8CoreLocation_resume(c8_CoreLocation *c8CoreLocation) {
  CoreLocationController *_coreLocationController = (__bridge CoreLocationController *)c8CoreLocation;
  C8Log("[core-location-controller] %s", "resume");
  [_coreLocationController resume];
}

extern "C" void c8CoreLocation_pause(c8_CoreLocation *c8CoreLocation) {
  CoreLocationController *_coreLocationController = (__bridge CoreLocationController *)c8CoreLocation;
  C8Log("[core-location-controller] %s", "pause");
  [_coreLocationController pause];
}

extern "C" void c8CoreLocation_getLastLocation(c8_CoreLocation *c8CoreLocation, bool* hasLocation, double* latitude,
    double* longitude, double* horizontalAccuracy) {
  CoreLocationController *_coreLocationController = (__bridge CoreLocationController *)c8CoreLocation;
    NSString* str;
    if ([_coreLocationController lastLocation]) {
        CLLocationCoordinate2D coordinates = [_coreLocationController lastLocation].coordinate;
        *hasLocation = true;
        *latitude = coordinates.latitude;
        *longitude = coordinates.longitude;
        *horizontalAccuracy = [_coreLocationController lastLocation].horizontalAccuracy;
    } else {
        *hasLocation = false;
    }
}
