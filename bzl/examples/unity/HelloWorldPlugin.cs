using UnityEngine;
using System.Runtime.InteropServices;

namespace Niantic {

public class HelloWorldPlugin {

#if UNITY_IOS && !UNITY_EDITOR
  internal const string libraryName = "__Internal";
#else
  internal const string libraryName = "HelloWorldPlugin";
#endif

  // When playing in the Unity Editor
  [DllImport(libraryName)]
  public static extern int c8_exampleIntMethod();

  [DllImport(libraryName)]
  public static extern System.IntPtr c8_exampleStringMethod();

};

};  // namespace NiantiC
