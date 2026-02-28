// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#pragma once

#include <media/NdkImageReader.h>
#include <media/NdkMediaCodec.h>
#include <media/NdkMediaExtractor.h>
#include <media/NdkMediaFormat.h>

#include <memory>

namespace c8 {

class VideoDecoder {
public:
  // Default constructor.
  VideoDecoder() = default;

  // Default move constructors.
  VideoDecoder(VideoDecoder &&) = default;
  VideoDecoder &operator=(VideoDecoder &&) = default;

  // Disallow copying.
  VideoDecoder(const VideoDecoder &) = delete;
  VideoDecoder &operator=(const VideoDecoder &) = delete;

  ~VideoDecoder();

  size_t getVideoWidth() const { return videoWidth_; }
  size_t getVideoHeight() const { return videoHeight_; }

  void setOutputVideoWidth(const size_t outputVideoWidth) { outputVideoWidth_ = outputVideoWidth; }
  void setOutputVideoHeight(const size_t outputVideoHeight) {
    outputVideoHeight_ = outputVideoHeight;
  }

  void setLoop(const bool loop) { loop_ = loop; }
  void setAutoPlay(const bool autoPlay) { autoPlay_ = autoPlay; }

  bool setDataSource(const char *location);

  void play();

  void pause();

  // time in seconds.
  bool seek(double time);

private:
  void release();

  int selectVideoTrack(AMediaExtractor *extractor);

  // TODO(yuyan): support multiple tracks.
  std::unique_ptr<AMediaExtractor, media_status_t (*)(AMediaExtractor *)> extractor_;
  std::unique_ptr<AMediaFormat, media_status_t (*)(AMediaFormat *)> format_;
  std::unique_ptr<AMediaCodec, media_status_t (*)(AMediaCodec *)> codec_;

  std::unique_ptr<AImageReader, void (*)(AImageReader *)> imageReader_;

  size_t videoTrackIdx_ = 0;
  size_t videoWidth_ = 0;
  size_t videoHeight_ = 0;

  size_t outputVideoWidth_ = 0;
  size_t outputVideoHeight_ = 0;

  bool autoPlay_ = false;
  bool loop_ = false;
  bool paused_ = false;
  bool ended_ = false;

  bool extractorEos_ = false;
  bool decoderEos_ = false;
};

}  // namespace c8
