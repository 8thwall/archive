// Copyright (c) 2024 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":concurrent-queue",
    "//c8:vector",
    "@com_google_googletest//:gtest_main",
  };
}
cc_end(0x44968922);

#include <chrono>
#include <future>
#include <numeric>

#include "c8/concurrent/concurrent-queue.h"
#include "c8/vector.h"
#include "gtest/gtest.h"

using namespace std::chrono_literals;

namespace c8 {

class ConcurrentQueueTest : public ::testing::Test {};

TEST_F(ConcurrentQueueTest, TestQueue) {
  ConcurrentQueue<int> queue;
  int readValue = -1;
  EXPECT_FALSE(queue.shift(readValue));

  queue.push(1);
  EXPECT_TRUE(queue.shift(readValue));
  EXPECT_EQ(1, readValue);
  EXPECT_FALSE(queue.shift(readValue));

  queue.push(2);
  queue.push(3);
  EXPECT_TRUE(queue.shift(readValue));
  EXPECT_EQ(2, readValue);
  EXPECT_TRUE(queue.shift(readValue));
  EXPECT_EQ(3, readValue);
  EXPECT_FALSE(queue.shift(readValue));
}

TEST_F(ConcurrentQueueTest, TestQueueMultiThread) {
  ConcurrentQueue<int> queue;

  std::future<void> f = std::async(std::launch::async, [&queue]() {
    for (int i = 0; i < 10000; i++) {
      queue.push(i);
    }
  });

  int expected = 0;
  int value;
  while (f.wait_for(0ms) != std::future_status::ready) {
    while (queue.shift(value)) {
      EXPECT_EQ(expected++, value);
    }
  }
  while (queue.shift(value)) {
    EXPECT_EQ(expected++, value);
  }

  EXPECT_EQ(10000, expected);
}

TEST_F(ConcurrentQueueTest, TestQueueMultiPush) {
  ConcurrentQueue<int> queue;

  std::future<void> f = std::async(std::launch::async, [&queue]() {
    for (int i = 0; i < 10; i++) {
      Vector<int> traunch(1000);
      std::iota(traunch.begin(), traunch.end(), i * 1000);
      queue.push(traunch.begin(), traunch.end());
    }
  });

  int expected = 0;
  int value;
  while (f.wait_for(0ms) != std::future_status::ready) {
    while (queue.shift(value)) {
      EXPECT_EQ(expected++, value);
    }
  }
  while (queue.shift(value)) {
    EXPECT_EQ(expected++, value);
  }
  EXPECT_EQ(10000, expected);
}

TEST_F(ConcurrentQueueTest, TestQueueDrain) {
  ConcurrentQueue<int> queue;

  std::future<void> f = std::async(std::launch::async, [&queue]() {
    for (int i = 0; i < 1000; i++) {
      Vector<int> traunch(10);
      std::iota(traunch.begin(), traunch.end(), i * 10);
      queue.push(traunch.begin(), traunch.end());
    }
  });

  int expected = 0;
  Vector<int> values;
  while (f.wait_for(0ms) != std::future_status::ready) {
    queue.drain(values);
    for (const auto &value : values) {
      EXPECT_EQ(expected++, value);
    }
  }
  queue.drain(values);
  for (const auto &value : values) {
    EXPECT_EQ(expected++, value);
  }
  EXPECT_EQ(10000, expected);
}

}  // namespace c8
