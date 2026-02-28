package com.the8thwall.c8.io;

import java.nio.BufferOverflowException;
import java.nio.ByteBuffer;

import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Unit tests for {@link ByteBufferChannel}.
 */
public class ByteBufferChannelTest {

  private static final int DEFAULT_BUFFER_SIZE = 100;

  private ByteBuffer mByteBuffer;
  private ByteBufferChannel mByteBufferChannel;

  @Before
  public void setup() {
    mByteBuffer = ByteBuffer.allocate(DEFAULT_BUFFER_SIZE);
    mByteBufferChannel = ByteBufferChannel.wrap(mByteBuffer);
  }

  @Test
  public void testWriteBufferData() {
    ByteBuffer src = createFilledByteBuffer(DEFAULT_BUFFER_SIZE);
    mByteBufferChannel.write(src);
    assertEquals(src.hasArray(), mByteBuffer.hasArray());
    assertArrayEquals(
      "Source array does not equal destination array",
      src.array(),
      mByteBuffer.array());
  }

  @Test
  public void testWriteLength() {
    ByteBuffer src = ByteBuffer.allocate(DEFAULT_BUFFER_SIZE);
    src.position(10);
    assertEquals(DEFAULT_BUFFER_SIZE - 10, mByteBufferChannel.write(src));
  }

  @Test
  public void testReadLengthSmallerDest() {
    fillByteBuffer(mByteBuffer, DEFAULT_BUFFER_SIZE);
    ByteBuffer dest = ByteBuffer.allocate(DEFAULT_BUFFER_SIZE - 10);
    assertEquals(DEFAULT_BUFFER_SIZE - 10, mByteBufferChannel.read(dest));
  }

  @Test
  public void testReadLengthLargerDest() {
    fillByteBuffer(mByteBuffer, DEFAULT_BUFFER_SIZE);
    ByteBuffer dest = ByteBuffer.allocate(DEFAULT_BUFFER_SIZE + 10);
    assertEquals(DEFAULT_BUFFER_SIZE, mByteBufferChannel.read(dest));
  }

  @Test
  public void testReadBufferData() {
    fillByteBuffer(mByteBuffer, DEFAULT_BUFFER_SIZE);
    ByteBuffer dest = ByteBuffer.allocate(DEFAULT_BUFFER_SIZE);
    mByteBufferChannel.read(dest);
    assertEquals(dest.hasArray(), mByteBuffer.hasArray());
    assertArrayEquals(
      "Destination array does not equal source array",
      dest.array(),
      mByteBuffer.array());
  }

  @Test(expected = BufferOverflowException.class)
  public void testThrowBufferOverflowWhenSourceTooLarge() {
    mByteBufferChannel.write(ByteBuffer.allocate(DEFAULT_BUFFER_SIZE + 1));
  }

  @Test
  public void testChannelOpen() {
    assertTrue(mByteBufferChannel.isOpen());
  }

  private static ByteBuffer createFilledByteBuffer(int capacity) {
    ByteBuffer buffer = ByteBuffer.allocate(capacity);
    fillByteBuffer(buffer, capacity);
    return buffer;
  }

  private static void fillByteBuffer(ByteBuffer buffer, int capacity) {
    for (int i = 0; i < capacity; ++i) {
      buffer.put((byte) i);
    }
    buffer.rewind();
  }
}
