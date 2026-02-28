package com.the8thwall.reality.app.device;

import com.the8thwall.c8.annotations.VisibleForTesting;
import com.the8thwall.c8.io.ByteBufferChannel;
import com.the8thwall.reality.engine.api.device.Info.DeviceInfo;

import android.os.Build;
import android.content.Context;

import org.capnproto.ArrayOutputStream;
import org.capnproto.MessageBuilder;
import org.capnproto.MessageReader;
import org.capnproto.Serialize;

import java.io.IOException;
import java.nio.ByteBuffer;

/**
 * Class which provides infomation on the current device.
 *
 * TODO(alvin): Should probably rename this now that the {@link AndroidDevice} interface exists.
 */
public class AndroidDeviceInfo {

  private static AndroidDeviceInfo defaultInfo_ = null;

  private final AndroidDevice device_;

  /**
   * Returns an {@link AndroidDeviceInfo} using the {@link AndroidDeviceImpl} class to provide
   * the device information.
   */
  public static AndroidDeviceInfo getDefault() {
    if (defaultInfo_ == null) {
      defaultInfo_ = new AndroidDeviceInfo(new AndroidDeviceImpl());
    }
    return defaultInfo_;
  }

  public AndroidDeviceInfo(AndroidDevice device) { device_ = device; }

  /**
   * Returns a {@link ByteBuffer} representing the {@link DeviceInfo} struct containing
   * information of the current device.
   * @param context the current AndroidContext
   */
  public ByteBuffer getDeviceInfoBytes() {
    MessageBuilder infoMessage = new MessageBuilder();
    DeviceInfo.Builder infoBuilder = infoMessage.initRoot(DeviceInfo.factory);
    exportInfo(infoBuilder);

    ByteBuffer directInfoBuffer = ByteBuffer.allocateDirect(
      (int)Serialize.computeSerializedSizeInWords(infoMessage)
      * 8 /* org.capnproto.Constants.BYTES_PER_WORD */);

    try {
      Serialize.write(ByteBufferChannel.wrap(directInfoBuffer), infoMessage);
    } catch (IOException e) {
      throw new RuntimeException(e);
    }

    return directInfoBuffer;
  }

  /**
   * Exports information about the currently running device to the provided
   * {@link DeviceInfo.Builder}.
   * @param infoBuilder the builder to write device information to
   */
  public void exportInfo(DeviceInfo.Builder infoBuilder) {
    infoBuilder.setManufacturer(device_.getManufacturer());
    infoBuilder.setModel(device_.getModel());
    infoBuilder.setOs(device_.getOs());
    infoBuilder.setOsVersion(device_.getOsVersion());
  }
}
