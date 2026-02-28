using System;
using System.Runtime.InteropServices;

namespace XRInternal {

// NOTE: These constants must be kept exactly in sync with its equivalent in xr-extern.h.
public class XREnvironmentConstants {
  public const int RENDERING_SYSTEM_UNSPECIFIED = 0;
  public const int RENDERING_SYSTEM_OPENGL = 1;
  public const int RENDERING_SYSTEM_METAL = 2;
  public const int RENDERING_SYSTEM_DIRECT3D11 = 3;
}

}  // namespace XRInternal
