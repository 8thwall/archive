package com.the8thwall.c8.io;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;

import static org.junit.Assert.assertArrayEquals;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;

/**
 * Unit tests for {@link BaseXEncoding}.
 */
@RunWith(RobolectricTestRunner.class)
public class BaseXEncodingTest {

  private static String BASE_62_ALPHABET =
    "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

  @Test
  public void testEncodeBase62() {
    BaseXEncoding encoding = new BaseXEncoding(BASE_62_ALPHABET);
    assertEquals("007mJG2Rg", encoding.encode("\u0000\u0000alvin"));
  }

  @Test
  public void testEncodeBase58() {
    BaseXEncoding encoding = new BaseXEncoding(BASE_62_ALPHABET.substring(0, 58));
    assertEquals(
      "75p7uvTyxe3x7duGKxzz8640d8HMw2GlCsPOQIRtREab",
      encoding.encode("if you ain\'t first, you\'re last'"));
  }

  @Test
  public void testEncodeBase16() {
    BaseXEncoding encoding = new BaseXEncoding(BASE_62_ALPHABET.substring(0, 16));
    assertEquals("7368616b6520616e642062616b65", encoding.encode("shake and bake"));
  }

  @Test
  public void testEncodeBase16WithInternationalizedString() {
    BaseXEncoding encoding = new BaseXEncoding(BASE_62_ALPHABET.substring(0, 16));
    assertEquals(
      "636f6d2e746573742ee698a8e5a49ce381aee382b3e383b3e382b5e383bce38388e381afe69c80"
        + "e9ab98e381a7e38197e3819f",
      encoding.encode("com.test.昨夜のコンサートは最高でした"));
    // com.test.The concert last night was terrific
  }

  @Test
  public void testEncodeReturnsEmptyStringOnNullString() {
    BaseXEncoding encoding = new BaseXEncoding(BASE_62_ALPHABET.substring(0, 16));
    assertEquals("", encoding.encode((String) null));
  }

  @Test
  public void testEncodeReturnsEmptyStringOnEmptyString() {
    BaseXEncoding encoding = new BaseXEncoding(BASE_62_ALPHABET.substring(0, 16));
    assertEquals("", encoding.encode(""));
  }

  @Test
  public void testDecodeBase62() {
    BaseXEncoding encoding = new BaseXEncoding(BASE_62_ALPHABET);
    assertEquals("\u0000\u0000alvin", encoding.decode("007mJG2Rg"));
  }

  @Test
  public void testDecodeBase58() {
    BaseXEncoding encoding = new BaseXEncoding(BASE_62_ALPHABET.substring(0, 58));
    assertEquals(
      "if you ain\'t first, you\'re last'",
      encoding.decode("75p7uvTyxe3x7duGKxzz8640d8HMw2GlCsPOQIRtREab"));
  }

  @Test
  public void testDecodeBase16() {
    BaseXEncoding encoding = new BaseXEncoding(BASE_62_ALPHABET.substring(0, 16));
    assertEquals("shake and bake", encoding.decode("7368616b6520616e642062616b65"));
  }

  @Test
  public void testDecodeReturnsEmptyStringOnNullString() {
    BaseXEncoding encoding = new BaseXEncoding(BASE_62_ALPHABET.substring(0, 16));
    assertEquals("", encoding.decode(null));
  }

  @Test
  public void testDecodeReturnsEmptyStringOnEmptyString() {
    BaseXEncoding encoding = new BaseXEncoding(BASE_62_ALPHABET.substring(0, 16));
    assertEquals("", encoding.decode(""));
  }

  @Test
  public void testDecodeReturnsEmptyStringOnInvalidString() {
    BaseXEncoding encoding = new BaseXEncoding(BASE_62_ALPHABET.substring(0, 16));
    assertEquals("", encoding.decode("This contains non-hex values."));
  }
}
