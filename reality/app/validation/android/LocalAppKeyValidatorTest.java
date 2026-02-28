package com.the8thwall.reality.app.validation.android;

import com.the8thwall.c8.protolog.api.LogRequest.AppLogRecordHeader.MobileAppKeyStatus;
import com.the8thwall.c8.exceptions.IllegalMobileAppKeyException;

import android.content.Context;

import java.util.HashMap;

import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;

import static org.junit.Assert.assertTrue;
import static org.junit.Assert.assertFalse;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link LocalAppKeyValidator}.
 */
@RunWith(RobolectricTestRunner.class)
public class LocalAppKeyValidatorTest {

  private static final String VALID_ENCODED_APP_KEY =
      "wkP9jZ7Am0KZlq5KbpdBZDLNoRN1tvjt7vvj8WPm5ALj" +
      "gUZjEUbZM8iLmZ887toJMJOi98tubjYb3yqtkkNHNtMF2ntlYoReSXb0q5FHIB4G3old3";
  private static final String VALID_APP_PACKAGE_NAME = "com.foo.bar";

  private Context context_;
  private LocalAppKeyValidator validator_;
  private TestKeyStorage storage_;

  @Before
  public void setup() {
    context_ = mock(Context.class);
    storage_ = new TestKeyStorage();
    validator_ = LocalAppKeyValidator.createInstance(context_, storage_);
    when(context_.getPackageName()).thenReturn(VALID_APP_PACKAGE_NAME);
  }

  @Test
  public void testIsValidWithoutEntry() {
    assertFalse(validator_.validateAppKey(VALID_ENCODED_APP_KEY));
  }

  @Test
  public void testIsValidWithUnknownEntry() {
    storage_.setStatus(VALID_ENCODED_APP_KEY, MobileAppKeyStatus.UNKNOWN);
    assertFalse(validator_.validateAppKey(VALID_ENCODED_APP_KEY));
  }

  @Test(expected = IllegalMobileAppKeyException.class)
  public void testValidateWithNullAppKey() {
    validator_.validateAppKey(null);
  }

  @Test(expected = IllegalMobileAppKeyException.class)
  public void testValidateWithEmptyAppKey() {
    validator_.validateAppKey("");
  }

  @Test(expected = IllegalMobileAppKeyException.class)
  public void testIsValidWithServerInvalidEntry() {
    storage_.setStatus(VALID_ENCODED_APP_KEY, MobileAppKeyStatus.SERVER_INVALID);
    validator_.validateAppKey(VALID_ENCODED_APP_KEY);
  }

  @Test(expected = IllegalMobileAppKeyException.class)
  public void testValidateWithEmptyAfterTrimAppKey() {
    validator_.validateAppKey("     ");
  }

  @Test(expected = IllegalMobileAppKeyException.class)
  public void testValidateWithInvalidEncodedKey() {
    validator_.validateAppKey("thisIsntARealKey");
  }

  @Test
  public void testIsValidWithServerValidEntry() {
    storage_.setStatus(VALID_ENCODED_APP_KEY, MobileAppKeyStatus.SERVER_VALID);
    assertTrue(validator_.validateAppKey(VALID_ENCODED_APP_KEY));
  }

  @Test
  public void testIsValidChecksumWithValidKeyAndPackageName() {
    assertTrue(LocalAppKeyValidator.isValidChecksum(VALID_APP_PACKAGE_NAME, VALID_ENCODED_APP_KEY));
  }

  @Test
  public void testIsValidChecksumWithInvalidPackageName() {
    assertFalse(LocalAppKeyValidator.isValidChecksum("com.bogus.name", VALID_ENCODED_APP_KEY));
  }

  @Test
  public void testIsValidChecksumWithInvalidEncodedKey() {
    assertFalse(LocalAppKeyValidator.isValidChecksum(VALID_APP_PACKAGE_NAME, VALID_ENCODED_APP_KEY + "bogus"));
  }

  private static class TestKeyStorage implements AppKeyStatusStorage {

    private HashMap<String, MobileAppKeyStatus> map_;

    public TestKeyStorage() { map_ = new HashMap<>(); }

    public MobileAppKeyStatus getStatus(String appKey) {
      if (!map_.containsKey(appKey)) {
        return MobileAppKeyStatus.UNKNOWN;
      }

      return map_.get(appKey);
    }

    public void setStatus(String appKey, MobileAppKeyStatus status) { map_.put(appKey, status); }
  }
}
