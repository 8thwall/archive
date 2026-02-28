// Copyright (c) 2024 Niantic, Inc.
// Original Author: Nicholas Butko (nbutko@nianticlabs.com)

#pragma once

#include <mutex>
#include <queue>
#include "c8/vector.h"

namespace c8 {

// A concurrent queue that allows for multiple threads to push and pop elements from the queue.
template <typename T>
class ConcurrentQueue {
public:
  ConcurrentQueue() = default;

  // Push a single value onto the queue.
  void push(T value) {
    std::lock_guard<std::mutex> lock(mutex_);
    queue_.push(value);
  }

  // Push multiple values onto the queue at once.
  template<class InputIterator>
  void push(InputIterator first, InputIterator last) {
    std::lock_guard<std::mutex> lock(mutex_);
    for (auto it = first; it != last; ++it) {
      queue_.push(*it);
    }
  }

  // Remove a single value from the front of the queue. Returns true if a value was removed, or
  // false if the queue was empty and nothing could be removed.
  bool shift(T &value) {
    std::lock_guard<std::mutex> lock(mutex_);
    if (queue_.empty()) {
      return false;
    }

    value = queue_.front();
    queue_.pop();
    return true;
  }

  // Read all values from the queue and store them in the provided vector. The queue will be
  // empty after this operation.
  void drain(std::vector<T> &values) {
    std::lock_guard<std::mutex> lock(mutex_);
    values.clear();
    values.reserve(queue_.size());
    while (!queue_.empty()) {
      values.push_back(queue_.front());
      queue_.pop();
    }
  }

private:
  std::mutex mutex_;  // TODO: Replace with a lock-free queue.
  std::queue<T> queue_;
};

}  // namespace c8
