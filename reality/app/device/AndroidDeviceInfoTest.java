package com.the8thwall.reality.app.device;

import android.content.Context;
import android.os.Build;

import org.capnproto.MessageBuilder;
import org.capnproto.MessageReader;
import org.capnproto.Serialize;
import org.junit.Before;
import org.junit.Test;
import org.junit.runner.RunWith;
import org.robolectric.RobolectricTestRunner;
import org.robolectric.RuntimeEnvironment;

import java.lang.Class;
import java.lang.reflect.Field;
import java.lang.reflect.Modifier;
import java.nio.ByteBuffer;

import com.the8thwall.c8.io.ByteBufferChannel;
import com.the8thwall.reality.app.device.AndroidDeviceInfo;
import com.the8thwall.reality.engine.api.device.Info.DeviceInfo;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertFalse;

/**
 * Unit tests for {@link AndroidDeviceInfo}.
 */
@RunWith(RobolectricTestRunner.class)
public class AndroidDeviceInfoTest {

  private static final String MANUFACTURER = "8thWall";
  private static final String MODEL = "8thDevice";
  private static final String OPERATING_SYSTEM = "Android";
  private static final String VERSION_RELEASE = "27";

  private AndroidDeviceInfo deviceInfo_;

  @Before
  public void setup() throws Exception {
    deviceInfo_ = new AndroidDeviceInfo(new TestAndroidDevice());
  }

  @Test
  public void testDeviceInfoBytesData() throws Exception {
    ByteBuffer deviceInfoBytes_ = deviceInfo_.getDeviceInfoBytes();
    ByteBufferChannel bufferChannel = ByteBufferChannel.wrap(deviceInfoBytes_);
    DeviceInfo.Reader reader = Serialize.read(bufferChannel).getRoot(DeviceInfo.factory);
    assertDeviceInfo(reader);
  }

  @Test
  public void testExportDeviceInfo() {
    MessageBuilder infoMessage = new MessageBuilder();
    DeviceInfo.Builder infoBuilder = infoMessage.initRoot(DeviceInfo.factory);
    deviceInfo_.exportInfo(infoBuilder);
    DeviceInfo.Reader reader = infoBuilder.asReader();
    assertDeviceInfo(reader);
  }

  private static void assertDeviceInfo(DeviceInfo.Reader reader) {
    assertEquals(reader.getManufacturer().toString(), MANUFACTURER);
    assertEquals(reader.getModel().toString(), MODEL);
    assertEquals(reader.getOs().toString(), OPERATING_SYSTEM);
    assertEquals(reader.getOsVersion().toString(), VERSION_RELEASE);
  }

  static class TestAndroidDevice implements AndroidDevice {
    @Override
    public String getDeviceId(Context context) {
      return "super secure ID";
    }

    @Override
    public String getLocale() {
      return "en_US";
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
      return OPERATING_SYSTEM;
    }

    @Override
    public String getOsVersion() {
      return Integer.toString(Build.VERSION_CODES.O_MR1);
    }
  }
}
