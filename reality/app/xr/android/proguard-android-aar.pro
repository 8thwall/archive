-keep @interface com.the8thwall.c8.annotations.DoNotStrip
-keep @interface com.the8thwall.c8.annotations.UsedByNative
-keep @interface com.the8thwall.c8.annotations.UsedByReflection
-keep @com.the8thwall.c8.annotations.DoNotStrip class * {
  *;
}
-keep @com.the8thwall.c8.annotations.UsedByNative class * {
  public <methods>;
  public final <fields>;
}
-keep @com.the8thwall.c8.annotations.UsedByReflection class * {
  public <methods>;
  public final <fields>;
}
-keepclassmembers class * {
   @com.the8thwall.c8.annotations.DoNotStrip *;
   @com.the8thwall.c8.annotations.UsedByNative *;
   @com.the8thwall.c8.annotations.UsedByReflection *;
}

# Keep ARCore public-facing classes
-keepparameternames

# These are part of the Java <-> native interfaces for ARCore.
-keepclasseswithmembernames,includedescriptorclasses class com.google.ar.** {
    native <methods>;
}

-keep public class com.google.ar.core.** {*;}
-dontwarn androidx.annotation.**
# If you need to build a library on top of arcore_client, and use this library for your project
# Please un-comment this line below.
-keepattributes *Annotation*

-keep class com.google.ar.core.annotations.UsedByNative
-keep @com.google.ar.core.annotations.UsedByNative class *
-keepclassmembers class * {
    @com.google.ar.core.annotations.UsedByNative *;
}

-keep class com.google.ar.core.annotations.UsedByReflection
-keep @com.google.ar.core.annotations.UsedByReflection class *
-keepclassmembers class * {
    @com.google.ar.core.annotations.UsedByReflection *;
}
# Keep Dynamite classes

# .aidl file will be proguarded, we should keep all Aidls.
-keep class com.google.vr.dynamite.client.IObjectWrapper { *; }
-keep class com.google.vr.dynamite.client.ILoadedInstanceCreator { *; }
-keep class com.google.vr.dynamite.client.INativeLibraryLoader { *; }

# Keep annotation files and the file got annotated.
-keep class com.google.vr.dynamite.client.UsedByNative
-keep @com.google.vr.dynamite.client.UsedByNative class *
-keepclassmembers class * {
    @com.google.vr.dynamite.client.UsedByNative *;
}

-keep class com.google.vr.dynamite.client.UsedByReflection
-keep @com.google.vr.dynamite.client.UsedByReflection class *
-keepclassmembers class * {
    @com.google.vr.dynamite.client.UsedByReflection *;
}
