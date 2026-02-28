// Copyright (c) 2025 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":mock-jni-test",
    ":scoped-local-env",
    ":scoped-local-ref",
    "@com_google_googletest//:gtest_main",
  };
  target_compatible_with = {
    "@platforms//os:android",
  };
}
cc_end(0xf7689542);

#include <gmock/gmock.h>
#include <gtest/gtest.h>
#include <jni.h>

#include "c8/android/jni/mock-jni-test.h"
#include "c8/android/jni/scoped-local-env.h"
#include "c8/android/jni/scoped-local-ref.h"

using namespace c8;

TEST_F(MockJniTest, CallObjectMethodUnpacksLocalRefs) {
  auto scopedLocalEnv = ScopedLocalEnv(&mockEnv_);

  jmethodID mockMethodID = reinterpret_cast<jmethodID>(0x1111);
  jobject mockJObject = reinterpret_cast<jobject>(0x2222);
  jobject mockJObject2 = reinterpret_cast<jobject>(0x3333);

  {
    // Simulate ScopedLocalRef
    auto localRef = ScopedLocalRef<jobject>(&mockEnv_, mockJObject2);

    // The local reference should NOT be deleted when passed into a ScopedLocalEnv function.
    EXPECT_CALL(mockFunctions_, DeleteLocalRef(&mockEnv_, mockJObject2)).Times(0);

    // Expect the CallObjectMethodV function to be called once with the last parameter unpacked.
    EXPECT_CALL(
      mockFunctions_, CallObjectMethodV(&mockEnv_, mockJObject, mockMethodID, mockJObject2))
      .Times(1);

    // ScopedLocalEnv should unpack any ScopedLocalRef objects passed as variadic parameters.
    scopedLocalEnv.CallObjectMethod<jobject>(mockJObject, mockMethodID, localRef);

    // Verify that the ScopedLocalRef wasn't deleted.
    ::testing::Mock::VerifyAndClearExpectations(&mockFunctions_);

    // The local reference will soon be of scope. Let's verify that it gets deleted.
    EXPECT_CALL(mockFunctions_, DeleteLocalRef(&mockEnv_, mockJObject2)).Times(1);
  }  // The destructor of ScopedLocalRef should call DeleteLocalRef here
}

TEST_F(MockJniTest, NewObjectUnpacksLocalRefs) {
  auto scopedLocalEnv = ScopedLocalEnv(&mockEnv_);

  jmethodID mockMethodID = reinterpret_cast<jmethodID>(0x1111);
  jclass mockClass = reinterpret_cast<jclass>(0x2222);
  jobject mockJObject = reinterpret_cast<jobject>(0x3333);

  {
    // Simulate ScopedLocalRef
    auto localRef = ScopedLocalRef<jobject>(&mockEnv_, mockJObject);

    // The local reference should NOT be deleted when passed into a ScopedLocalEnv function.
    EXPECT_CALL(mockFunctions_, DeleteLocalRef(&mockEnv_, mockJObject)).Times(0);

    // Expect the NewObjectV function to be called once with the last parameter unpacked.
    EXPECT_CALL(mockFunctions_, NewObjectV(&mockEnv_, mockClass, mockMethodID, mockJObject))
      .Times(1);

    // ScopedLocalEnv should unpack any ScopedLocalRef objects passed as variadic parameters.
    scopedLocalEnv.NewObject(mockClass, mockMethodID, localRef);

    // Verify that the ScopedLocalRef wasn't deleted.
    ::testing::Mock::VerifyAndClearExpectations(&mockFunctions_);

    // The local reference will soon be out of scope. Let's verify that it gets deleted.
    EXPECT_CALL(mockFunctions_, DeleteLocalRef(&mockEnv_, mockJObject)).Times(1);
  }  // The destructor of ScopedLocalRef should call DeleteLocalRef here
}

TEST_F(MockJniTest, CallStaticObjectMethodUnpacksLocalRefs) {
  auto scopedLocalEnv = ScopedLocalEnv(&mockEnv_);

  jmethodID mockMethodID = reinterpret_cast<jmethodID>(0x1111);
  jclass mockClass = reinterpret_cast<jclass>(0x2222);
  jobject mockJObject = reinterpret_cast<jobject>(0x3333);

  {
    // Simulate ScopedLocalRef
    auto localRef = ScopedLocalRef<jobject>(&mockEnv_, mockJObject);

    // The local reference should NOT be deleted when passed into a ScopedLocalEnv function.
    EXPECT_CALL(mockFunctions_, DeleteLocalRef(&mockEnv_, mockJObject)).Times(0);

    // Expect the CallStaticObjectMethodV function to be called once with the last parameter
    // unpacked.
    EXPECT_CALL(
      mockFunctions_, CallStaticObjectMethodV(&mockEnv_, mockClass, mockMethodID, mockJObject))
      .Times(1);

    // ScopedLocalEnv should unpack any ScopedLocalRef objects passed as variadic parameters.
    scopedLocalEnv.CallStaticObjectMethod<jobject>(mockClass, mockMethodID, localRef);

    // Verify that the ScopedLocalRef wasn't deleted.
    ::testing::Mock::VerifyAndClearExpectations(&mockFunctions_);

    // The local reference will soon be out of scope. Let's verify that it gets deleted.
    EXPECT_CALL(mockFunctions_, DeleteLocalRef(&mockEnv_, mockJObject)).Times(1);
  }  // The destructor of ScopedLocalRef should call DeleteLocalRef here
}

TEST_F(MockJniTest, CallVoidMethodUnpacksLocalRefs) {
  auto scopedLocalEnv = ScopedLocalEnv(&mockEnv_);

  jmethodID mockMethodID = reinterpret_cast<jmethodID>(0x1111);
  jobject mockJObject = reinterpret_cast<jobject>(0x2222);
  jobject mockJObject2 = reinterpret_cast<jobject>(0x3333);

  {
    // Simulate ScopedLocalRef
    auto localRef = ScopedLocalRef<jobject>(&mockEnv_, mockJObject2);

    // The local reference should NOT be deleted when passed into a ScopedLocalEnv function.
    EXPECT_CALL(mockFunctions_, DeleteLocalRef(&mockEnv_, mockJObject2)).Times(0);

    // Expect the CallVoidMethodV function to be called once with the last parameter unpacked.
    EXPECT_CALL(mockFunctions_, CallVoidMethodV(&mockEnv_, mockJObject, mockMethodID, mockJObject2))
      .Times(1);

    // ScopedLocalEnv should unpack any ScopedLocalRef objects passed as variadic parameters.
    scopedLocalEnv.CallVoidMethod(mockJObject, mockMethodID, localRef);

    // // Verify that the ScopedLocalRef wasn't deleted.
    ::testing::Mock::VerifyAndClearExpectations(&mockFunctions_);

    // The local reference will soon be out of scope. Let's verify that it gets deleted.
    EXPECT_CALL(mockFunctions_, DeleteLocalRef(&mockEnv_, mockJObject2)).Times(1);
  }  // The destructor of ScopedLocalRef should call DeleteLocalRef here
}
