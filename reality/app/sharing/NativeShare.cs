#if UNITY_IOS
using System.Runtime.InteropServices;
using System;
#else
using UnityEngine;
#endif

public static class NativeShare {

  // With user defined subject
  public static void Share(string body, string subject, string url, string mimeType = "image/png") {
#if UNITY_ANDROID
    ShareAndroid(body, subject, url, mimeType);
#elif UNITY_IOS
    ShareIOS(body, subject, url);
#else
    Debug.Log("No sharing set up for this platform.");
#endif
  }

  // Without subject (backwards compatibility for Dreidel)
  public static void Share(string body, string url, string mimeType = "image/png") {
#if UNITY_ANDROID
    ShareAndroid(body, "Hey, can you beat my spin record?", url, mimeType);
#elif UNITY_IOS
    ShareIOS(body, "Hey, can you beat my spin record?", url);
#else
    Debug.Log("No sharing set up for this platform.");
#endif
  }

#if UNITY_ANDROID
  public static void ShareAndroid(string body, string subject, string filePath = null, string mimeType = "image/png",
    bool alwaysPrompt = true, string promptText = "Choose the application to share with") {
    AndroidJavaClass intentClass = new AndroidJavaClass("android.content.Intent");
    AndroidJavaObject intentObject = new AndroidJavaObject("android.content.Intent");
    intentObject.Call<AndroidJavaObject>("setAction", intentClass.GetStatic<string>("ACTION_SEND"));

    // Get the current activity
    AndroidJavaClass unity = new AndroidJavaClass("com.unity3d.player.UnityPlayer");
    AndroidJavaObject currentActivity = unity.GetStatic<AndroidJavaObject>("currentActivity");
    AndroidJavaObject unityContext = currentActivity.Call<AndroidJavaObject>("getApplicationContext");

	  if (filePath != null) {
			string packageName = unityContext.Call<string>("getPackageName");
	    string authority = packageName + ".fileprovider";

			// Use FileProvider in Android N to give us a content:// URL from a File
		  AndroidJavaClass fileProviderClass = new AndroidJavaClass("android.support.v4.content.FileProvider");
		  AndroidJavaObject fileObject = new AndroidJavaObject("java.io.File", filePath);
		  AndroidJavaObject uriObject = fileProviderClass.CallStatic<AndroidJavaObject>("getUriForFile", currentActivity, 
		  	authority, fileObject);

			// attach url
			intentObject.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_STREAM"), uriObject);
	  }

    intentObject.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_TEXT"), body);
    intentObject.Call<AndroidJavaObject>("putExtra", intentClass.GetStatic<string>("EXTRA_SUBJECT"), subject);
    intentObject.Call<AndroidJavaObject>("setType", mimeType);

    if (alwaysPrompt) {
      AndroidJavaObject sharePrompt = intentClass.CallStatic<AndroidJavaObject>("createChooser", intentObject, promptText);
      currentActivity.Call("startActivity", sharePrompt);
    } else {
      // option two WITHOUT chooser:
      currentActivity.Call("startActivity", intentObject);
    }
    
  }
#endif

#if UNITY_IOS
  public struct SocialSharingStruct {
    public string text;
    public string subject;
    public string filePaths;
  }

  [DllImport ("__Internal")] private static extern void showSocialSharing(ref SocialSharingStruct conf);

  public static void ShareIOS(string body, string subject, string url = null) {
    SocialSharingStruct conf = new SocialSharingStruct();
    conf.text = body;
    conf.subject = subject;
    if (url != null) {
      conf.filePaths = url; // semi-colon separated paths
    }

    showSocialSharing(ref conf);
  }
#endif
}
