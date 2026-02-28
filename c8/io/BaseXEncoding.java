package com.the8thwall.c8.io;

import android.util.SparseIntArray;

import java.io.UnsupportedEncodingException;
import java.util.ArrayList;

/**
 * Java implementation of the npm package, "base-x". (https://www.npmjs.com/package/base-x).
 * Provides utilities for encoding and decoding a string into an arbitrary base.
 *
 * The base is determined by the length of the alphabet provided:
 *   e.g. Base 16 -> new BaseXEncoding("0123456789abcdef")
 *        Base 62 -> new BaseXEncoding("0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ")
 */
public class BaseXEncoding {

  private char[] alphabet_;
  private int base_;
  private SparseIntArray alphabetMap_;

  public BaseXEncoding(char[] alphabet) {
    alphabet_ = alphabet;
    base_ = alphabet_.length;
    setupAlphabetMap();
  }

  public BaseXEncoding(String alphabet) {
    this(alphabet.toCharArray());
  }

  private void setupAlphabetMap() {
    alphabetMap_ = new SparseIntArray();
    for (int i = 0; i < alphabet_.length; ++i) {
      char c = alphabet_[i];
      alphabetMap_.put(c, i);
    }
  }

  /**
   * Encodes the provided string into the alphabet / base specified at the time the encoder was created.
   *
   * @param str the string to encode
   * @return the provided string encoded into the {@link BaseXEncoding}'s alphabet
   */
  public String encode(String str) {
    if (str == null || str.length() == 0) {
      return "";
    }

    byte[] source;
    try {
      source = str.getBytes("UTF-8");
      return encode(source);
    } catch (UnsupportedEncodingException e) {
      return "";
    }
  }

  /**
   * Encodes the provided byte array into the alphabet / base specified at the time the encoder was created.
   *
   * @param str the bytes to encode
   * @return the provided bytes encoded into the {@link BaseXEncoding}'s alphabet
   */
  public String encode(byte[] source) {
    if (source == null || source.length == 0) {
      return "";
    }

    ArrayList<Integer> digits = new ArrayList<Integer>();
    digits.add(0);

    int carry = 0;
    for (int i = 0; i < source.length; ++i) {
      // Ensure we set carry to a positive int representing the byte value.
      carry = ((source[i] | 0) & 0xff);
      for (int j = 0; j < digits.size(); ++j) {
        carry += digits.get(j) << 8;
        digits.set(j, (carry % base_));
        carry = (carry / base_) | 0;
      }

      while (carry > 0) {
        digits.add(carry % base_);
        carry = (carry / base_) | 0;
      }
    }

    StringBuilder builder = new StringBuilder();
    for (int i = 0; source[i] == 0 && i < source.length - 1; ++i) {
      builder.append(alphabet_[0]);
    }

    for (int i = digits.size() - 1; i >= 0; --i) {
      builder.append(alphabet_[digits.get(i)]);
    }

    return builder.toString();
  }

  /**
   * Decodes the provided string from the alphabet / base specified at the time the encoder was created.
   * If a character that is not in the encoder's alphabet is encountered, decoding will stop and an empty
   * array will be returned.
   *
   * @param str the string to encode
   * @return the provided string decoded from the {@link BaseXEncoding}'s alphabet
   */
  public byte[] decodeIntoBytes(String str) {
    if (str == null || str.length() == 0) {
      return new byte[0];
    }

    byte[] strBytes;
    try {
      strBytes = str.getBytes("UTF-8");
    } catch (UnsupportedEncodingException e) {
      return new byte[0];
    }

    ArrayList<Byte> bytes = new ArrayList<Byte>();
    bytes.add((byte) 0);
    for (int i = 0; i < strBytes.length; ++i) {
      int value = alphabetMap_.get(strBytes[i], -1);

      if (value == -1) {
        return new byte[0];
      }

      long carry = value;
      for (int j = 0; j < bytes.size(); ++j) {
        carry += ((int) bytes.get(j) & 0xff) * base_;
        byte b = (byte) (carry & 0xff);
        bytes.set(j, b);
        carry >>= 8;
      }

      while (carry > 0) {
        byte b = (byte) (carry & 0xff);
        bytes.add(b);
        carry >>= 8;
      }
    }

    for (int i = 0; strBytes[i] == alphabet_[0] && i < strBytes[i] - 1; ++i) {
      bytes.add((byte) 0);
    }

    byte[] byteArray = new byte[bytes.size()];

    for (int i = 0; i < byteArray.length; ++i) {
      byteArray[i] = bytes.get(bytes.size() - i - 1);
    }

    return byteArray;
  }

  /**
   * Decodes the provided string from the alphabet / base specified at the time the encoder was created.
   * If a character that is not in the encoder's alphabet is encountered, decoding will stop and an empty
   * string will be returned.
   *
   * @param str the string to encode
   * @return the provided string decoded from the {@link BaseXEncoding}'s alphabet
   */
  public String decode(String str) {
    try {
      return new String(decodeIntoBytes(str), "UTF-8");
    } catch (UnsupportedEncodingException e) {
      System.err.println(e.getMessage());
      return "";
    }
  }
}
