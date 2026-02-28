package com.the8thwall.c8.io;

import java.io.IOException;
import java.nio.ByteBuffer;

import org.capnproto.FromPointerReader;
import org.capnproto.MessageBuilder;
import org.capnproto.Serialize;

/**
 * Helper class for serializing + deserializing Cap'n Proto structs.
 */
public class C8CapnpSerialize {

  /**
   * Serializes the given {@link MessageBuilder} and returns a direct {@link ByteBuffer}
   * containing the serialized struct data.
   *
   * @param message the {@link MessageBuilder} to serialize
   */
  public static ByteBuffer serialize(MessageBuilder message) {
    ByteBuffer directMessageBuffer = ByteBuffer.allocateDirect(
      (int)Serialize.computeSerializedSizeInWords(message)
      * 8 /* org.capnproto.Constants.BYTES_PER_WORD */);

    try {
      Serialize.write(ByteBufferChannel.wrap(directMessageBuffer), message);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }

    directMessageBuffer.rewind();
    return directMessageBuffer;
  }

  /**
   * Serializes the given {@link MessageBuilder} and returns a direct {@link ByteBuffer}
   * containing the serialized struct data.
   *
   * @param message the {@link MessageBuilder} to serialize
   */
  public static byte[] serializeToBytes(MessageBuilder message) {
    byte[] bytes = new byte[(int)Serialize.computeSerializedSizeInWords(message) * 8];

    try {
      Serialize.write(ByteBufferChannel.wrap(ByteBuffer.wrap(bytes)), message);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }

    return bytes;
  }

  /**
   * Deserializes a serialized Cap'n Proto struct and constructs a reader given the provided
   * factory.
   *
   * @param buffer the serialized capnp struct
   * @param factory the factory used to determine the type of reader to parse the struct as
   */
  public static <T> T deserialize(ByteBuffer buffer, FromPointerReader<T> factory) {
    try {
      return Serialize.read(buffer).getRoot(factory);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }

    /**
   * Deserializes a serialized Cap'n Proto struct and constructs a reader given the provided
   * factory.
   *
   * @param bytes the serialized capnp struct
   * @param factory the factory used to determine the type of reader to parse the struct as
   */
  public static <T> T deserializeFromBytes(byte[] bytes, FromPointerReader<T> factory) {
    try {
      return Serialize.read(ByteBufferChannel.wrap(ByteBuffer.wrap(bytes))).getRoot(factory);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }
  }
}
