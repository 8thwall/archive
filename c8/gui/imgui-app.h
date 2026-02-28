namespace c8 {

// Run an imgui app calling by calling this method, e.g:
//
// void layoutUiInRenderThread {
//   // call your imgui ui functions here.
// }
//
// int main(int argc, const char *argv[]) {
//   c8::startImGuiWindow("Hello ImGui", &layoutUiInRenderThread);
// }
int startImGuiWindow(
  const char *appName,
  void (*layoutUiInRenderThread)(void),
  void (*applicationWillTerminate)(void) = nullptr);

}  // namespace c8
