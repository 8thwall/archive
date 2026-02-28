#include <windows.h>

/* NOTE(dat): You generally do NOT want to link this DllMain entry point
yourself. Your linker should have the /DLL flag and generate this entry
point function. This will make sure all exported symbols are available 
in your dll. I have found that explicitly providing this DllMain will
end up causing only some symbols (the one in the same compilation unit as 
this entry point) to be exported.
*/

BOOL APIENTRY DllMain(HANDLE hModule, 
  DWORD  ul_reason_for_call, 
  LPVOID lpReserved
) {
  return TRUE;
}
