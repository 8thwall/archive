# This is a configuration file for ProGuard.
# http://proguard.sourceforge.net/index.html#manual/usage.html

# Dummy activity used when generating XR AAR. Ignore notes for this.
-dontnote com.the8thwall.bzl.hellobuild.android.MainActivity

-dontnote com.the8thwall.reality.engine.api.Reality$XrQueryRequest$Reader
-dontnote com.the8thwall.reality.engine.api.Reality$XRConfiguration$Reader
-dontnote com.the8thwall.reality.app.xr.common.XRExtern$XRConfiguration
-dontnote com.the8thwall.reality.app.xr.common.XRExtern$XREnvironment
-dontnote com.the8thwall.reality.app.xr.common.XRExtern$XRRemote
-dontnote com.the8thwall.reality.app.xr.common.XRExtern$XRResponse$Builder

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

# Remove debug logs. Keep warning and error levels though.
-assumenosideeffects class android.util.Log {
    public static int v(...);
    public static int i(...);
    public static int d(...);
}

 -flattenpackagehierarchy "com.the8thwall"

-dontnote android.support.**
-dontnote com.google.atap.**

##
# Useful defaults provided by proguard files in the Android SDK.
# DO NOT ADD RULES BELOW THIS. Any custom XR rules should go above this.
##

-keepattributes *Annotation*
#-keep public class com.google.vending.licensing.ILicensingService
#-keep public class com.android.vending.licensing.ILicensingService

# For native methods, see http://proguard.sourceforge.net/manual/examples.html#native
-keepclasseswithmembernames class * {
    native <methods>;
}

# keep setters in Views so that animations can still work.
# see http://proguard.sourceforge.net/manual/examples.html#beans
-keepclassmembers public class * extends android.view.View {
   void set*(***);
   *** get*();
}

# We want to keep methods in Activity that could be used in the XML attribute onClick
-keepclassmembers class * extends android.app.Activity {
   public void *(android.view.View);
}

# For enumeration classes, see http://proguard.sourceforge.net/manual/examples.html#enumerations
-keepclassmembers enum * {
    public static **[] values();
    public static ** valueOf(java.lang.String);
}

-keepclassmembers class * implements android.os.Parcelable {
  public static final android.os.Parcelable$Creator CREATOR;
}

-keepclassmembers class **.R$* {
    public static <fields>;
}

# The support library contains references to newer platform versions.
# Don't warn about those in case this app is linking against an older
# platform version.  We know about them, and they are safe.
-dontwarn android.support.**

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

-dontnote com.google.ar.core.*
-dontnote com.google.vr.dynamite.client.*
