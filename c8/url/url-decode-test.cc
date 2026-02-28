// Copyright (c) 2024 Niantic, Inc.
// Original Author: Alvin Portillo (alvinportillo@nianticlabs.com)

#include "bzl/inliner/rules2.h"

cc_test {
  size = "small";
  deps = {
    ":url-decode",
    "//c8:string",
    "@com_google_googletest//:gtest_main",
  };
}
cc_end(0x7d46a9fe);

#include <gtest/gtest.h>

#include <map>

#include "c8/string.h"
#include "c8/url/url-decode.h"

using namespace c8;

// Unit tests for url-decode.cc
class UrlDecodeTest : public ::testing::Test {
protected:
  std::map<String, String> decodeUrlTestCases = {
    // Basic encoding cases
    {"%20", " "},  // Space encoded as %20
    {"%3A", ":"},  // Colon
    {"%2F", "/"},  // Forward slash
    {"%40", "@"},  // At symbol

    // Special characters
    {"%21", "!"},      // Exclamation mark
    {"%24", "$"},      // Dollar sign
    {"%26", "&"},      // Ampersand
    {"%27", "'"},      // Single quote
    {"%28%29", "()"},  // Parentheses

    // Non-ASCII characters
    {"%C3%A9", "é"},        // UTF-8 for 'é'
    {"%F0%9F%98%81", "😁"},  // Emoji (grinning face with smiling eyes)

    // Reserved characters
    {"%3F", "?"},      // Question mark
    {"%23", "#"},      // Hash/pound
    {"%5B%5D", "[]"},  // Brackets

    // Mixed encoding
    {"Hello%20World%21", "Hello World!"},
    {"%2Fpath%2Fto%3Fid%3D123", "/path/to?id=123"},

    // Edge cases with incomplete encodings
    {"%", "%"},                  // Single percent sign
    {"%A", "%A"},                // Incomplete hex
    {"%E0%A4%A", "\xE0\xA4%A"},  // Incomplete UTF-8 sequence

    // Invalid or redundant encodings
    {"%%20", "% "},    // Redundant percent sign
    {"%2520", "%20"},  // Double encoding

    // Empty input
    {"", ""},  // Empty string remains unchanged

    // Reserved and non-standard sequences
    {"%uD83D%uDE01", "%uD83D%uDE01"},  // Invalid percent encoding (non-standard)

    // Plus signs (decoded as literal +, not space)
    {"a+b+c", "a+b+c"},  // Plus signs (literal +)

    // Valid percent escape followed by regular text
    {"%24andmore", "$andmore"}  // Valid percent escape followed by regular text
  };
};

TEST_F(UrlDecodeTest, EncodedStringCases) {
  for (const auto &[encoded, expected] : decodeUrlTestCases) {
    ASSERT_EQ(urlDecode(encoded), expected);
  }
}

TEST_F(UrlDecodeTest, DecodesUrlWithEncodedCharacters) {
  auto encodedUrl = "https%3A%2F%2Fwww.example.com%3Ftest%3Dtrue%26prod%3Dfalse";
  auto expected = "https://www.example.com?test=true&prod=false";
  ASSERT_EQ(urlDecode(encodedUrl), expected);
}
