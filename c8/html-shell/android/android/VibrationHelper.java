// Copyright (c) 2025 Niantic Spatial, Inc.
// Original Author: Lucas Reyna (lucas@8thwall.com)

package com.the8thwall.htmlshell.android;

import android.content.Context;
import android.os.VibrationEffect;
import android.os.Vibrator;

public class VibrationHelper {
    private static Context appContext;

    public static void init(Context context) {
        appContext = context.getApplicationContext();
    }

    // Called from C++ through JNI
    public static void vibratePattern(long[] pattern, int[] amplitudes, int repeat) {
        if (appContext == null) return;

        // Cancel any ongoing vibration before starting a new one
        cancelVibration();

        Vibrator vibrator = (Vibrator) appContext.getSystemService(Context.VIBRATOR_SERVICE);
        if (vibrator != null) {
            if (android.os.Build.VERSION.SDK_INT >= android.os.Build.VERSION_CODES.O) {
                // For API level 26+, use VibrationEffect.createWaveform
                VibrationEffect effect = VibrationEffect.createWaveform(pattern, amplitudes, repeat);
                vibrator.vibrate(effect);
            } else {
                // For older versions, use the classic vibrate method
                // https://developer.android.com/reference/android/os/Vibrator#vibrate(long%5B%5D,%20int)
                vibrator.vibrate(pattern, repeat);
            }
        }
    }

    public static void cancelVibration() {
        if (appContext == null) {
            return;
        }

        Vibrator vibrator = (Vibrator) appContext.getSystemService(Context.VIBRATOR_SERVICE);
        if (vibrator != null) {
            vibrator.cancel();
        }
    }
}
