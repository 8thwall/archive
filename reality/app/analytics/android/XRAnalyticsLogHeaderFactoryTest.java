package com.the8thwall.reality.app.analytics.android;

import android.content.Context;
import android.content.SharedPreferences;

import com.the8thwall.c8.protolog.api.LogRequest.AppLogRecordHeader;
import com.the8thwall.c8.protolog.api.LogRequest.DeviceLogRecordHeader;
import com.the8thwall.c8.protolog.api.LogRequest.LogRecordHeader;
import com.the8thwall.c8.protolog.api.LogRequest.RealityEngineLogRecordHeader;
import com.the8thwall.reality.app.analytics.android.XRAnalyticsLogHeaderFactory;
import com.the8thwall.reality.app.device.AndroidDevice;
import com.the8thwall.reality.app.device.AndroidDeviceInfo;
import com.the8thwall.reality.engine.api.device.Info.DeviceInfo;

import org.capnproto.MessageBuilder;
import org.capnproto.MessageReader;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;

import static org.junit.Assert.assertEquals;
import static org.mockito.Matchers.anyInt;
import static org.mockito.Matchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.when;

/**
 * Unit tests for {@link XRAnalyticsLogHeaderFactory};
 */
@RunWith(RobolectricTestRunner.class)
public class XRAnalyticsLogHeaderFactoryTest {

  private static final String APP_KEY = "<REMOVED_BEFORE_OPEN_SOURCING>";
  private static final String DEVICE_ID = "$up3r-$3cr3t-ID";
  private static final String LOCALE = "en_UK";
  private static final String MANUFACTURER = "8th Wall";
  private static final String MODEL = "Phone 8.0";
  private static final String OS = "OS8";
  private static final String OS_VERSION = "8";
  private static final String PACKAGE_NAME = "com.the8thwall.HelloTest";

  private Context context_;
  private XRAnalyticsLogHeaderFactory factory_;

  @Before
  public void setup() {
    AndroidDevice device = new TestAndroidDevice();
    factory_ = new XRAnalyticsLogHeaderFactory(device, new AndroidDeviceInfo(device));
    context_ = mock(Context.class);
    SharedPreferences sharedPrefs = RuntimeEnvironment.application.getSharedPreferences(
      "com.the8thwall.sharedPrefs", Context.MODE_PRIVATE);
    when(context_.getSharedPreferences(anyString(), anyInt()))
      .thenReturn(sharedPrefs);

  }

  @Test
  public void testExportLogHeaderInfo() {
    when(context_.getPackageName()).thenReturn(PACKAGE_NAME);
    MessageBuilder headerMessage = new MessageBuilder();
    LogRecordHeader.Builder headerBuilder = headerMessage.initRoot(LogRecordHeader.factory);

    factory_.exportLogHeaderInfo(
      context_, RealityEngineLogRecordHeader.EngineType.C8, APP_KEY, headerBuilder);

    LogRecordHeader.Reader reader = headerBuilder.asReader();

    assertAppHeader(reader.getApp());
    assertDeviceHeader(reader.getDevice());
    assertEngineHeader(reader.getReality(), RealityEngineLogRecordHeader.EngineType.C8);
  }

  @Test
  public void testCreateLogRecordInfo() {
    when(context_.getPackageName()).thenReturn(PACKAGE_NAME);

    LogRecordHeader.Reader reader =
      factory_.createLogRecordInfo(context_, RealityEngineLogRecordHeader.EngineType.ARCORE, APP_KEY);

    assertAppHeader(reader.getApp());
    assertDeviceHeader(reader.getDevice());
    assertEngineHeader(reader.getReality(), RealityEngineLogRecordHeader.EngineType.ARCORE);
  }

  private void assertAppHeader(AppLogRecordHeader.Reader reader) {
    assertEquals(reader.getAppId().toString(), PACKAGE_NAME);
    assertEquals(reader.getMobileAppKey().toString(), APP_KEY);
  }

  private void assertDeviceHeader(DeviceLogRecordHeader.Reader reader) {
    assertEquals(reader.getDeviceId().toString(), DEVICE_ID);
    assertEquals(reader.getLocale().toString(), LOCALE);
    assertEquals(
      reader.getIdForVendor().toString(),
      XRAnalyticsLogHeaderFactory.createIdForVendor(PACKAGE_NAME, DEVICE_ID));

    DeviceInfo.Reader infoReader = reader.getDeviceInfo();
    assertEquals(infoReader.getManufacturer().toString(), MANUFACTURER);
    assertEquals(infoReader.getModel().toString(), MODEL);
    assertEquals(infoReader.getOs().toString(), OS);
    assertEquals(infoReader.getOsVersion().toString(), OS_VERSION);
  }

  private void assertEngineHeader(
    RealityEngineLogRecordHeader.Reader reader,
    RealityEngineLogRecordHeader.EngineType engineType) {
    assertEquals(reader.getEngineId(), engineType);
  }

  @Test
  public void testGetVendorNameFromPackageNameNullName() {
    String vendorName = XRAnalyticsLogHeaderFactory.getVendorNameFromPackageName(null);
    assertEquals(vendorName, "");
  }

  @Test
  public void testGetVendorNameFromPackageNameEmptyName() {
    String vendorName = XRAnalyticsLogHeaderFactory.getVendorNameFromPackageName("");
    assertEquals(vendorName, "");
  }

  @Test
  public void testGetVendorNameFromPackageNameOnePart() {
    String vendorName = XRAnalyticsLogHeaderFactory.getVendorNameFromPackageName("alvin");
    assertEquals(vendorName, "alvin");
  }

  @Test
  public void testGetVendorNameFromPackageNameMultiPart() {
    String vendorName =
      XRAnalyticsLogHeaderFactory.getVendorNameFromPackageName("com.the8thwall.alvin");
    assertEquals(vendorName, "com.the8thwall");
  }

  static class TestAndroidDevice implements AndroidDevice {
    @Override
    public String getDeviceId(Context context) {
      return DEVICE_ID;
    }

    @Override
    public String getLocale() {
      return LOCALE;
    }

    @Override
    public String getManufacturer() {
      return MANUFACTURER;
    }

    @Override
    public String getModel() {
      return MODEL;
    }

    @Override
    public String getOs() {
      return OS;
    }

    @Override
    public String getOsVersion() {
      return OS_VERSION;
    }
  }
}
