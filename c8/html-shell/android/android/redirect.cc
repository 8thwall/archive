// Copyright (c) 2025 8th Wall, Inc.
// Original Author: Paris Morgan (parismorgan@nianticlabs.com)

#include <pthread.h>
#include <stdio.h>
#include <stdlib.h>
#include <unistd.h>

#include <filesystem>
#include <fstream>
#include <vector>

#include "c8/c8-log.h"

namespace c8 {

namespace {

int stdoutPipe[2];
int stderrPipe[2];
pthread_t stdoutThread;
pthread_t stderrThread;

void redirect(int pipe) {
  ssize_t redirect_size;
  // Big enough buffer to not get logcat linebreaks in the middle of message tests output.
  char buf[10240];
  while ((redirect_size = read(pipe, buf, sizeof buf - 1)) > 0) {
    // __android_log_write will add a new line anyway.
    if (buf[redirect_size - 1] == '\n')
      --redirect_size;
    buf[redirect_size] = 0;
    C8Log("%s", buf);
  }
}

}  // namespace

int redirectStderrStdout() {
  // Set stdout as line buffered.
  // Avoids additional line breaks caused by adb logcat splitting the output.
  setvbuf(stdout, 0, _IOLBF, 0);
  pipe(stdoutPipe);
  dup2(stdoutPipe[1], STDOUT_FILENO);

  // Set stderr as line buffered.
  // Avoids additional line breaks caused by adb logcat splitting the output.
  setvbuf(stderr, 0, _IOLBF, 0);
  pipe(stderrPipe);
  dup2(stderrPipe[1], STDERR_FILENO);

  if (
    pthread_create(
      &stdoutThread,
      0,
      [](void *) -> void * {
        redirect(stdoutPipe[0]);
        return nullptr;
      },
      0)
    == -1) {
    return -1;
  }
  pthread_detach(stdoutThread);

  if (
    pthread_create(
      &stderrThread,
      0,
      [](void *) -> void * {
        redirect(stderrPipe[0]);
        return nullptr;
      },
      0)
    == -1) {
    return -1;
  }
  pthread_detach(stderrThread);

  return 0;
}

}  // namespace c8
