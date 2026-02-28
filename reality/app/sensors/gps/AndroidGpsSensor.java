package com.the8thwall.reality.app.sensors.gps;

import android.Manifest;
import android.app.Activity;
import android.content.Context;
import android.content.pm.PackageManager;
import android.location.Location;
import android.location.LocationListener;
import android.location.LocationManager;
import android.os.Bundle;
import android.support.v4.app.ActivityCompat;
import android.util.Log;

public class AndroidGpsSensor {
  private static final String TAG = "8thWallJava";

  private final Context context_;
  private final LocationManager locationManager_;
  private final LocationListener locationListener_;
  private Location currentLocation_;
  private boolean running_ = false;

  public static AndroidGpsSensor create(Context context) {
    return new AndroidGpsSensor(context);
  }

  private AndroidGpsSensor(Context context) {
    context_ = context;
    locationManager_ = (LocationManager)context_.getSystemService(Context.LOCATION_SERVICE);
    locationListener_ = new LocationListener() {
      @Override
      public void onLocationChanged(Location location) {
        currentLocation_ = location;
      }

      @Override
      public void onStatusChanged(String provider, int status, Bundle extras) {}

      @Override
      public void onProviderEnabled(String provider) {}

      @Override
      public void onProviderDisabled(String provider) {}
    };
  }

  public void pause() {
    if (!running_) {
      return;
    }
    locationManager_.removeUpdates(locationListener_);
    running_ = false;
  }

  public void resume() {
    if (running_) {
      return;
    }

    if (
      ActivityCompat.checkSelfPermission(context_, Manifest.permission.ACCESS_FINE_LOCATION)
      != PackageManager.PERMISSION_GRANTED) {
      throw new RuntimeException("Location permission not granted");
      // Use something like the following to request permission:
      // int REQUEST_LOCATION_PERMISSION = 1;
      // ActivityCompat.requestPermissions(
      //     (Activity)context,
      //     new String[] {Manifest.permission.ACCESS_FINE_LOCATION},
      //     REQUEST_LOCATION_PERMISSION);
    }

    locationManager_.requestLocationUpdates(LocationManager.GPS_PROVIDER, 0, 0, locationListener_);
    currentLocation_ = locationManager_.getLastKnownLocation(LocationManager.GPS_PROVIDER);
    running_ = true;
  }

  public void destroy() { locationManager_.removeUpdates(locationListener_); }

  public Location currentLocation() { return currentLocation_; }
}
