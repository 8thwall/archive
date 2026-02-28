package com.the8thwall.c8.io;

import com.the8thwall.c8.io.IoTest.TestStruct;

import java.nio.BufferOverflowException;
import java.nio.ByteBuffer;

import org.capnproto.MessageBuilder;
import org.capnproto.Serialize;
import org.junit.Before;
import org.junit.Test;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Unit tests for {@link C8CapnpSerialize}.
 */
public class C8CapnpSerializeTest {

  private static int TEST_INT = 8;
  private static float TEST_FLOAT = 8.88f;
  private static String TEST_NAME = "C8_Test";

  @Test
  public void testCapnpSerializeAndDeserializeWithByteBuffers() {
    MessageBuilder message = new MessageBuilder();
    TestStruct.Builder builder = message.initRoot(TestStruct.factory);
    builder.setName(TEST_NAME);
    builder.setInt(TEST_INT);
    builder.setFloat(TEST_FLOAT);

    ByteBuffer messageBytes = C8CapnpSerialize.serialize(message);

    assertTrue(messageBytes.isDirect());
    int expectedSize = (int)Serialize.computeSerializedSizeInWords(message)
      * 8 /* org.capnproto.Constants.BYTES_PER_WORD */;
    assertEquals(messageBytes.capacity(), expectedSize);

    TestStruct.Reader reader = C8CapnpSerialize.deserialize(messageBytes, TestStruct.factory);
    assertValidStruct(reader);
  }

  @Test
  public void testCapnpSerializeAndDeserializeWithByteArrays() {
    MessageBuilder message = new MessageBuilder();
    TestStruct.Builder builder = message.initRoot(TestStruct.factory);
    builder.setName(TEST_NAME);
    builder.setInt(TEST_INT);
    builder.setFloat(TEST_FLOAT);

    byte[] messageBytes = C8CapnpSerialize.serializeToBytes(message);

    int expectedSize = (int)Serialize.computeSerializedSizeInWords(message)
      * 8 /* org.capnproto.Constants.BYTES_PER_WORD */;
    assertEquals(messageBytes.length, expectedSize);

    TestStruct.Reader reader = C8CapnpSerialize.deserializeFromBytes(messageBytes, TestStruct.factory);
    assertValidStruct(reader);
  }

  private static void assertValidStruct(TestStruct.Reader reader) {
    assertEquals(reader.getName().toString(), TEST_NAME);
    assertEquals(reader.getInt(), TEST_INT);
    assertEquals(reader.getFloat(), TEST_FLOAT, 0.001f);
  }
}
