package com.the8thwall.c8.io;

import java.lang.Math;
import java.nio.ByteBuffer;
import java.nio.channels.ReadableByteChannel;
import java.nio.channels.WritableByteChannel;

/**
 * A {@link ReadableByteChannel} and {@link WritableByteChannel} backed by a {@link ByteBuffer}.
 */
public class ByteBufferChannel implements ReadableByteChannel, WritableByteChannel {

  private final ByteBuffer wrapped;

  @Override
  public void close() {
    // NO-OP
  }

  @Override
  public boolean isOpen() {
    return true;
  }

  @Override
  public int read(ByteBuffer dest) {
    int len = Math.min(dest.remaining(), wrapped.remaining());
    while (dest.remaining() > 0 && wrapped.remaining() > 0) {
      dest.put(wrapped.get());
    }
    return len;
  }

  @Override
  public int write(ByteBuffer src) {
    int len = src.remaining();
    wrapped.put(src);
    return len;
  }

  private ByteBufferChannel(ByteBuffer toWrap) {
    toWrap.rewind();
    wrapped = toWrap;
  }

  /**
   * Creates a {@link ByteBufferChannel} from the given {@link ByteBuffer}. This {@link ByteBuffer}
   * is used as the destination buffer on calls to {@link #write(ByteBuffer)}, and the source
   * buffer on calls to {@link #read(ByteBuffer)}.
   * @param toWrap the {@link ByteBuffer} to use as the destination for this channel
   * @return a {@link ByteBufferChannel} which uses a ByteBuffer as its backing store
   */
  public static ByteBufferChannel wrap(ByteBuffer toWrap) {
    return new ByteBufferChannel(toWrap);
  }
}
