// Copyright (c) 2017 8th Wall, Inc.
// Original Author: Nicholas Butko (nb@8thwall.com)

#include "bzl/inliner/rules2.h"

cc_library {
  hdrs = {
    "capnpbin-reader.h",
  };
  deps = {
    ":log-record-reader",
    "//c8/io:capnp-messages",
    "//c8:c8-log",
  };
}
cc_end(0x78bb1d0a);

#include "reality/quality/visualization/protolog/capnpbin-reader.h"

#include <fcntl.h>
#include <string>

#ifdef _WIN32
#include <io.h>
#include <stdio.h>
#include <sys/stat.h>
#else
#include <unistd.h>
#endif

namespace {
#ifdef _WIN32
typedef int mode_t;
constexpr auto &fcntl_open = _open;
#define STDIN_FILENO _fileno(stdin)
#define S_IREAD _S_IREAD
#define S_IRUSR static_cast<mode_t>(_S_IREAD)
#else
constexpr auto &fcntl_open = ::open;
#endif

const std::string PACKED_BINARY_EXT = ".pbin";

}  // namespace

namespace c8 {

CapnpbinReader *CapnpbinReader::open(const char *logfile) {
  // If the input is null or empty, read from stdin.
  if (logfile == nullptr || logfile[0] == static_cast<char>(0)) {
    return new CapnpbinReader(STDIN_FILENO);
  }

  int fd = fcntl_open(logfile, O_RDONLY, S_IRUSR);
  if (fd < 0) {
    return nullptr;
  }

  auto reader = new CapnpbinReader(fd);

  // does this file end with .pbin? Mark it for reading as a packed message
  std::string logFileName(logfile);
  if (0 == logFileName.compare(logFileName.length() - PACKED_BINARY_EXT.length(),
    PACKED_BINARY_EXT.length(), PACKED_BINARY_EXT)) {
      reader->isPackedMessage_ = true;
    }

  return reader;
}

CapnpbinReader::CapnpbinReader(int fd_) : fdstream(kj::AutoCloseFd(fd_)), stream(fdstream) {}

}  // namespace c8
