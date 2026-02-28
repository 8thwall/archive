// Copyright (c) 2025 Niantic, Inc.
// Original Author: Yuyan Song (yuyansong@nianticlabs.com)

#include "c8/html-shell/android/android/video-decoder.h"

#include "c8/c8-log.h"
#include "c8/string.h"

namespace {
constexpr int kTimeoutUs = 10000;
}

namespace c8 {

VideoDecoder::~VideoDecoder() { release(); }

void VideoDecoder::release() {
  if (codec_) {
    AMediaCodec_stop(codec_.get());
    codec_.reset();
  }
  format_.reset();
  extractor_.reset();

  imageReader_.reset();

  videoTrackIdx_ = 0;
  videoWidth_ = 0;
  videoHeight_ = 0;
}

int VideoDecoder::selectVideoTrack(AMediaExtractor *extractor) {
  if (!extractor) {
    return -1;
  }

  size_t trackCount = AMediaExtractor_getTrackCount(extractor);

  int videoTrackIdx = -1;
  const char *info;
  for (size_t i = 0; i < trackCount; i++) {
    AMediaFormat *format = AMediaExtractor_getTrackFormat(extractor, i);
    AMediaFormat_getString(format, AMEDIAFORMAT_KEY_MIME, &info);
    AMediaFormat_delete(format);
    String str(info);
    if (str.find("video") == 0) {
      videoTrackIdx = static_cast<int>(i);
      break;
    }
  }
  return videoTrackIdx;
}

bool VideoDecoder::setDataSource(const char *location) {
  release();

  AMediaExtractor *extractor = AMediaExtractor_new();
  if (!extractor) {
    return false;
  }
  extractor_ = std::unique_ptr<AMediaExtractor, media_status_t (*)(AMediaExtractor *)>(
    extractor, &AMediaExtractor_delete);

  media_status_t ret = AMediaExtractor_setDataSource(extractor_.get(), location);
  if (ret < 0) {
    release();
    return false;
  }

  int vidTrackIdx = selectVideoTrack(extractor_.get());
  if (vidTrackIdx < 0) {
    C8Log("[video-decoder] Invalid video stream at %s", location);
    release();
    return false;
  }
  videoTrackIdx_ = static_cast<size_t>(vidTrackIdx);
  AMediaFormat *format = AMediaExtractor_getTrackFormat(extractor_.get(), videoTrackIdx_);
  format_ =
    std::unique_ptr<AMediaFormat, media_status_t (*)(AMediaFormat *)>(format, &AMediaFormat_delete);
  AMediaExtractor_selectTrack(extractor_.get(), videoTrackIdx_);

  // Get video width and height.
  const bool isWOk = AMediaFormat_getSize(format_.get(), AMEDIAFORMAT_KEY_WIDTH, &videoWidth_);
  const bool isHOk = AMediaFormat_getSize(format_.get(), AMEDIAFORMAT_KEY_HEIGHT, &videoHeight_);
  if (!isWOk || !isHOk) {
    C8Log("[video-decoder] Failed to get video width and height.");
    release();
    return false;
  }

  // Create image reader for the codec to render to.
  if (outputVideoWidth_ == 0 || outputVideoHeight_ == 0) {
    outputVideoWidth_ = videoWidth_;
    outputVideoHeight_ = videoHeight_;
  }
  AImageReader *imgReader;
  ret =
    AImageReader_new(outputVideoWidth_, outputVideoHeight_, AIMAGE_FORMAT_RGBA_8888, 1, &imgReader);
  if (ret != AMEDIA_OK) {
    C8Log("Error when creating image reader return %d.", ret);
    release();
    return false;
  }
  imageReader_ =
    std::unique_ptr<AImageReader, void (*)(AImageReader *)>(imgReader, &AImageReader_delete);

  ANativeWindow *nativeWindow;
  ret = AImageReader_getWindow(imageReader_.get(), &nativeWindow);
  if (ret != AMEDIA_OK) {
    C8Log("Error when getting image reader window return %d.", ret);
    release();
    return false;
  }

  // initialize codec
  const char *info;
  AMediaFormat_getString(format_.get(), AMEDIAFORMAT_KEY_MIME, &info);
  AMediaCodec *codec = AMediaCodec_createDecoderByType(info);
  if (!codec) {
    C8Log("[video-decoder] Failed to create codec for %s.", info);
    release();
    return false;
  }
  codec_ =
    std::unique_ptr<AMediaCodec, media_status_t (*)(AMediaCodec *)>(codec, &AMediaCodec_delete);

  // Do we need this?
  // videoFormat.setInteger(MediaFormat.KEY_COLOR_FORMAT,
  // MediaCodecInfo.CodecCapabilities.COLOR_FormatYUV420Flexible);

  ret = AMediaCodec_configure(codec_.get(), format_.get(), nativeWindow, nullptr, 0);
  if (ret) {
    C8Log("[video-decoder] Error when configure mediacodec decoder, return %d", ret);
    release();
    return false;
  }

  ret = AMediaCodec_start(codec_.get());
  if (ret) {
    C8Log("[video-decoder] Error when start mediacodec decoder, return %d", ret);
    release();
    return false;
  }

  ret = AMediaCodec_flush(codec_.get());
  if (ret != AMEDIA_OK) {
    C8Log("[video-decoder] Error when flush codec. return %d.", ret);
    release();
    return false;
  }
  ret = AMediaExtractor_seekTo(extractor_.get(), 0, AMEDIAEXTRACTOR_SEEK_PREVIOUS_SYNC);
  if (ret != AMEDIA_OK) {
    C8Log("[video-decoder] Error when seek to. return %d.", ret);
    release();
    return false;
  }

  extractorEos_ = false;
  decoderEos_ = false;

  if (autoPlay_) {
    play();
  }

  return true;
}

void VideoDecoder::play() {
  paused_ = false;

  // TODO(yuyan): run decoding loop
}

void VideoDecoder::pause() { paused_ = true; }

bool VideoDecoder::seek(double time) {
  if (!extractor_) {
    return false;
  }

  auto ret = AMediaCodec_flush(codec_.get());
  if (ret != AMEDIA_OK) {
    C8Log("Error when flush codec. return %d.", ret);
    return false;
  }

  ret = AMediaExtractor_seekTo(extractor_.get(), time * 1000000, AMEDIAEXTRACTOR_SEEK_CLOSEST_SYNC);
  if (ret != AMEDIA_OK) {
    C8Log("Error when seek to. return %d.", ret);
    return false;
  }

  return true;
}

}  // namespace c8
