package com.the8thwall.reality.app.sensors.pose;

import android.app.Activity;
import android.content.Context;
import android.hardware.Sensor;
import android.hardware.SensorEvent;
import android.hardware.SensorEventListener;
import android.hardware.SensorManager;
import android.util.DisplayMetrics;
import android.util.Log;
import android.view.Surface;
import android.view.WindowManager;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

public class AndroidPoseSensor implements SensorEventListener {
  private static final String TAG = "8thWallJava";

  private static void logD(String s) {
    Thread t = Thread.currentThread();
    Log.d(TAG, String.format("[AndroidPoseSensor] %d (\"%s\") %s", t.getId(), t.getName(), s));
  }

  private final AtomicReference<ArrayList<XRPoseSensorEvent>> eventQueue_;

  private boolean useAccelerometerForPose_;
  private SensorManager sensorManager_;
  private boolean running_ = false;

  public final float[] acceleration = new float[3];
  public final float[] pose = new float[4];
  public final float[] sensorRotationToPortrait = new float[4];

  public static class XRPoseSensorEvent {
    public final String name;
    public final int type;
    public final long timestamp;
    public final float x;
    public final float y;
    public final float z;

    public XRPoseSensorEvent(SensorEvent e) {
      name = e.sensor.getName();
      type = e.sensor.getType();
      timestamp = e.timestamp;
      x = e.values[0];
      y = e.values[1];
      z = e.values[2];
    }

    @Override
    public String toString() {
      return String.format(
        "Timestamp: %d, Sensor: (%d) %s, Values: (x: %f ; y: %f ; z: %f)",
        timestamp,
        type,
        name,
        x,
        y,
        z);
    }
  }

  private AndroidPoseSensor(Context context) {
    sensorManager_ = (SensorManager)context.getSystemService(Context.SENSOR_SERVICE);
    eventQueue_ = new AtomicReference<>(new ArrayList<XRPoseSensorEvent>(100));

    DisplayMetrics dm = new DisplayMetrics();
    WindowManager windowManager = (WindowManager)context.getSystemService(Context.WINDOW_SERVICE);
    windowManager.getDefaultDisplay().getMetrics(dm);
    int width = dm.widthPixels;
    int height = dm.heightPixels;
    int rotation = windowManager.getDefaultDisplay().getRotation();
    boolean rotated = rotation == Surface.ROTATION_90 || rotation == Surface.ROTATION_270;
    if (height > width == rotated) {
      sensorRotationToPortrait[0] = 0.70710678118f;
      sensorRotationToPortrait[1] = 0.0f;
      sensorRotationToPortrait[2] = 0.0f;
      sensorRotationToPortrait[3] = 0.70710678118f;
    } else {
      sensorRotationToPortrait[0] = 1.0f;
      sensorRotationToPortrait[1] = 0.0f;
      sensorRotationToPortrait[2] = 0.0f;
      sensorRotationToPortrait[3] = 0.0f;
    }
  }

  public List<XRPoseSensorEvent> releaseEventQueue() {
    // Rather than return the old queue directly, we copy its contents to a new list. We do this in
    // order to handle a potential race condition that callers should not have to care about.
    ArrayList<XRPoseSensorEvent> oldQueue =
      eventQueue_.getAndSet(new ArrayList<XRPoseSensorEvent>(100));

    // Up to one queue element can be added while we are copying, so reserve capacity for it.
    int queueSize = oldQueue.size();
    ArrayList<XRPoseSensorEvent> copy = new ArrayList<>(queueSize + 1);

    // Copy everything that was in the queue when we first grabbed it.
    // It's possible that we try releasing the queue in the middle of an {@link ArrayList#add}.
    // This method will increase the size of the list before the item is actually added, so
    // {@link ArrayList#get(ArrayList#size() - 1)} may return null.
    // Let's guard against this by adding only non-null items to our copy.
    for (int i = 0; i < queueSize; ++i) {
      if (oldQueue.get(i) != null) {
        copy.add(oldQueue.get(i));
      }
    }

    // At most one element can be added at the end while we are copying. Detect if something has
    // been added and catch up.
    if (oldQueue.size() > queueSize) {
      if (oldQueue.get(queueSize) != null) {
        copy.add(oldQueue.get(queueSize));
      }
    }

    return copy;
  }

  public static AndroidPoseSensor create(Context context) {
    logD("create");
    return new AndroidPoseSensor(context);
  }

  public void resume() {
    logD("resume");
    running_ = true;
    if (sensorManager_ == null) {
      Log.w(TAG, "No sensor manager available.");
      return;
    }
    // High level sensor data pre-processed by the OS to give good signal.
    sensorManager_.registerListener(
      this,
      sensorManager_.getDefaultSensor(Sensor.TYPE_LINEAR_ACCELERATION),
      SensorManager.SENSOR_DELAY_FASTEST);

    boolean hasRotationVector = sensorManager_.registerListener(
      this,
      sensorManager_.getDefaultSensor(Sensor.TYPE_ROTATION_VECTOR),
      SensorManager.SENSOR_DELAY_FASTEST);
    if (!hasRotationVector) {
      boolean hasOrientation = sensorManager_.registerListener(
        this,
        sensorManager_.getDefaultSensor(Sensor.TYPE_ORIENTATION),
        SensorManager.SENSOR_DELAY_FASTEST);
      useAccelerometerForPose_ = !hasOrientation;
    }

    // Raw sensor data.
    sensorManager_.registerListener(
      this,
      sensorManager_.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
      SensorManager.SENSOR_DELAY_FASTEST);
    sensorManager_.registerListener(
      this,
      sensorManager_.getDefaultSensor(Sensor.TYPE_GYROSCOPE),
      SensorManager.SENSOR_DELAY_FASTEST);
    sensorManager_.registerListener(
      this,
      sensorManager_.getDefaultSensor(Sensor.TYPE_MAGNETIC_FIELD),
      SensorManager.SENSOR_DELAY_FASTEST);
  }

  public void pause() {
    logD("pause");
    running_ = false;
    if (sensorManager_ != null ) {
      sensorManager_.unregisterListener(this);
    }
  }

  public void destroy() {
    logD("destroy");
    if (running_) {
      pause();
    }
    sensorManager_ = null;
  }

  @Override
  public void onAccuracyChanged(Sensor sensor, int accuracy) {
    // Fall through.
  }

  @Override
  public void onSensorChanged(SensorEvent event) {
    switch (event.sensor.getType()) {
      case Sensor.TYPE_LINEAR_ACCELERATION:
        System.arraycopy(event.values, 0, this.acceleration, 0, this.acceleration.length);
        break;
      case Sensor.TYPE_ROTATION_VECTOR:
        sensorManager_.getQuaternionFromVector(this.pose, event.values);
        break;
      case Sensor.TYPE_ORIENTATION:
        orientationToQuaternion(-event.values[0], -event.values[1], event.values[2]);
        break;
      case Sensor.TYPE_ACCELEROMETER:
        if (useAccelerometerForPose_) {
          accelerationToQuaternion(event.values);
        }
        break;
      case Sensor.TYPE_GYROSCOPE:
      case Sensor.TYPE_MAGNETIC_FIELD:
        break;
      default:
        logD("AndroidRealityEngine-AndroidPoseSensor-UnexpectedSensorChanged");
    }
    // NOTE: This might add one element after getAndSet is called in releaseEventQueue.
    // Record all requested events
    eventQueue_.get().add(new XRPoseSensorEvent(event));
    // Guard against failure to drain the queue; in this case it's likely that nobody is
    // actually inspecting the event queue. Note that if the queue has just been released in
    // between these two calls to "get", the size will be close to 0, so it won't be redrained.
    if (eventQueue_.get().size() > 10000) {
      Log.w(TAG, "draining AndroidPoseSensor event queue.");
      releaseEventQueue();
    }
  }

  void orientationToQuaternion(float yaw, float pitch, float roll) {
    float halfToRad = (float)Math.toRadians(0.5);
    float cy = (float)Math.cos(yaw * halfToRad);
    float sy = (float)Math.sin(yaw * halfToRad);
    float cr = (float)Math.cos(roll * halfToRad);
    float sr = (float)Math.sin(roll * halfToRad);
    float cp = (float)Math.cos(pitch * halfToRad);
    float sp = (float)Math.sin(pitch * halfToRad);

    this.pose[0] = cy * cp * cr + sy * sp * sr;
    this.pose[1] = sy * cp * sr + cy * sp * cr;
    this.pose[2] = -(cy * cp * sr - sy * sp * cr);
    this.pose[3] = sy * cp * cr - cy * sp * sr;
  }

  void accelerationToQuaternion(float[] values) {
    float amag =
      (float)Math.sqrt(values[0] * values[0] + values[1] * values[1] + values[2] * values[2]);
    float ax = values[0] / amag;
    float ay = values[1] / amag;
    float az = values[2] / amag;

    float d = (float)Math.sqrt(2f * (az + 1));
    float dw = d / 2, dx = ay / d, dy = -ax / d, dz = 0;

    float alpha = 0.2f;  // low pass filter
    float w = this.pose[0] * (1 - alpha) + alpha * dw;
    float x = this.pose[1] * (1 - alpha) + alpha * dx;
    float y = this.pose[2] * (1 - alpha) + alpha * dy;
    float z = this.pose[3] * (1 - alpha) + alpha * dz;

    float n = (float)Math.sqrt(w * w + x * x + y * y + z * z);
    this.pose[0] = w / n;
    this.pose[1] = x / n;
    this.pose[2] = y / n;
    this.pose[3] = z / n;
  }
}
