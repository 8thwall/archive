package com.the8thwall;

import android.content.Context;
import android.graphics.Canvas;
import android.graphics.Color;
import android.graphics.Paint;
import android.graphics.Point;
import android.opengl.Matrix;
import android.util.AttributeSet;
import android.util.Log;
import android.view.View;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.atomic.AtomicReference;

import com.the8thwall.c8.Quaternion;
import com.the8thwall.reality.engine.api.Reality.RealityResponse;
import com.the8thwall.reality.engine.api.response.Features.FeaturePoint;

public class XrView extends View {
  static final String TAG = "8thWallJava";

  private final Paint paint_;
  private final AtomicReference<List<Point>> points_;

  public XrView(Context context) { this(context, null); }

  public XrView(Context context, AttributeSet attrs) {
    super(context, attrs);
    paint_ = new Paint();
    paint_.setColor(Color.rgb(118, 17, 183));
    paint_.setStyle(Paint.Style.STROKE);
    paint_.setStrokeWidth(4);
    points_ = new AtomicReference<List<Point>>();
    points_.set(new ArrayList<Point>());
  }

  public void update(RealityResponse.Reader reality) {
    Quaternion r = new Quaternion(
      reality.getXRResponse().getCamera().getExtrinsic().getRotation().getW(),
      reality.getXRResponse().getCamera().getExtrinsic().getRotation().getX(),
      reality.getXRResponse().getCamera().getExtrinsic().getRotation().getY(),
      reality.getXRResponse().getCamera().getExtrinsic().getRotation().getZ());

    float[] extrinsic = new float[16];
    float[] intrinsic = new float[16];
    float[] extrinsicInv = new float[16];
    float[] projection = new float[16];
    float[] modelIntrinsic = new float[16];
    float[] point3d = new float[4];
    float[] projPoint3d = new float[4];
    // clang-format off
    float[] model = {-1.0f, 0.0f, 0.0f, 0.0f,  // r0
                      0.0f, 1.0f, 0.0f, 0.0f,  // r1
                      0.0f, 0.0f, 1.0f, 0.0f,  // r2
                      0.0f, 0.0f, 0.0f, 1.0f}; // r3
    // clang-format on

    r.toRotationMat(extrinsic);
    extrinsic[0 + 3 * 4] = reality.getXRResponse().getCamera().getExtrinsic().getPosition().getX();
    extrinsic[1 + 3 * 4] = reality.getXRResponse().getCamera().getExtrinsic().getPosition().getY();
    extrinsic[2 + 3 * 4] = reality.getXRResponse().getCamera().getExtrinsic().getPosition().getZ();

    Matrix.invertM(extrinsicInv, 0, extrinsic, 0);

    for (int i = 0; i < 16; ++i) {
      intrinsic[i] = reality.getXRResponse().getCamera().getIntrinsic().getMatrix44f().get(i);
    }

    Matrix.multiplyMM(modelIntrinsic, 0, model, 0, intrinsic, 0);

    Matrix.multiplyMM(projection, 0, modelIntrinsic, 0, extrinsicInv, 0);

    List<Point> newPoints = new ArrayList<Point>();
    for (FeaturePoint.Reader pt : reality.getFeatureSet().getPoints()) {
      point3d[0] = pt.getPosition().getX();
      point3d[1] = pt.getPosition().getY();
      point3d[2] = pt.getPosition().getZ();
      point3d[3] = 1.0f;

      Matrix.multiplyMV(projPoint3d, 0, projection, 0, point3d, 0);
      float x3 = projPoint3d[0] / projPoint3d[3];
      float y3 = projPoint3d[1] / projPoint3d[3];
      float z3 = projPoint3d[2] / projPoint3d[3];
      float x2 = x3 / z3;
      float y2 = y3 / z3;
      newPoints.add(
        new Point((int)(getWidth() * (x2 + 1.0f) * 0.5f), (int)(getHeight() * (y2 + 1.0f) * 0.5f)));
    }
    points_.set(newPoints);

    invalidate();
  }

  @Override
  protected void onDraw(Canvas canvas) {
    canvas.drawColor(Color.TRANSPARENT);

    List<Point> drawPoints = points_.get();

    for (Point pt : drawPoints) {
      drawPoint(canvas, pt, paint_);
    }
  }

  private static void drawPoint(Canvas canvas, Point pt, Paint paint) {
    canvas.drawCircle(pt.x, pt.y, 11, paint);
  }
}
