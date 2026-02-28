// Copyright (c) 2025 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#include <gmock/gmock.h>
#include <gtest/gtest.h>
#include <jni.h>

namespace {
class MockJniFunctions {
public:
  MOCK_METHOD(void, DeleteLocalRef, (JNIEnv * env, jobject obj));
  MOCK_METHOD(
    jobject, CallObjectMethodV, (JNIEnv * env, jobject obj, jmethodID methodId, jobject obj2));
  MOCK_METHOD(jobject, NewObjectV, (JNIEnv * env, jclass clazz, jmethodID methodId, jobject obj));
  MOCK_METHOD(
    jobject,
    CallStaticObjectMethodV,
    (JNIEnv * env, jclass clazz, jmethodID methodId, jobject obj));
  MOCK_METHOD(void, CallVoidMethodV, (JNIEnv * env, jobject obj, jmethodID methodId, jobject obj2));
};

static MockJniFunctions *mockJniFunctions = nullptr;

static void MockDeleteLocalRef(JNIEnv *env, jobject obj) {
  if (mockJniFunctions) {
    mockJniFunctions->DeleteLocalRef(env, obj);
  } else {
    FAIL() << "MockJniFunctions not set up";
  }
}

static jobject MockCallObjectMethodV(JNIEnv *env, jobject obj, jmethodID methodId, va_list args) {
  if (mockJniFunctions) {
    auto obj2 = va_arg(args, jobject);
    jobject result = mockJniFunctions->CallObjectMethodV(env, obj, methodId, obj2);
    return result;
  } else {
    return nullptr;
  }
}

static jobject MockNewObjectV(JNIEnv *env, jclass clazz, jmethodID methodId, va_list args) {
  if (mockJniFunctions) {
    auto obj = va_arg(args, jobject);
    jobject result = mockJniFunctions->NewObjectV(env, clazz, methodId, obj);
    return result;
  } else {
    return nullptr;
  }
}

static jobject MockCallStaticObjectMethodV(
  JNIEnv *env, jclass clazz, jmethodID methodId, va_list args) {
  if (mockJniFunctions) {
    auto obj = va_arg(args, jobject);
    jobject result = mockJniFunctions->CallStaticObjectMethodV(env, clazz, methodId, obj);
    return result;
  } else {
    return nullptr;
  }
}

static void MockCallVoidMethodV(JNIEnv *env, jobject obj, jmethodID methodId, va_list args) {
  std::cout << "Hello world!!";
  if (mockJniFunctions) {
    auto obj2 = va_arg(args, jobject);
    mockJniFunctions->CallVoidMethodV(env, obj, methodId, obj2);
  } else {
    FAIL() << "MockJniFunctions not set up";
  }
}

static struct JNINativeInterface mockNativeInterface;

struct MockJniEnv : JNIEnv {
  MockJniEnv() {
    // Assign mock functions.
    mockNativeInterface.DeleteLocalRef = &MockDeleteLocalRef;
    mockNativeInterface.CallObjectMethodV = &MockCallObjectMethodV;
    mockNativeInterface.NewObjectV = &MockNewObjectV;
    mockNativeInterface.CallStaticObjectMethodV = &MockCallStaticObjectMethodV;
    mockNativeInterface.CallVoidMethodV = &MockCallVoidMethodV;
    functions = &mockNativeInterface;
  }
};
}  // namespace

class MockJniTest : public ::testing::Test {
protected:
  MockJniEnv mockEnv_;
  MockJniFunctions mockFunctions_;

  void SetUp() override { mockJniFunctions = &mockFunctions_; }

  void TearDown() override { mockJniFunctions = nullptr; }
};
