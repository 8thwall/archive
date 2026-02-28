package com.the8thwall.reality.app.sensors.arcore;

import com.the8thwall.c8.annotations.Nullable;

import com.google.ar.core.Anchor;
import com.google.ar.core.AugmentedImage;
import com.google.ar.core.Camera;
import com.google.ar.core.Frame;
import com.google.ar.core.Plane;

import java.nio.ByteBuffer;
import java.util.Collection;

/**
 * Model class containing data provided by ARCore.
 */
public final class ARCoreSensorData {
  public final Collection<Anchor> anchors;
  public final Collection<AugmentedImage> images;
  public final Collection<Plane> planes;
  public final float[] projectionMatrix;
  public final Frame frame;

  ARCoreSensorData(
    Collection<Anchor> anchors,
    Collection<AugmentedImage> images,
    Collection<Plane> planes,
    float[] projectionMatrix,
    Frame frame) {
    this.anchors = anchors;
    this.images = images;
    this.planes = planes;
    this.projectionMatrix = projectionMatrix;
    this.frame = frame;
  }
}
