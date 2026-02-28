using UnityEngine;
using UnityEditor;
using UnityEditor.Callbacks;
using System.Collections;
using UnityEditor.iOS.Xcode;
using System.IO;

public class XcodeSettings {

	[PostProcessBuild]
	public static void ModifyPlist(BuildTarget buildTarget, string pathToBuiltProject) {

		if (buildTarget == BuildTarget.iOS) {
			string plistPath = pathToBuiltProject + "/Info.plist";
			PlistDocument plist = new PlistDocument();
			plist.ReadFromString(File.ReadAllText(plistPath));

			PlistElementDict rootDict = plist.root;

			// Set Camera Usage Description to allow camera access.
			rootDict.SetString("NSCameraUsageDescription", "Needed to see the physical world");

			// Write to file
			File.WriteAllText(plistPath, plist.WriteToString());

			string projPath = pathToBuiltProject + "/Unity-iPhone.xcodeproj/project.pbxproj";
			PBXProject proj = new PBXProject();
			proj.ReadFromFile(projPath);
			#if UNITY_2019_3_OR_NEWER
			string unityTarget = proj.GetUnityMainTargetGuid();
			#else
			string unityTarget = proj.TargetGuidByName("Unity-iPhone");
			#endif
			proj.SetBuildProperty(unityTarget, "GCC_ENABLE_OBJC_EXCEPTIONS", "YES");
			proj.WriteToFile(projPath);
		}
	}
}
