// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules.h"

cc_library {
  hdrs = {
    "algorithms.h",
  };
  deps = {
    ":convert",
    "//bzl/inliner:rules",
    "//c8:hmatrix",
    "//c8:set",
    "//c8:vector",
    "@opencv//:calib3d",
    "@opencv//:core",
  };
}

#include "c8/opencv/algorithms.h"

#include <opencv2/calib3d.hpp>
#include <opencv2/core.hpp>
#include "c8/opencv/convert.h"

namespace c8 {

namespace opencv {

namespace {

// Check that the i-th selected point does not belong to a line connecting some previously
// selected points; also checks that points are not too close to each other.
//
// TODO(nb): This method is used by opencv to pre-reject sets of four points for plane finding by
// checking that there aren't 2 other points colinear with the fourth point; this is a little weird
// because it is asymmetric with the first three; either we should also check that the first three
// points are not collinear with each other, or we should check that all three points are collinear
// with the fourth point.
inline bool haveCollinearPoints(const Vector<HPoint2> &pts, int count) {
  int j, k, i = count - 1;
  for (j = 0; j < i; j++) {
    double dx1 = pts[j].x() - pts[i].x();
    double dy1 = pts[j].y() - pts[i].y();
    for (k = 0; k < j; k++) {
      double dx2 = pts[k].x() - pts[i].x();
      double dy2 = pts[k].y() - pts[i].y();
      if (
        fabs(dx2 * dy1 - dy2 * dx1)
        <= FLT_EPSILON * (fabs(dx1) + fabs(dy1) + fabs(dx2) + fabs(dy2)))
        return true;
    }
  }
  return false;
}

}  // namespace

Vector<HMatrix> decomposeHomographyMat(const HMatrix &K, const HMatrix &homography) {
  // Homography decomp routines require double precision inputs.
  cv::Mat homographyMat(toMatx33d(homography));
  cv::Mat kMat(toMatx33d(K));

  std::vector<cv::Mat> rotations;
  std::vector<cv::Mat> translations;
  std::vector<cv::Mat> normals;

  // TODO(nb): 8thwall-ify decomposeHomographyMat.
  cv::decomposeHomographyMat(homographyMat, kMat, rotations, translations, normals);

  Vector<HMatrix> cameraPoses;
  for (int i = 0; i < rotations.size(); ++i) {
    cv::Matx33d rotation = rotations[i];
    cv::Vec3d translation = translations[i];

    // Invert result of homography decomp to convert to world coordinates.
    HMatrix r = toHMatrix(rotation);
    HMatrix t = HMatrixGen::translation(translation[0], translation[1], translation[2]);
    HMatrix p = t * r;
    cameraPoses.emplace_back(p.inv());
  }

  return cameraPoses;
}

Vector<HMatrix> decomposeEssentialMat(const HMatrix &K, const HMatrix &essential) {
  // Start using cv::decomposeEssentialMat =============================
  cv::Mat essentialMat(toMatx33f(essential));
  cv::Mat rotationAMat;
  cv::Mat rotationBMat;
  cv::Mat translationMat;

  // TODO(nb): 8thwall-ify decomposeEssentialMat.
  cv::decomposeEssentialMat(essentialMat, rotationAMat, rotationBMat, translationMat);

  const cv::Matx33f &rA = rotationAMat;
  const cv::Matx33f &rB = rotationBMat;
  const cv::Vec3f &t = translationMat;

  HMatrix rotationA = toHMatrix(rA);
  HMatrix rotationB = toHMatrix(rB);

  HMatrix translationA = HMatrixGen::translation(t(0), t(1), t(2));
  HMatrix translationB = HMatrixGen::translation(-t(0), -t(1), -t(2));

  // Invert extrinsic matrices to transform to world coordinates.
  Vector<HMatrix> relativeCameraPositions;
  relativeCameraPositions.emplace_back((translationA * rotationA).inv());
  relativeCameraPositions.emplace_back((translationB * rotationA).inv());
  relativeCameraPositions.emplace_back((translationA * rotationB).inv());
  relativeCameraPositions.emplace_back((translationB * rotationB).inv());

  return relativeCameraPositions;
}

HMatrix findFundamentalMat(
  const Vector<HPoint2> &view1MatchPoints,
  const Vector<HPoint2> &view2MatchPoints,
  Vector<uint8_t> *outlierMask) {

  if (view1MatchPoints.size() < 8) {
    return HMatrixGen::i();
  }

  // Convert to non-homogenous coordinates, as this is required by cv::findFundamentalMat and
  // cv::findEssentialMat.
  cv::Mat cvPoints1(view1MatchPoints.size(), 1, CV_32FC2);
  cv::Mat cvPoints2(view2MatchPoints.size(), 1, CV_32FC2);
  for (int i = 0; i < view1MatchPoints.size(); ++i) {
    cvPoints1.at<cv::Vec2f>(i) = {view1MatchPoints[i].x(), view1MatchPoints[i].y()};
    cvPoints2.at<cv::Vec2f>(i) = {view2MatchPoints[i].x(), view2MatchPoints[i].y()};
  }

  cv::Mat fundamentalMat =
    cv::findFundamentalMat(cvPoints1, cvPoints2, CV_FM_RANSAC, 3.0, 0.99, *outlierMask);

  if (fundamentalMat.rows != 3) {
    return HMatrixGen::i();
  }

  cv::Matx33d fundamentalMatx(fundamentalMat);

  return toHMatrix(fundamentalMatx);
}

HMatrix findEssentialMat(
  const HMatrix &K,
  const Vector<HPoint2> &view1MatchPoints,
  const Vector<HPoint2> &view2MatchPoints,
  Vector<uint8_t> *outlierMask) {

  if (view1MatchPoints.size() < 5) {
    // TODO(mc): Decide whether to log error or throw here.
    return HMatrixGen::i();
  }

  // Convert to non-homogenous coordinates, as this is required by cv::findEssentialMat.
  cv::Mat cvPoints1(view1MatchPoints.size(), 1, CV_32FC2);
  cv::Mat cvPoints2(view2MatchPoints.size(), 1, CV_32FC2);
  for (int i = 0; i < view1MatchPoints.size(); ++i) {
    cvPoints1.at<cv::Vec2f>(i) = {view1MatchPoints[i].x(), view1MatchPoints[i].y()};
    cvPoints2.at<cv::Vec2f>(i) = {view2MatchPoints[i].x(), view2MatchPoints[i].y()};
  }

  cv::Mat cvK(3, 3, CV_32FC1);
  cvK.at<float>(0, 0) = K(0, 0);
  cvK.at<float>(0, 1) = K(0, 1);
  cvK.at<float>(0, 2) = K(0, 2);
  cvK.at<float>(1, 0) = K(1, 0);
  cvK.at<float>(1, 1) = K(1, 1);
  cvK.at<float>(1, 2) = K(1, 2);
  cvK.at<float>(2, 0) = K(2, 0);
  cvK.at<float>(2, 1) = K(2, 1);
  cvK.at<float>(2, 2) = K(2, 2);

  cv::Mat essentialMat =
    cv::findEssentialMat(cvPoints1, cvPoints2, cvK, cv::RANSAC, 0.999, 2.0, *outlierMask);

  if (essentialMat.rows != 3) {
    // TODO(mc): Decide whether to log error or throw here.
    return HMatrixGen::i();
  }

  cv::Matx33d essentialMat33d(essentialMat);

  return toHMatrix(essentialMat33d);
}

HMatrix findHomography(
  const Vector<HPoint2> &view1MatchPoints,
  const Vector<HPoint2> &view2MatchPoints,
  Vector<uint8_t> *coplanar) {
  if (view1MatchPoints.size() < 5) {
    return HMatrixGen::i();
  }

  // Convert to non-homogenous coordinates, as this is required by cv::findEssentialMat.
  std::vector<cv::Point2d> cvPoints1;
  std::vector<cv::Point2d> cvPoints2;
  for (int i = 0; i < view1MatchPoints.size(); ++i) {
    cvPoints1.emplace_back(cv::Point2d{view1MatchPoints[i].x(), view1MatchPoints[i].y()});
    cvPoints2.emplace_back(cv::Point2d{view2MatchPoints[i].x(), view2MatchPoints[i].y()});
  }
  cv::Mat h;
  h = cv::findHomography(cvPoints1, cvPoints2, *coplanar, cv::RANSAC, 1.0);

  if (h.rows == 0) {
    return HMatrixGen::i();
  }

  cv::Matx33d homography33d(h);

  return toHMatrix(homography33d);
}

// Estimate the most likely homography that explains a set of points.
HMatrix proposeHomography(
  const Vector<HPoint2> &view1MatchPoints,
  const Vector<HPoint2> &view2MatchPoints,
  const TreeSet<size_t> &coplanarSet) {
  int i = 0;
  int count = coplanarSet.size();

  Vector<HPoint2> M;
  Vector<HPoint2> m;
  for (auto idx : coplanarSet) {
    M.push_back(view1MatchPoints[idx]);
    m.push_back(view2MatchPoints[idx]);
  }

  if (haveCollinearPoints(M, count) || haveCollinearPoints(m, count)) {
    return HMatrixGen::i();
  }

  // We check whether the minimal set of points for the homography estimation are geometrically
  // consistent. We check if every 3 correspondences sets fulfills the constraint. The usefullness
  // of this constraint is explained in the paper:
  //
  // "Speeding-up homography estimation in mobile devices"
  // Journal of Real-Time Image Processing. 2013. DOI: 10.1007/s11554-012-0314-1
  // Pablo Marquez-Neila, Javier Lopez-Alberca, Jose M. Buenaposada, Luis Baumela
  if (count == 4) {
    static const int tt[][3] = {{0, 1, 2}, {1, 2, 3}, {0, 2, 3}, {0, 1, 3}};
    int negative = 0;

    for (int i = 0; i < 4; i++) {
      const int *t = tt[i];
      cv::Matx33d A(
        M[t[0]].x(), M[t[0]].y(), 1., M[t[1]].x(), M[t[1]].y(), 1., M[t[2]].x(), M[t[2]].y(), 1.);
      cv::Matx33d B(
        m[t[0]].x(), m[t[0]].y(), 1., m[t[1]].x(), m[t[1]].y(), 1., m[t[2]].x(), m[t[2]].y(), 1.);

      negative += determinant(A) * determinant(B) < 0;
    }
    if (negative != 0 && negative != 4) {
      return HMatrixGen::i();
    }
  }

  double LtL[9][9], W[9][1], V[9][9];
  cv::Mat _LtL(9, 9, CV_64F, &LtL[0][0]);
  cv::Mat matW(9, 1, CV_64F, W);
  cv::Mat matV(9, 9, CV_64F, V);
  cv::Mat _H0(3, 3, CV_64F, V[8]);
  cv::Mat _Htemp(3, 3, CV_64F, V[7]);
  cv::Point2d cM(0, 0);
  cv::Point2d cm(0, 0);
  cv::Point2d sM(0, 0);
  cv::Point2d sm(0, 0);

  for (i = 0; i < count; i++) {
    cm.x += m[i].x();
    cm.y += m[i].y();
    cM.x += M[i].x();
    cM.y += M[i].y();
  }

  cm.x /= count;
  cm.y /= count;
  cM.x /= count;
  cM.y /= count;

  for (i = 0; i < count; i++) {
    sm.x += fabs(m[i].x() - cm.x);
    sm.y += fabs(m[i].y() - cm.y);
    sM.x += fabs(M[i].x() - cM.x);
    sM.y += fabs(M[i].y() - cM.y);
  }

  if (
    fabs(sm.x) < DBL_EPSILON || fabs(sm.y) < DBL_EPSILON || fabs(sM.x) < DBL_EPSILON
    || fabs(sM.y) < DBL_EPSILON) {
    return HMatrixGen::i();
  }

  sm.x = count / sm.x;
  sm.y = count / sm.y;
  sM.x = count / sM.x;
  sM.y = count / sM.y;

  double invHnorm[9] = {1.0f / sm.x, 0, cm.x, 0, 1.0f / sm.y, cm.y, 0, 0, 1};
  double Hnorm2[9] = {sM.x, 0, -cM.x * sM.x, 0, sM.y, -cM.y * sM.y, 0, 0, 1};
  cv::Mat _invHnorm(3, 3, CV_64F, invHnorm);
  cv::Mat _Hnorm2(3, 3, CV_64F, Hnorm2);

  _LtL.setTo(cv::Scalar::all(0));
  for (i = 0; i < count; i++) {
    double x = (m[i].x() - cm.x) * sm.x;
    double y = (m[i].y() - cm.y) * sm.y;
    double X = (M[i].x() - cM.x) * sM.x;
    double Y = (M[i].y() - cM.y) * sM.y;
    double Lx[] = {X, Y, 1, 0, 0, 0, -x * X, -x * Y, -x};
    double Ly[] = {0, 0, 0, X, Y, 1, -y * X, -y * Y, -y};
    int j, k;
    for (j = 0; j < 9; j++) {
      for (k = j; k < 9; k++) {
        LtL[j][k] += Lx[j] * Lx[k] + Ly[j] * Ly[k];
      }
    }
  }
  cv::completeSymm(_LtL);

  cv::eigen(_LtL, matW, matV);
  _Htemp = _invHnorm * _H0;
  _H0 = _Htemp * _Hnorm2;

  cv::Matx33f Bx33f;
  _H0.convertTo(Bx33f, CV_32F, 1. / _H0.at<double>(2, 2));

  return toHMatrix(Bx33f);
}

HMatrix refineCameraMotion(
  const HMatrix &K,
  const HMatrix &extrinsicEstimate,
  const Vector<HPoint2> &camPoints,
  const Vector<HPoint3> &pts3dEstimate) {
  cv::Mat KMat(toMatx33d(K));
  HMatrix exInv = extrinsicEstimate.inv();
  cv::Mat RMat33(toMatx33d(exInv));
  cv::Mat TMat(toMatx31d(exInv));
  cv::Mat RMat;
  cv::Rodrigues(RMat33, RMat);

  std::vector<cv::Point2f> imagePoints;
  std::vector<cv::Point3f> objectPoints;
  for (auto pt : camPoints) {
    imagePoints.push_back(cv::Point2f(pt.x(), pt.y()));
  }
  for (auto pt : pts3dEstimate) {
    objectPoints.push_back(cv::Point3f(pt.x(), pt.y(), pt.z()));
  }

  // Start with initial RMat and TMat, and iteratively refine them in place.
  cv::solvePnP(
    objectPoints, imagePoints, KMat, cv::noArray(), RMat, TMat, true, cv::SOLVEPNP_ITERATIVE);

  // Expand the rotation matrix.
  cv::Rodrigues(RMat, RMat33);
  cv::Matx33d RMat33d(RMat33);

  HMatrix rotation = toHMatrix(RMat33d);
  HMatrix translation =
    HMatrixGen::translation(TMat.at<double>(0, 0), TMat.at<double>(1, 0), TMat.at<double>(2, 0));
  HMatrix extrinsicInv = translation * rotation;
  return extrinsicInv.inv();
}

void getClosestEpipolarPoints(
  const HMatrix &F,
  const Vector<HPoint2> &ptsCam1,
  const Vector<HPoint2> &ptsCam2,
  Vector<HPoint2> *epipolarPtsCam1,
  Vector<HPoint2> *epipolarPtsCam2) {
 cv::Mat ptsCam1Mat(1, ptsCam1.size(), CV_64FC2);
 cv::Mat ptsCam2Mat(1, ptsCam2.size(), CV_64FC2);
 for (int i = 0; i < ptsCam1.size(); ++i) {
   ptsCam1Mat.at<cv::Point2d>(0, i).x = ptsCam1[i].x();
   ptsCam1Mat.at<cv::Point2d>(0, i).y = ptsCam1[i].y();
 }
 for (int i = 0; i < ptsCam2.size(); ++i) {
   ptsCam2Mat.at<cv::Point2d>(0, i).x = ptsCam2[i].x();
   ptsCam2Mat.at<cv::Point2d>(0, i).y = ptsCam2[i].y();
 }
 cv::Mat epipolarPtsCam1Mat;
 cv::Mat epipolarPtsCam2Mat;
 cv::Mat FMat(toMatx33d(F));
 cv::correctMatches(FMat, ptsCam1Mat, ptsCam2Mat, epipolarPtsCam1Mat, epipolarPtsCam2Mat);

 epipolarPtsCam1->clear();
 epipolarPtsCam2->clear();
 for (int i = 0; i < ptsCam1.size(); ++i) {
   auto pt = epipolarPtsCam1Mat.at<cv::Point2d>(0, i);
   epipolarPtsCam1->push_back(HPoint2(static_cast<float>(pt.x), static_cast<float>(pt.y)));
 }
 for (int i = 0; i < ptsCam2.size(); ++i) {
   auto pt = epipolarPtsCam2Mat.at<cv::Point2d>(0, i);
   epipolarPtsCam2->push_back(HPoint2(static_cast<float>(pt.x), static_cast<float>(pt.y)));
 }
}

void decomposeExtrinsicMatrix(const HMatrix &cam, HMatrix *rotation, HMatrix *translation) {
  // TODO(nb): This method appears to give the right result, but it is highly dubious in its
  // implementation. To be a proper projection matrix as requested by the opencv method, cam should
  // be inverted, but this gives a rotated translation vector in the result. Using a non-inverted
  // camera, the correct projective translation (i.e. inverse of extrinsic translation) is recovered
  // but the inverse rotation is recovered. This sign mismatch is also troubling.
  cv::Mat P(toMatx34d(cam));
  cv::Mat I;
  cv::Mat R;
  cv::Mat T;
  cv::decomposeProjectionMatrix(P, I, R, T);
  cv::Matx33d R33d(R);
  cv::Matx41d T41d(T);
  *rotation = toHMatrix(R33d);
  auto s = 1.0 / T41d(3, 0);
  *translation = HMatrixGen::translation(T41d(0, 0) * s, T41d(1, 0) * s, T41d(2, 0) * s).inv();
}

}  // namespace opencv

}  // namespace c8
