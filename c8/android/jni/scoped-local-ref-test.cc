// Copyright (c) 2024 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":mock-jni-test",
    ":scoped-local-ref",
    "@com_google_googletest//:gtest_main",
  };
  target_compatible_with = {
    "@platforms//os:android",
  };
}
cc_end(0xf33681d2);

#include <gmock/gmock.h>
#include <gtest/gtest.h>
#include <jni.h>

#include "c8/android/jni/mock-jni-test.h"
#include "c8/android/jni/scoped-local-ref.h"

using namespace c8;

// Unit tests for ScopedLocalRef
TEST_F(MockJniTest, DeletesLocalRefOnDestruction) {
  // Simulate a non-null jobject
  jobject mockJObject = reinterpret_cast<jobject>(0x1234);

  // Expect DeleteLocalRef to be called once when the ScopedLocalRef goes out of scope
  EXPECT_CALL(mockFunctions_, DeleteLocalRef(&mockEnv_, mockJObject)).Times(1);

  {
    ScopedLocalRef<jobject> scopedRef(&mockEnv_, mockJObject);
  }  // The destructor of ScopedLocalRef should call DeleteLocalRef here
}

TEST_F(MockJniTest, NoDeleteLocalRefWhenNullptr) {
  jobject nullJObject = nullptr;  // Simulate a null jobject

  // Expect DeleteLocalRef to NOT be called because the jobject is null
  EXPECT_CALL(mockFunctions_, DeleteLocalRef(&mockEnv_, nullJObject)).Times(0);

  {
    ScopedLocalRef<jobject> scopedRef(&mockEnv_, nullJObject);
  }  // Destructor should not call DeleteLocalRef since the jobject is null
}

TEST_F(MockJniTest, GetReturnsCorrectLocalRef) {
  jobject mockJObject = reinterpret_cast<jobject>(0x5678);  // Simulate a valid jobject

  ScopedLocalRef<jobject> scopedRef(&mockEnv_, mockJObject);

  // Check that get() returns the correct jobject
  ASSERT_EQ(scopedRef.get(), mockJObject);
}
